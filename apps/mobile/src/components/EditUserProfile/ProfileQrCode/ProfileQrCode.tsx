import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Button from '../../UserProfile/Button/Button';
import { Ionicons } from '@expo/vector-icons';

interface ProfileQrCodeProps {
  id: string;
  color: string;
  setter: (color: string) => void;
}

const ProfileQrCode = ({ id, color = "#000000", setter }: ProfileQrCodeProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const qrRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const qrSize = Math.min(screenWidth * 0.6, 280);

  // Predefined color options
  const presetColors = [
    "#000000", // Black
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Purple
    "#FFA07A", // Orange
    "#1F2937", // Dark Gray
    "#82C294", // Primary Green
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Profile</Text>
      
      <View ref={qrRef} style={styles.qrContainer}>
        <QRCode
          value={`user-profile/${id}`}
          size={qrSize}
          backgroundColor="#ffffff"
          color={color}
        />
      </View>

      {/* Color Picker Button */}
      <Button
        text="Change QR Color"
        color="blue"
        bold
        onPress={() => setShowColorPicker(true)}
        width={qrSize}
        style={{ marginTop: 16 }}
        icon={<Ionicons name="color-palette" size={18} color="white" />}
      />

      {/* Color Picker Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showColorPicker}
        onRequestClose={() => setShowColorPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowColorPicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.colorPickerModal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Color</Text>
                  <TouchableOpacity onPress={() => setShowColorPicker(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* Current Color Preview */}
                <View style={styles.currentColorSection}>
                  <Text style={styles.currentColorText}>Current Color:</Text>
                  <View style={styles.currentColorDisplay}>
                    <View 
                      style={[styles.colorPreview, { backgroundColor: color }]} 
                    />
                    <Text style={styles.colorHex}>{color.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Preset Colors Grid */}
                <Text style={styles.presetTitle}>Preset Colors</Text>
                <ScrollView 
                  style={styles.presetColorsGrid}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.presetColorsContainer}>
                    {presetColors.map((presetColor) => (
                      <TouchableOpacity
                        key={presetColor}
                        style={[
                          styles.colorSwatch,
                          { backgroundColor: presetColor },
                          color === presetColor && styles.selectedColorSwatch
                        ]}
                        onPress={() => {
                          setter(presetColor);
                          setShowColorPicker(false);
                        }}
                      >
                        {color === presetColor && (
                          <Ionicons name="checkmark" size={20} color="#fff" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Reset Button */}
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    setter("#000000");
                    setShowColorPicker(false);
                  }}
                >
                  <Ionicons name="refresh" size={18} color="#333" />
                  <Text style={styles.resetButtonText}>Reset to Black</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    marginTop: 16,
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  colorPickerModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  currentColorSection: {
    marginBottom: 20,
  },
  currentColorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  currentColorDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  colorHex: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 15,
  },
  presetColorsGrid: {
    maxHeight: 250,
  },
  presetColorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedColorSwatch: {
    borderWidth: 3,
    borderColor: '#82C294',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ProfileQrCode;