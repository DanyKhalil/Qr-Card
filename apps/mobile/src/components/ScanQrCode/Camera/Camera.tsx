import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert, Linking} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Camera = () => {
  const [scanResult, setScanResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const scanResultRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const activateScanner = () => {
    setCameraActive(true);
    setScanResult(null);
    setScanned(false);
  };

  const deactivateScanner = () => {
    setCameraActive(false);
    setScanResult(null);
    setScanned(false);
  };

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      setScanResult(data);
      setCameraActive(false);
      
      if (isValidUrl(data)) {
        handleManualRedirect(data);
      }
    }
  };

  const isValidUrl = (string) => {
    try {
        const expoUrlPattern = /^(https?:\/\/|exp:\/\/)/i;
        
        if (string.startsWith('/--/') || string.startsWith('exp://')) {
        return true;
        }
        
        return expoUrlPattern.test(string);
    } catch (error) {
        console.error('Invalid URL format:', error);
        return false;
    }
  };

  const handleManualRedirect = (url = scanResult) => {
    if (url && isValidUrl(url)) {
        console.log('Navigating to:', url);
        
        if (url.startsWith('exp://') || url.startsWith('/--/')) {
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
        
        console.log('Cleaned path for navigation:', pathWithParam);
        
        router.push(pathWithParam);
        
        } else if (url.startsWith('http')) {
        const separator = url.includes('?') ? '&' : '?';
        const urlWithParam = `${url}${separator}qrScan=true`;
        Linking.openURL(urlWithParam).catch(err =>
            Alert.alert('Error', 'Cannot open URL: ' + err.message)
        );
        }
    } else {
        Alert.alert('Invalid URL', 'The scanned QR code does not contain a valid URL');
    }
  };

  const handleScanAgain = () => {
    setScanResult(null);
    setScanned(false);
    activateScanner();
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission is required to scan QR codes</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.scannerHeader}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.subtitle}>Position QR code within the frame to scan</Text>
      </View>

      <View style={styles.cameraViewport}>
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
            <View style={styles.scanFrame}>
              <View style={[styles.frameCorner, styles.topLeft]} />
              <View style={[styles.frameCorner, styles.topRight]} />
              <View style={[styles.frameCorner, styles.bottomLeft]} />
              <View style={[styles.frameCorner, styles.bottomRight]} />
            </View>
          </CameraView>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Ionicons name="camera-outline" size={64} color="#666" />
            <Text style={styles.placeholderText}>Camera inactive</Text>
          </View>
        )}
      </View>

      <View style={styles.scannerControls}>
        {!cameraActive ? (
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={activateScanner}>
            <Text style={styles.buttonText}>Start Scanning</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={deactivateScanner}>
            <Text style={styles.buttonText}>Stop Camera</Text>
          </TouchableOpacity>
        )}
      </View>

      {scanResult && (
        <View style={styles.scanResult} ref={scanResultRef}>
          <Text style={styles.successTitle}>Scan Successful!</Text>
          <View style={styles.resultUrl}>
            <Text style={styles.urlLabel}>Detected URL:</Text>
            <Text style={styles.urlText}>{scanResult}</Text>
          </View>
          <View style={styles.resultActions}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton, !isValidUrl(scanResult) && styles.disabledButton]}
              onPress={() => handleManualRedirect()}
              disabled={!isValidUrl(scanResult)}
            >
              <Text style={styles.buttonText}>Visit Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleScanAgain}>
              <Text style={styles.outlineButtonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
          {!isValidUrl(scanResult) && (
            <Text style={styles.errorMessage}>Invalid URL detected</Text>
          )}
        </View>
      )}

      <View style={styles.scannerInstructions}>
        <Text style={styles.instructionsTitle}>How to scan:</Text>
        <View style={styles.instructionsList}>
          <Text style={styles.instructionItem}>• Ensure good lighting</Text>
          <Text style={styles.instructionItem}>• Hold steady and align QR code within frame</Text>
          <Text style={styles.instructionItem}>• Keep appropriate distance from camera</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  scannerHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  cameraViewport: {
    height: 400,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    marginTop: 16,
    fontSize: 16,
  },
  scanFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -125 }, { translateY: -125 }],
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ff88',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scannerControls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  primaryButton: {
    backgroundColor: '#64A377',
  },
  secondaryButton: {
    backgroundColor: 'coral',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#64A377',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#64A377',
    fontSize: 16,
    fontWeight: '600',
  },
  scanResult: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  successTitle: {
    color: '#28a745',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultUrl: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  urlLabel: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  urlText: {
    color: '#495057',
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 18,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  errorMessage: {
    color: '#dc3545',
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  scannerInstructions: {
    backgroundColor: '#e4ffeb',
    borderWidth: 1,
    borderColor: '#87f2a4',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  instructionsTitle: {
    color: '#47855B',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructionsList: {
  },
  instructionItem: {
    color: '#333',
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontSize: 16,
  },
});

export default Camera;