import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileImage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {
    if (uid) {
      fetchProfileImage();
    }
  }, [uid]);

  const fetchProfileImage = async () => {
    try {
      const res = await axios.get(`https://triping-6.onrender.com/get-user-profile?uid=${uid}`);
      setImage(res.data.profile_image);
    } catch (err) {
      console.log('Error fetching profile image:', err);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      setLoading(true);

      const formData = new FormData();
      formData.append('image', {
        uri: selected.uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);
      formData.append('uid', uid!);
      formData.append('type', 'profile');

      try {
        await axios.post('https://triping-6.onrender.com/upload-profile-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setImage(selected.uri);
      } catch (error) {
        console.log('Upload error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6F00" />
        ) : (
          <>
            <Image
              source={
                image
                  ? { uri: image }
                  : require('../../assets/default-profile.png')
              }
              style={styles.image}
            />
            <View style={styles.editIcon}>
              <Ionicons name="pencil" size={20} color="white" />
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#FF6F00',
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 100,
    backgroundColor: '#FF6F00',
    borderRadius: 20,
    padding: 6,
  },
});
