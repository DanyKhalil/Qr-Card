import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet,
  Alert 
} from 'react-native';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../UserProfile/Button/Button';

const AddFieldModal = ({ visible, onClose, onAdd, existingFields, fieldTypes }) => {
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [required, setRequired] = useState(false);

  useEffect(() => {
    if (visible) {
      setFieldLabel('');
      setFieldType('text');
      setRequired(false);
    }
  }, [visible]);

  const generateFieldName = (label) => {
    return label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s_]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_');
  };

  const handleSubmit = () => {
    if (fieldLabel.trim()) {
      const fieldName = generateFieldName(fieldLabel);
      const fieldKey = fieldName;

      // Check if field key is unique
      if (existingFields.some(field => field.field_key === fieldKey)) {
        Alert.alert(
          'Duplicate Field',
          'A field with this name already exists. Please choose a different name.'
        );
        return;
      }

      onAdd({
        name: fieldName,
        key: fieldKey,
        label: fieldLabel.trim(),
        type: fieldType,
        required: required,
        config: null
      });
      onClose();
    }
  };

  const generatedName = fieldLabel ? generateFieldName(fieldLabel) : '...';

  // Combine fieldTypes with image option
  const allFieldTypes = [
    ...fieldTypes,
    { value: 'image', label: 'Image Upload' }
  ];

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title="Add Field"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.formContent}>
          <Text style={styles.label}>
            Field Label *
          </Text>
          <TextInput
            value={fieldLabel}
            onChangeText={setFieldLabel}
            placeholder="e.g., Cooking Time, Ingredients, Description, Profile Photo"
            placeholderTextColor="#999"
            style={styles.input}
            autoFocus
          />
          <Text style={styles.slugHint}>
            Field name will be auto-generated: {generatedName}
          </Text>
        </View>

        <View style={styles.formContent}>
          <Text style={styles.label}>
            Field Type *
          </Text>
          <View style={styles.pickerContainer}>
            {allFieldTypes.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.option,
                  fieldType === type.value && styles.optionSelected
                ]}
                onPress={() => setFieldType(type.value)}
              >
                <Text style={[
                  styles.optionText,
                  fieldType === type.value && styles.optionTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Show hint for image type */}
          {fieldType === 'image' && (
            <View style={styles.fieldTypeHint}>
              <Text style={styles.hintText}>
                Users will be able to upload any image file.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.formContent}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setRequired(!required)}
          >
            <View style={[
              styles.checkbox,
              required && styles.checkboxChecked
            ]}>
              {required && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Required Field</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formActions}>
          <Button 
            text="Cancel"
            color="coral"
            onPress={onClose}
            style={styles.actionBtn}
          />
          <Button 
            text="Add Field"
            color="green"
            onPress={handleSubmit}
            disabled={!fieldLabel.trim()}
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
  formContent: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FF', // Soft lavender border
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4F46E5", // Indigo
    marginBottom: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#C5B3FF", // Soft lavender border
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#F8F6FF', // Soft lavender background
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#1F2937", // Darker text for readability
  },
  slugHint: {
    fontSize: 12,
    color: "#6B63FF", // Indigo accent
    marginTop: 6,
    fontStyle: 'italic',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#C5B3FF",
    borderRadius: 8,
    backgroundColor: '#F0EEFF', // Soft lavender
    minWidth: 100,
  },
  optionSelected: {
    borderColor: "#4F46E5", // Indigo
    backgroundColor: '#EDE9FF', // Soft lavender
  },
  optionText: {
    fontSize: 14,
    color: "#4B4B7D", // Slightly darker indigo tone
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: "#4F46E5", // Indigo
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#C5B3FF",
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
  },
  checkboxChecked: {
    borderColor: "#4F46E5",
    backgroundColor: "#4F46E5",
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#1F2937",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  formActions: {
    flexDirection: "column",
    gap: 12,
    marginTop: 10,
  },
  actionBtn: {
    width: "100%",
  },
  fieldTypeHint: {
    backgroundColor: '#EDE9FF',
    borderWidth: 1,
    borderColor: '#C5B3FF',
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
  },
  hintText: {
    fontSize: 13,
    color: '#4F46E5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 18,
  },
});

export default AddFieldModal;