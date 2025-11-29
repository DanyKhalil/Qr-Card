import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet 
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
        alert('A field with this name already exists. Please choose a different name.');
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

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title="Add Field"
    >
      <ScrollView style={styles.container}>
        <View style={styles.formContent}>
          <Text style={styles.label}>
            Field Label *
          </Text>
          <TextInput
            value={fieldLabel}
            onChangeText={setFieldLabel}
            placeholder="e.g., Cooking Time, Ingredients, Description"
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
            {fieldTypes.map(type => (
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
    paddingBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    fontSize: 16,
  },
  slugHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: 'italic',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: "#64A377",
    backgroundColor: '#f0f9f0',
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  optionTextSelected: {
    color: "#64A377",
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: "#64A377",
    backgroundColor: "#64A377",
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#333",
  },
  formActions: {
    flexDirection: "column",
    gap: 12,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 20,
  },
  actionBtn: {
    width: "100%",
  },
});

export default AddFieldModal;