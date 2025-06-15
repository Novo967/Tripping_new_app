import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';

export default function AddEventButton() {
  const handleAddEvent = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('אין הרשאת מיקום');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    Alert.prompt(
      'הוסף אירוע חדש',
      'כתוב כותרת לאירוע שלך',
      async (title) => {
        if (!title) return;
        try {
          await axios.post('https://triping-6.onrender.com/add-event', {
            title,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          Alert.alert('🎉 האירוע נוסף בהצלחה!');
        } catch (err) {
          console.log(err);
          Alert.alert('שגיאה בהוספת האירוע');
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAddEvent} style={styles.button}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#FF6F00',
    padding: 16,
    borderRadius: 50,
    elevation: 5,
  },
});
