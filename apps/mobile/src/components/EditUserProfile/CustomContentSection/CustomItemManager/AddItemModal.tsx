import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../UserProfile/Button/Button';
import { Ionicons } from '@expo/vector-icons';

const AddItemModal = ({ visible, onClose, onAdd, contentType }) => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [fieldValues, setFieldValues] = useState({});
  const [uploadingImages, setUploadingImages] = useState({});

  useEffect(() => {
    if (visible && contentType) {
      setTitle('');
      setVisibility(true);
      // Initialize field values based on content type fields
      const initialValues = {};
      contentType.fields?.forEach(field => {
        initialValues[field.key] = getDefaultValue(field.type);
      });
      setFieldValues(initialValues);
      setUploadingImages({});
    }
  }, [visible, contentType]);

  const getDefaultValue = (fieldType) => {
    switch (fieldType) {
      case 'text': return '';
      case 'longtext': return '';
      case 'number': return '';
      case 'boolean': return false;
      case 'date': return '';
      case 'json': return {};
      case 'image': return ''; // Empty string for image URL
      default: return '';
    }
  };

  const handleFieldChange = (fieldKey, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const pickImage = async (fieldKey) => {
    // Request permissions
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload images.');
        return;
      }
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      // Show uploading state
      setUploadingImages(prev => ({
        ...prev,
        [fieldKey]: true
      }));

      try {
        const image = result.assets[0];
        
        // In a real app, you would upload the image to your server here
        // For now, we'll store the local URI and simulate upload
        const imageData = {
          uri: image.uri,
          name: image.fileName || `image_${Date.now()}.jpg`,
          type: image.type || 'image/jpeg',
          size: image.fileSize || 0,
          width: image.width,
          height: image.height,
        };

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        handleFieldChange(fieldKey, imageData);
        
        setUploadingImages(prev => ({
          ...prev,
          [fieldKey]: false
        }));

      } catch (error) {
        Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
        setUploadingImages(prev => ({
          ...prev,
          [fieldKey]: false
        }));
      }
    }
  };

  const removeImage = (fieldKey) => {
    handleFieldChange(fieldKey, '');
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = contentType.fields?.filter(field => field.required) || [];
    const missingRequired = requiredFields.filter(field => {
      const value = fieldValues[field.key];
      
      // Special handling for image type
      if (field.type === 'image') {
        return !value || value === '';
      }
      
      // Regular validation for other types
      return value === '' || value === null || value === undefined;
    });

    if (missingRequired.length > 0) {
      Alert.alert(
        'Required Fields',
        `Please fill in all required fields: ${missingRequired.map(f => f.name || f.label).join(', ')}`
      );
      return;
    }

    // Prepare field values for submission
    const valuesArray = Object.entries(fieldValues).map(([field_key, value]) => {
      const field = contentType.fields?.find(f => f.key === field_key);
      
      // Handle image data specially
      let finalValue = value;
      if (field?.type === 'image' && value && typeof value === 'object') {
        // In a real app, you would have uploaded the image and gotten a URL
        // For now, we'll use the local URI (this won't work for actual server submission)
        finalValue = value.uri;
      }

      return {
        field_id: field?.id,
        field_key: field_key,
        field_name: field?.name,
        field_label: field?.label,
        field_type: field?.type,
        value: finalValue
      };
    });

    onAdd({
      title: title.trim(),
      visibility: visibility,
      values: valuesArray
    });
    onClose();
  };

  const renderFieldInput = (field) => {
    const value = fieldValues[field.key] || getDefaultValue(field.type);
    const fieldName = field.name || field.label || field.key;
    const isUploading = uploadingImages[field.key];

    switch (field.type) {
      case 'text':
        return (
          <TextInput
            value={value}
            onChangeText={(text) => handleFieldChange(field.key, text)}
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            style={styles.fieldInput}
            required={field.required}
          />
        );
      
      case 'longtext':
        return (
          <TextInput
            value={value}
            onChangeText={(text) => handleFieldChange(field.key, text)}
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            style={[styles.fieldInput, styles.textArea]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <TextInput
            value={value.toString()}
            onChangeText={(text) => handleFieldChange(field.key, text)}
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            style={styles.fieldInput}
            keyboardType="numeric"
            required={field.required}
          />
        );
      
      case 'boolean':
        return (
          <View style={styles.checkboxField}>
            <Switch
              value={value}
              onValueChange={(checked) => handleFieldChange(field.key, checked)}
              trackColor={{ false: '#767577', true: '#6B63FF' }}
              thumbColor={value ? '#f4f3f4' : '#f4f3f4'}
            />
            <Text style={styles.checkboxLabel}>{field.label || field.name}</Text>
          </View>
        );
      
      case 'date':
        return (
          <TextInput
            value={value}
            onChangeText={(text) => handleFieldChange(field.key, text)}
            placeholder="YYYY-MM-DD"
            style={styles.fieldInput}
            required={field.required}
          />
        );
      
      case 'json':
        return (
          <TextInput
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChangeText={(text) => {
              try {
                const parsedValue = JSON.parse(text);
                handleFieldChange(field.key, parsedValue);
              } catch {
                handleFieldChange(field.key, text);
              }
            }}
            placeholder="Enter JSON data..."
            style={[styles.fieldInput, styles.textArea]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            required={field.required}
          />
        );
      
      case 'image':
        return (
          <View style={styles.imageUploadField}>
            {value && value.uri ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: value.uri }} 
                  style={styles.imagePreview}
                  resizeMode="contain"
                />
                <View style={styles.imageActions}>
                  <Button
                    text="Change"
                    color="green"
                    onPress={() => pickImage(field.key)}
                    size="small"
                    style={styles.imageActionBtn}
                  />
                  <Button
                    text="Remove"
                    color="coral"
                    onPress={() => removeImage(field.key)}
                    size="small"
                    style={styles.imageActionBtn}
                  />
                </View>
                {value.name && (
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileInfoText}>
                      <Text style={styles.fileInfoLabel}>File:</Text> {value.name}
                    </Text>
                    {value.size > 0 && (
                      <Text style={styles.fileInfoText}>
                        <Text style={styles.fileInfoLabel}>Size:</Text> {(value.size / 1024).toFixed(2)} KB
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ) : isUploading ? (
              <View style={styles.uploadingState}>
                <ActivityIndicator size="small" color="#6B63FF" />
                <Text style={styles.uploadingText}>Uploading image...</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imageUploadPlaceholder}
                onPress={() => pickImage(field.key)}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-upload-outline" size={40} color="#6B63FF" />
                <Text style={styles.uploadText}>Tap to upload image</Text>
                <Text style={styles.uploadHint}>Supports: JPG, PNG, GIF</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      
      default:
        return (
          <TextInput
            value={value}
            onChangeText={(text) => handleFieldChange(field.key, text)}
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            style={styles.fieldInput}
            required={field.required}
          />
        );
    }
  };

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title={`Add ${contentType?.name || 'Item'}`}
      size="large"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.formContent}>
            <Text style={styles.label}>
              Title *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter item title..."
              style={styles.input}
              autoFocus
            />
          </View>
        </View>

        {contentType?.fields && contentType.fields.length > 0 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Field Values</Text>
            <View style={styles.fieldsGrid}>
              {contentType.fields
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((field) => (
                <View key={field.id} style={[
                  styles.fieldGroup,
                  field.type === 'image' && styles.imageFieldGroup
                ]}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.fieldLabel}>
                      {field.label || field.name}
                      {field.required && <Text style={styles.requiredStar}> *</Text>}
                    </Text>
                    <Text style={styles.fieldTypeHint}>
                      {field.type === 'image' ? 'Image Upload' : field.type}
                    </Text>
                  </View>
                  {renderFieldInput(field)}
                </View>
              ))}
            </View>
          </View>
        )}

        {(!contentType?.fields || contentType.fields.length === 0) && (
          <View style={styles.noFieldsNotice}>
            <Text style={styles.noFieldsText}>
              No fields defined for this content type. Please add fields first.
            </Text>
          </View>
        )}
        
        <View style={styles.formActions}>
          <Button 
            text="Cancel"
            color="coral"
            onPress={onClose}
            style={styles.actionBtn}
          />
          <Button 
            text="Add Item"
            color="green"
            onPress={handleSubmit}
            disabled={!title.trim() || (!contentType?.fields || contentType.fields.length === 0)}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formSection: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0DEFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  formContent: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0DEFF',
    backgroundColor: '#F8F6FF',
    borderRadius: 8,
    fontSize: 16,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fieldsGrid: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  imageFieldGroup: {
    // Image fields can take more space
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  requiredStar: {
    color: '#C5B3FF',
  },
  fieldTypeHint: {
    fontSize: 12,
    color: '#6B63FF',
    backgroundColor: '#F8F6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fieldInput: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0DEFF',
    backgroundColor: '#F8F6FF',
    borderRadius: 8,
    fontSize: 16,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkboxField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  // Image Upload Styles
  imageUploadField: {
    marginTop: 8,
  },
  imageUploadPlaceholder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C5B3FF',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F6FF',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  uploadHint: {
    fontSize: 12,
    color: '#6B63FF',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  imagePreviewContainer: {
    marginTop: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0DEFF',
    backgroundColor: '#F8F6FF',
    marginBottom: 12,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  imageActionBtn: {
    flex: 1,
  },
  fileInfo: {
    padding: 10,
    backgroundColor: '#F8F6FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0DEFF',
  },
  fileInfoText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fileInfoLabel: {
    fontWeight: '600',
  },
  uploadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#6B63FF',
    borderRadius: 8,
    backgroundColor: '#EDE9FF',
  },
  uploadingText: {
    color: '#6B63FF',
    fontWeight: '500',
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  noFieldsNotice: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F6FF',
    borderRadius: 6,
    marginVertical: 16,
  },
  noFieldsText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  formActions: {
    flexDirection: 'column',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0DEFF',
    marginTop: 20,
    width: '100%',
  },
  actionBtn: {
    minWidth: 120,
    width: '100%',
  },
});

export default AddItemModal;