import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions
} from "react-native";
import * as ImagePicker from 'expo-image-picker';

const ReceiptUploadModal = ({ 
  visible,
  onClose, 
  receiptFile, 
  onReceiptChange, 
  onUpload, 
  uploading, 
  message 
}) => {
  const [fileInfo, setFileInfo] = useState(null);

  const handleFilePick = async () => {
    if (uploading) return;

    try {
      // Request permission for iOS
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission required", "Please grant permission to access photos");
        return;
      }

      // Pick an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Check file type
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/jfif", "image/webp"];
        const mimeType = asset.mimeType || `image/${asset.uri.split('.').pop()}`;
        
        if (!validTypes.some(type => mimeType.includes(type))) {
          Alert.alert("Invalid file type", "Only image files are allowed (png, jpg, jpeg, jfif, webp)!");
          return;
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (asset.fileSize && asset.fileSize > maxSize) {
          Alert.alert("File too large", "File is too large! Maximum size is 5MB.");
          return;
        }

        // Create file object similar to web
        const file = {
          name: asset.fileName || `receipt_${Date.now()}`,
          size: asset.fileSize || 0,
          uri: asset.uri,
          type: mimeType
        };

        setFileInfo({
          name: file.name,
          size: file.size,
          uri: asset.uri
        });

        onReceiptChange(file);
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const handleRemoveFile = () => {
    setFileInfo(null);
    onReceiptChange(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={[styles.closeButton, uploading && styles.disabledButton]}
            onPress={onClose}
            disabled={uploading}
          >
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>📄 Upload Payment Receipt</Text>
            <Text style={styles.modalNote}>
              For existing subscriptions only. Upload a clear image of your payment receipt.
            </Text>
          </View>

          <View style={styles.uploadArea}>
            <TouchableOpacity 
              style={[styles.fileUploadButton, uploading && styles.disabledButton]}
              onPress={handleFilePick}
              disabled={uploading}
              activeOpacity={0.7}
            >
              <Text style={styles.uploadIcon}>📁 HELLOOO</Text>
              <Text style={styles.uploadText}>
                {fileInfo ? fileInfo.name : "Tap to choose file"}
              </Text>
              <Text style={styles.uploadSubtext}>
                {fileInfo ? formatFileSize(fileInfo.size) : "PNG, JPG, JPEG, JFIF up to 5MB"}
              </Text>
            </TouchableOpacity>

            {fileInfo && (
              <View style={styles.filePreview}>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileIcon}>📄</Text>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {fileInfo.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {formatFileSize(fileInfo.size)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.removeFileButton, uploading && styles.disabledButton]}
                    onPress={handleRemoveFile}
                    disabled={uploading}
                  >
                    <Text style={styles.removeIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {message && (
            <View style={[
              styles.messageContainer,
              uploading ? styles.uploadingMessage : styles.successMessage
            ]}>
              {uploading && <ActivityIndicator size="small" color="#1e40af" />}
              <Text style={[
                styles.messageText,
                uploading ? styles.uploadingText : styles.successText
              ]}>
                {message}
              </Text>
            </View>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.cancelButton, uploading && styles.disabledButton]}
              onPress={onClose}
              disabled={uploading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                (!fileInfo || uploading) && styles.disabledButton
              ]}
              onPress={onUpload}
              disabled={!fileInfo || uploading}
              activeOpacity={0.7}
            >
              {uploading ? (
                <>
                  <ActivityIndicator size="small" color="white" style={styles.loadingSpinner} />
                  <Text style={styles.sendButtonText}>Uploading...</Text>
                </>
              ) : (
                <Text style={styles.sendButtonText}>Upload Receipt</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: Math.min(width * 0.9, 500),
    maxHeight: height * 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.4,
    shadowRadius: 50,
    elevation: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeIcon: {
    fontSize: 24,
    color: '#64748b',
    fontWeight: '300',
    lineHeight: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalHeader: {
    padding: 40,
    paddingTop: 50,
    backgroundColor: '#3b82f6',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalNote: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  uploadArea: {
    padding: 40,
  },
  fileUploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  filePreview: {
    marginTop: 24,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  fileIcon: {
    fontSize: 32,
    color: '#3b82f6',
    marginRight: 16,
  },
  fileDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 13,
    color: '#64748b',
  },
  removeFileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: '#fecaca',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '300',
  },
  messageContainer: {
    marginHorizontal: 40,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  uploadingMessage: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    borderColor: '#86efac',
  },
  messageText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  uploadingText: {
    color: '#1e40af',
  },
  successText: {
    color: '#065f46',
  },
  loadingSpinner: {
    marginRight: 8,
  },
  modalActions: {
    padding: 30,
    paddingTop: 20,
    backgroundColor: '#f8fafc',
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  sendButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#10b981',
    minWidth: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

export default ReceiptUploadModal;