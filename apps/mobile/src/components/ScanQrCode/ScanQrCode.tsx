import React from 'react';
import { View, StyleSheet } from 'react-native';
import Camera from './Camera/Camera';

const ScanQrCode = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cameraContainer: {
    flex: 1,
  },
});

export default ScanQrCode;