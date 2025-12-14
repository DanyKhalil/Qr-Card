import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Switch
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Button from '../../UserProfile/Button/Button';
import { Ionicons } from '@expo/vector-icons';

interface ProfileQrCodeProps {
  id: string;
  color: string;
  setter: (color: string) => void;
  includeProfilePic?: boolean;
  setIncludeProfilePic?: (value: boolean) => void;
  includeContact?: boolean;
  setIncludeContact?: (value: boolean) => void;
  includeSocialMedia?: boolean;
  setIncludeSocialMedia?: (value: boolean) => void;
  includeWebsite?: boolean;
  setIncludeWebsite?: (value: boolean) => void;
}

const ProfileQrCode = ({ 
  id, 
  color = "#000000", 
  setter,
  includeProfilePic = true,
  setIncludeProfilePic,
  includeContact = true,
  setIncludeContact,
  includeSocialMedia = true,
  setIncludeSocialMedia,
  includeWebsite = true,
  setIncludeWebsite
}: ProfileQrCodeProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const qrRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

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

  // Option items data
  const optionItems = [
    {
      id: 'profilePic',
      label: 'Profile Picture',
      icon: 'person',
      value: includeProfilePic,
      setter: setIncludeProfilePic
    },
    {
      id: 'contact',
      label: 'Contact Information',
      icon: 'call',
      value: includeContact,
      setter: setIncludeContact
    },
    {
      id: 'socialMedia',
      label: 'Social Media',
      icon: 'share-social',
      value: includeSocialMedia,
      setter: setIncludeSocialMedia
    },
    {
      id: 'website',
      label: 'Website',
      icon: 'globe',
      value: includeWebsite,
      setter: setIncludeWebsite
    }
  ];

  // Generate QR value based on selected options
  const generateQrValue = () => {
    const baseUrl = `user-profile/${id}`;
    const params = new URLSearchParams();
    
    if (setIncludeProfilePic) {
      params.append('profilePic', includeProfilePic ? 'true' : 'false');
    }
    if (setIncludeContact) {
      params.append('contact', includeContact ? 'true' : 'false');
    }
    if (setIncludeSocialMedia) {
      params.append('social', includeSocialMedia ? 'true' : 'false');
    }
    if (setIncludeWebsite) {
      params.append('website', includeWebsite ? 'true' : 'false');
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const qrValue = generateQrValue();

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Share Profile</Text>
        
        <View ref={qrRef} style={styles.qrContainer}>
          <QRCode
            value={qrValue}
            size={qrSize}
            backgroundColor="#ffffff"
            color={color}
          />
        </View>

        {/* QR Options Toggle */}
        <Button
          text={showOptions ? "Hide QR Options" : "Show QR Options"}
          color="blue"
          bold
          onPress={() => setShowOptions(!showOptions)}
          width={qrSize}
          style={{ marginTop: 16 }}
          icon={<Ionicons name="options" size={18} color="white" />}
        />

        {/* QR Options Container */}
        {showOptions && (
          <View style={styles.optionsContainer}>
            {optionItems.map((item) => (
              <View key={item.id} style={styles.optionItem}>
                <View style={styles.optionLeft}>
                  <Ionicons name={item.icon} size={22} color="#555" style={styles.optionIcon} />
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </View>
                {item.setter && (
                  <Switch
                    value={item.value}
                    onValueChange={item.setter}
                    trackColor={{ false: '#e9e9e9', true: '#82C294' }}
                    thumbColor={item.value ? '#fff' : '#f4f3f4'}
                    ios_backgroundColor="#e9e9e9"
                    style={styles.optionSwitch}
                  />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Color Picker Button */}
        <Button
          text="Change QR Color"
          color="blue"
          bold
          onPress={() => setShowColorPicker(true)}
          width={qrSize}
          style={{ marginTop: showOptions ? 0 : 16 }}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
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
    backgroundColor: '#ffffff',
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
  optionsContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#E3E0F3', // Soft Lavender
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#547DAD', // Primary Indigo Blue for dividers
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
    color: '#547DAD', // Primary Indigo Blue icons
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  optionSwitch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  colorPickerModal: {
    backgroundColor: '#E3E0F3', // Soft Lavender
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
    borderBottomColor: '#547DAD', // Primary Indigo Blue
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#547DAD',
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
    borderColor: '#547DAD',
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
    borderColor: '#547DAD',
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
    borderColor: '#547DAD', // Primary Indigo Blue highlight
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#547DAD', // Primary Indigo Blue
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#547DAD',
  },
});


export default ProfileQrCode;