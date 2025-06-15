import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

import AddEventButton from '../../MapButtons/AddEventButton';
import DistanceFilterButton from '../../MapButtons/DistanceFilterButton';

interface User {
  uid: string;
  latitude: number;
  longitude: number;
  profile_image: string;
}

interface Event {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [radiusKm, setRadiusKm] = useState(50); // ברירת מחדל לסינון מרחק

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const current = await Location.getCurrentPositionAsync({});
      setLocation(current);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyUsers();
      fetchEvents();
    }
  }, [location, radiusKm]);

  const fetchNearbyUsers = async () => {
    try {
      const res = await axios.get(`https://triping-6.onrender.com/get-nearby-users`, {
        params: {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          radius_km: radiusKm,
        },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.log('Error fetching users:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`https://triping-6.onrender.com/get-events`);
      setEvents(res.data.events);
    } catch (err) {
      console.log('Error fetching events:', err);
    }
  };

  if (!location) return null;

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* משתמשים */}
        {users.map((user) => (
          <Marker
            key={user.uid}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
          >
            <View style={styles.markerContainer}>
              <Image source={{ uri: user.profile_image }} style={styles.profileImage} />
            </View>
          </Marker>
        ))}

        {/* אירועים */}
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            title={event.title}
          />
        ))}
      </MapView>

      {/* כפתורים */}
      <AddEventButton />
      <DistanceFilterButton onRadiusChange={setRadiusKm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FF6F00',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
