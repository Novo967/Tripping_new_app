import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import ProfileImage from '../ProfileComponents/ProfileImage';
import Bio from '../ProfileComponents/Bio';
import Gallery from '../ProfileComponents/Gallery';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileImage />
      <Bio />
      <Text style={styles.sectionTitle}>הגלריה שלך</Text>
      <Gallery />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#FF6F00',
  },
});
