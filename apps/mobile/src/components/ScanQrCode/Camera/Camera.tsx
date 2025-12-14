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
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import jsQR from 'jsqr';

const CameraComponent = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scanningImage, setScanningImage] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();

  const [webviewImage, setWebviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!permission) requestPermission();
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
              if (isValidUrl(data)) handleManualRedirect(data);
            },
          },
          {
            text: 'Scan Again',
            onPress: () => {
              setScanned(false);
              setCameraActive(true);
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const isValidUrl = (string: string) => {
    try {
      return (
        string.startsWith('http://') ||
        string.startsWith('https://') ||
        string.startsWith('exp://') ||
        string.startsWith('/--/') ||
        !!new URL(string)
      );
    } catch {
      return false;
    }
  };

  const handleManualRedirect = (url: string) => {
    if (!url) return;

    if (url.startsWith('exp://') || url.startsWith('/--/')) {
      let path = url;

      if (url.startsWith('exp://')) {
        const match = url.match(/\/--\/(.+)/);
        path = match ? match[1] : url;
      } else if (url.startsWith('/--/')) {
        path = path.substring(4);
      }

      path = path.replace(/^[^/]+\/\//, '').replace(/^[^/]+\//, '');
      const separator = path.includes('?') ? '&' : '?';
      router.push(`/${path}${separator}qrScan=true`);
    } else {
      Linking.openURL(url).catch((err) =>
        Alert.alert('Error', 'Cannot open URL: ' + err.message)
      );
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
              mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ fixed
              allowsEditing: false,
              quality: 1,
              base64: true,
          });

          if (!result.canceled && result.assets?.[0]) {
              const selectedImage = result.assets[0];
              setUploadedImage(selectedImage.uri);
              setWebviewImage(selectedImage.base64!);
              setScanningImage(true);
          }
      } catch (error) {
          console.error('Error picking image:', error);
          Alert.alert('Error', 'Failed to pick image. ' + error.message);
      }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setScanningImage(false);
    setWebviewImage(null);
  };

  /** HTML that runs inside WebView */
  const webviewHTML = `
    <html>
      <body style="margin:0;padding:0;overflow:hidden;background:black;">
        <canvas id="canvas"></canvas>
        <script src="https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.js"></script>
        <script>
          const imgBase64 = "${webviewImage}";
          const img = new Image();
          img.src = "data:image/jpeg;base64," + imgBase64;
          img.onload = () => {
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);
            if (code) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "QR_RESULT",
                data: code.data
              }));
            } else {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "NO_QR"
              }));
            }
          };
        </script>
      </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);

    if (message.type === 'QR_RESULT') {
      setScanningImage(false);
      setScanResult(message.data);
      Alert.alert('QR Code Found!', message.data);
    } else if (message.type === 'NO_QR') {
      setScanningImage(false);
      Alert.alert('No QR Code Found', 'The selected image does not contain a QR code.');
    }
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
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="qr-code" size={48} color="#7480d7ff" />
          <Text style={styles.title}>QR Code Scanner</Text>
          <Text style={styles.subtitle}>Scan QR codes with your camera or images</Text>
        </View>

        {/* Camera / Image */}
        <View style={styles.cameraContainer}>
          {cameraActive ? (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            >
              <View style={styles.scanOverlay}>
                <View style={styles.scanFrame} />
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

        {webviewImage && (
          <WebView
            source={{ html: webviewHTML }}
            onMessage={handleWebViewMessage}
            style={{ height: 0, width: 0, opacity: 0 }}
          />
        )}

        {/* Buttons */}
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

        {/* QR Result */}
        {scanResult && (
          <View style={styles.resultContainer}>
            <Ionicons name="checkmark-circle" size={40} color="#28a745" />
            <Text style={styles.resultTitle}>QR Code Detected!</Text>
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Content:</Text>
              <Text style={styles.resultText}>{scanResult}</Text>
            </View>

            {isValidUrl(scanResult) && (
              <TouchableOpacity
                style={styles.urlButton}
                onPress={() => handleManualRedirect(scanResult)}
              >
                <Ionicons name="open-outline" size={20} color="white" />
                <Text style={styles.urlButtonText}>Open URL</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

/* ----------------------------- STYLES ------------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3FF' }, // soft lavender background
  scrollContent: { padding: 20 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { fontSize: 18, color: '#4B4C7A', marginTop: 16, marginBottom: 24 }, // muted indigo
  permissionButton: { backgroundColor: '#C8C1F9', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  permissionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4B4C7A', marginTop: 12 }, // muted indigo
  subtitle: { fontSize: 16, color: '#6B6C8A', marginTop: 4 }, // lighter muted indigo

  cameraContainer: {
    height: 350,
    backgroundColor: '#EDE9FE', // soft lavender
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: { flex: 1 },

  scanOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#C8C1F9' }, // muted indigo frame
  scanText: {
    color: '#4B4C7A',
    marginTop: 20,
    fontSize: 16,
    backgroundColor: 'rgba(245,243,255,0.7)', // soft lavender overlay
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EDE9FE' },
  image: { width: '100%', height: '100%' },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(75,76,122,0.7)', // muted indigo overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: { color: 'white', marginTop: 12, fontSize: 16 },

  cameraPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D8D4F2' }, // soft lavender
  placeholderText: { color: '#4B4C7A', marginTop: 12, fontSize: 16 },

  controls: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' },

  primaryButton: {
    backgroundColor: '#C8C1F9', // muted indigo
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
    backgroundColor: '#9A92E8', // deeper muted indigo
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
    backgroundColor: '#A89EE8', // soft lavender button
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  clearButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, marginBottom: 20 },
  clearButtonText: { color: '#4B4C7A', fontSize: 14 },

  resultContainer: {
    backgroundColor: '#F5F3FF', // soft lavender
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8C1F9', // muted indigo border
  },
  resultTitle: { fontSize: 18, fontWeight: '600', color: '#4B4C7A', marginTop: 12, marginBottom: 16 },
  resultBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2C9F0',
    width: '100%',
    marginBottom: 16,
  },
  resultLabel: { fontWeight: '600', color: '#4B4C7A', marginBottom: 8 },
  resultText: { color: '#6B6C8A', fontSize: 14, lineHeight: 20 },

  urlButton: {
    backgroundColor: '#C8C1F9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  urlButtonText: { color: '#fff', fontWeight: '600' },
});


export default CameraComponent;
