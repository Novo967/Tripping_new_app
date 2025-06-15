from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, GalleryImage
from datetime import datetime
import uuid
import os

app = Flask(__name__)
CORS(app)

# Database setup
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://trippingnewdb_user:DT03VR0PxLtMWiEvfVSO3ucBcT15iMmr@dpg-d178dd15pdvs7382t61g-a.oregon-postgres.render.com/trippingnewdb")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/get-user-profile', methods=['POST'])
def get_user_profile():
    data = request.get_json()
    uid = data.get('uid')
    session = Session()
    user = session.query(User).filter_by(uid=uid).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'username': user.username,
        'profile_image': user.profile_image,
        'gallery': [img.image_url for img in user.gallery_images],
        'latitude': user.latitude,
        'longitude': user.longitude
    })

@app.route('/update-user-profile', methods=['POST'])
def update_user_profile():
    data = request.get_json()
    uid = data.get('uid')
    username = data.get('username')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    session = Session()
    user = session.query(User).filter_by(uid=uid).first()
    if not user:
        user = User(id=str(uuid.uuid4()), uid=uid)
    user.username = username
    user.latitude = latitude
    user.longitude = longitude
    session.add(user)
    session.commit()
    return jsonify({'message': 'Profile updated'})

@app.route('/upload-profile-image', methods=['POST'])
def upload_profile_image():
    file = request.files.get('image')
    uid = request.form.get('uid')
    if not file or not uid:
        return jsonify({'error': 'Missing data'}), 400
    filename = f"profile_{uid}_{str(uuid.uuid4())}.jpg"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    session = Session()
    user = session.query(User).filter_by(uid=uid).first()
    if user:
        user.profile_image = request.host_url + 'uploads/' + filename
        session.commit()
        return jsonify({'url': user.profile_image})
    return jsonify({'error': 'User not found'}), 404

@app.route('/upload-gallery-image', methods=['POST'])
def upload_gallery_image():
    file = request.files.get('image')
    uid = request.form.get('uid')
    if not file or not uid:
        return jsonify({'error': 'Missing data'}), 400
    filename = f"gallery_{uid}_{str(uuid.uuid4())}.jpg"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    image_url = request.host_url + 'uploads/' + filename
    session = Session()
    new_image = GalleryImage(uid=uid, image_url=image_url)
    session.add(new_image)
    session.commit()
    return jsonify({'url': image_url})

@app.route('/get-users-nearby', methods=['POST'])
def get_users_nearby():
    data = request.get_json()
    lat = data.get('latitude')
    lon = data.get('longitude')
    radius = data.get('radius', 50)
    session = Session()
    users = session.query(User).all()
    def distance(u):
        from math import radians, cos, sin, asin, sqrt
        dlat = radians(u.latitude - lat)
        dlon = radians(u.longitude - lon)
        a = sin(dlat/2)**2 + cos(radians(lat)) * cos(radians(u.latitude)) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        km = 6371 * c
        return km
    nearby_users = [u for u in users if u.latitude and u.longitude and distance(u) <= radius]
    result = [{
        'uid': u.uid,
        'username': u.username,
        'profile_image': u.profile_image,
        'latitude': u.latitude,
        'longitude': u.longitude
    } for u in nearby_users]
    return jsonify(result)

if __name__ == '__main__':
    app.run()