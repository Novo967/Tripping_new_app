import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {
    if (uid) fetchGallery();
  }, [uid]);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`https://triping-6.onrender.com/get-user-profile?uid=${uid}`);
      setImages(res.data.gallery_images || []);
    } catch (err) {
      console.log('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      const formData = new FormData();

      formData.append('image', {
        uri: selected.uri,
        name: 'gallery.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('uid', uid!);
      formData.append('type', 'gallery');

      try {
        const res = await axios.post('https://triping-6.onrender.com/upload-profile-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setImages(prev => [res.data.url, ...prev]);
      } catch (error) {
        console.log('Upload error:', error);
      }
    }
  };

  if (loading) return <ActivityIndicator color="#FF6F00" />;

  return (
    <View>
      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        ListHeaderComponent={
          <TouchableOpacity style={styles.addButton} onPress={uploadImage}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#FF6F00',
    padding: 12,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});
