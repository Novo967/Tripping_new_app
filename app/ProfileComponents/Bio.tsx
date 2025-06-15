import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

export default function Bio() {
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {
    if (uid) fetchBio();
  }, [uid]);

  const fetchBio = async () => {
    try {
      const res = await axios.get(`https://tripping-new-app.onrender.com/get-user-profile?uid=${uid}`);
      if (res.data && res.data.bio) setBio(res.data.bio);
    } catch (err) {
      console.log('Error fetching bio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBioChange = async (newBio: string) => {
    setBio(newBio);
    try {
      await axios.post('https://tripping-new-app.onrender.com/update-user-profile', {
        uid,
        bio: newBio,
      });
    } catch (err) {
      console.log('Error updating bio:', err);
    }
  };

  if (loading) return <ActivityIndicator size="small" color="#FF6F00" />;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="כתוב משהו על עצמך..."
        value={bio}
        onChangeText={handleBioChange}
        multiline
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
});
