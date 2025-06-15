from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    uid = Column(String(128), unique=True, nullable=False)
    profile_image = Column(String)
    username = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    gallery_images = relationship(
        'GalleryImage',
        back_populates='user',
        foreign_keys='GalleryImage.uid',
        primaryjoin='User.uid==GalleryImage.uid'
    )

class GalleryImage(Base):
    __tablename__ = 'gallery_images'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    uid = Column(String(128), ForeignKey('users.uid'), nullable=False)
    image_url = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="gallery_images")