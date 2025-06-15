import React, { useState } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface Props {
  onRadiusChange: (value: number) => void;
}

export default function DistanceFilterButton({ onRadiusChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [radius, setRadius] = useState(50);

  const handleConfirm = () => {
    onRadiusChange(radius);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>בחר מרחק (בקמ)</Text>
            <Slider
              minimumValue={10}
              maximumValue={100}
              step={10}
              value={radius}
              onValueChange={setRadius}
              minimumTrackTintColor="#FF6F00"
              maximumTrackTintColor="#ccc"
            />
            <Text style={styles.value}>{radius} קמ</Text>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>אישור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#FF6F00',
    padding: 14,
    borderRadius: 50,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  value: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF6F00',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#FF6F00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
