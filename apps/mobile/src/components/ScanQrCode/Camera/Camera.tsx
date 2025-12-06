import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  Linking, 
  Image as RNImage,
  ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CameraComponent = () => {
  const [scanResult, setScanResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scanningImage, setScanningImage] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkPermissions = async () => {
      if (!permission) {
        await requestPermission();
      }
    };
    checkPermissions();
  }, []);

  const activateScanner = () => {
    setCameraActive(true);
    setScanResult(null);
    setScanned(false);
    setUploadedImage(null);
  };

  const deactivateScanner = () => {
    setCameraActive(false);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setScanResult(data);
      setCameraActive(false);
      
      Alert.alert(
        'QR Code Scanned!',
        `Type: ${type}\nData: ${data}`,
        [
          {
            text: 'Open URL',
            onPress: () => {
              if (isValidUrl(data)) {
                handleManualRedirect(data);
              }
            }
          },
          {
            text: 'Scan Again',
            onPress: () => {
              setScanned(false);
              setCameraActive(true);
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    }
  };

  const isValidUrl = (string) => {
    try {
      // Check if it's a URL
      if (string.startsWith('http://') || 
          string.startsWith('https://') || 
          string.startsWith('exp://') ||
          string.startsWith('/--/')) {
        return true;
      }
      
      // Try to create a URL object
      new URL(string);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleManualRedirect = (url) => {
    if (!url) return;
    
    if (url.startsWith('exp://') || url.startsWith('/--/')) {
      // Handle Expo deep links
      let path = url;
      
      if (url.startsWith('exp://')) {
        const match = url.match(/\/--\/(.+)/);
        path = match ? match[1] : url;
      } else if (url.startsWith('/--/')) {
        path = url.substring(4);
      }
      
      path = path.replace(/^[^/]+\/\//, '');
      path = path.replace(/^[^/]+\//, '');
      
      const separator = path.includes('?') ? '&' : '?';
      const pathWithParam = `/${path}${separator}qrScan=true`;
      
      router.push(pathWithParam);
    } else if (url.startsWith('http')) {
      // Open web URLs
      Linking.openURL(url).catch(err =>
        Alert.alert('Error', 'Cannot open URL: ' + err.message)
      );
    } else {
      Alert.alert('Invalid URL', 'The scanned QR code does not contain a valid URL');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        setUploadedImage(selectedImage.uri);
        setScanningImage(true);
        
        // Simulate QR code detection (for demo)
        setTimeout(() => {
          setScanningImage(false);
          Alert.alert(
            'Image Uploaded',
            'To detect QR codes from images, implement a backend API.\n\nFor now, use the camera for real-time scanning.',
            [
              {
                text: 'Use Camera',
                onPress: () => {
                  setUploadedImage(null);
                  activateScanner();
                }
              },
              {
                text: 'OK',
                style: 'cancel'
              }
            ]
          );
        }, 1500);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
      setScanningImage(false);
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setScanningImage(false);
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#64A377" />
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off" size={64} color="#999" />
        <Text style={styles.permissionText}>Camera access is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="qr-code" size={48} color="#64A377" />
          <Text style={styles.title}>QR Code Scanner</Text>
          <Text style={styles.subtitle}>Scan QR codes with your camera</Text>
        </View>

        <View style={styles.cameraContainer}>
          {cameraActive ? (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr']
              }}
            >
              <View style={styles.scanOverlay}>
                <View style={styles.scanFrame}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                <Text style={styles.scanText}>Align QR code within frame</Text>
              </View>
            </CameraView>
          ) : uploadedImage ? (
            <View style={styles.imageContainer}>
              <RNImage source={{ uri: uploadedImage }} style={styles.image} />
              {scanningImage && (
                <View style={styles.scanningOverlay}>
                  <ActivityIndicator size="large" color="#64A377" />
                  <Text style={styles.scanningText}>Processing image...</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera-outline" size={64} color="#666" />
              <Text style={styles.placeholderText}>Camera is off</Text>
            </View>
          )}
        </View>

        <View style={styles.controls}>
          {!cameraActive ? (
            <TouchableOpacity style={styles.primaryButton} onPress={activateScanner}>
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.buttonText}>Start Scanning</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.secondaryButton} onPress={deactivateScanner}>
              <Ionicons name="camera-off" size={24} color="white" />
              <Text style={styles.buttonText}>Stop Scanning</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color="white" />
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        {uploadedImage && !scanningImage && (
          <TouchableOpacity style={styles.clearButton} onPress={clearUploadedImage}>
            <Ionicons name="close-circle" size={20} color="#666" />
            <Text style={styles.clearButtonText}>Clear Image</Text>
          </TouchableOpacity>
        )}

        {scanResult && (
          <View style={styles.resultContainer}>
            <Ionicons name="checkmark-circle" size={40} color="#28a745" />
            <Text style={styles.resultTitle}>QR Code Detected!</Text>
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Content:</Text>
              <Text style={styles.resultText} numberOfLines={3}>{scanResult}</Text>
            </View>
            <View style={styles.resultActions}>
              {isValidUrl(scanResult) && (
                <TouchableOpacity 
                  style={styles.urlButton}
                  onPress={() => handleManualRedirect(scanResult)}
                >
                  <Ionicons name="open-outline" size={20} color="white" />
                  <Text style={styles.urlButtonText}>Open URL</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.scanAgainButton}
                onPress={() => {
                  setScanResult(null);
                  setScanned(false);
                  activateScanner();
                }}
              >
                <Ionicons name="refresh" size={20} color="#64A377" />
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#64A377" />
          <Text style={styles.infoTitle}>How to use:</Text>
          <Text style={styles.infoText}>• Use camera for real-time QR code scanning</Text>
          <Text style={styles.infoText}>• Ensure good lighting and steady hands</Text>
          <Text style={styles.infoText}>• Image upload is for demo purposes only</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#64A377',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  cameraContainer: {
    height: 350,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ff88',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderText: {
    color: '#666',
    marginTop: 12,
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#64A377',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
    justifyContent: 'center',
    gap: 8,
  },
  uploadButton: {
    backgroundColor: '#45B7D1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
  },
  resultContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28a745',
    marginTop: 12,
    marginBottom: 16,
  },
  resultBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    width: '100%',
    marginBottom: 16,
  },
  resultLabel: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultText: {
    color: '#495057',
    fontSize: 14,
    lineHeight: 20,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  urlButton: {
    backgroundColor: '#64A377',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  urlButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  scanAgainButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#64A377',
    gap: 8,
  },
  scanAgainButtonText: {
    color: '#64A377',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e4ffeb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#87f2a4',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#47855B',
    marginTop: 8,
    marginBottom: 12,
  },
  infoText: {
    color: '#333',
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default CameraComponent;