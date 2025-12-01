import React, { useState, useEffect } from 'react';
import { View,  Text,  TextInput,   TouchableOpacity, ScrollView,  Switch, Alert,StyleSheet } from 'react-native';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../UserProfile/Button/Button';

const EditItemModal = ({ visible, onClose, item, onUpdate, contentType }) => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    if (visible && item && contentType) {
      setTitle(item.title || '');
      setVisibility(item.visibility !== false);
      
      const initialValues = {};
      contentType.fields?.forEach(field => {
        const existingValue = item.values?.find(v => v.field_key === field.key);
        initialValues[field.key] = existingValue?.value || getDefaultValue(field.type);
      });
      setFieldValues(initialValues);
    }
  }, [visible, item, contentType]);

  const getDefaultValue = (fieldType) => {
    switch (fieldType) {
      case 'text': return '';
      case 'longtext': return '';
      case 'number': return '';
      case 'boolean': return false;
      case 'date': return '';
      case 'json': return {};
      default: return '';
    }
  };

  const handleFieldChange = (fieldKey, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleSubmit = () => {
    if (!item) return;

    // Validate required fields
    const requiredFields = contentType.fields?.filter(field => field.required) || [];
    const missingRequired = requiredFields.filter(field => {
      const value = fieldValues[field.key];
      return value === '' || value === null || value === undefined;
    });

    if (missingRequired.length > 0) {
      Alert.alert(
        'Required Fields',
        `Please fill in all required fields: ${missingRequired.map(f => f.name || f.label).join(', ')}`
      );
      return;
    }

    const valuesArray = Object.entries(fieldValues).map(([field_key, value]) => {
      const field = contentType.fields?.find(f => f.key === field_key);
      const existingValue = item.values?.find(v => v.field_key === field_key);
      
      return {
        id: existingValue?.id,
        field_id: field?.id,
        field_key: field_key,
        field_name: field?.name,
        field_label: field?.label,
        field_type: field?.type,
        value: value
      };
    });

    onUpdate(item.id, {
      title: title.trim(),
      visibility: visibility,
      values: valuesArray
    });
    onClose();
  };

  const renderFieldInput = (field) => {
    const value = fieldValues[field.key] || getDefaultValue(field.type);
    const fieldName = field.name || field.label || field.key;

    switch (field.type) {
      case 'text':
        return (
          <TextInput
            value={value}
            onChangeText={(text) => handleFieldChange(field.key, text)}
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            style={styles.fieldInput}
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
          />
        );
      
      case 'boolean':
        return (
          <View style={styles.checkboxField}>
            <Switch
              value={value}
              onValueChange={(checked) => handleFieldChange(field.key, checked)}
              trackColor={{ false: '#767577', true: '#82C294' }}
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
          />
        );
      
      default:
        return (
          <TextInput
            value={value}
            onChangeText={(text) => handleFieldChange(field.key, text)}
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            style={styles.fieldInput}
          />
        );
    }
  };

  if (!item) return null;

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title={`Edit ${contentType?.name || 'Item'}`}
    >
      <ScrollView style={styles.container}>
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

          {/* <View style={styles.formContent}>
            <View style={styles.checkboxField}>
              <Switch
                value={visibility}
                onValueChange={setVisibility}
                trackColor={{ false: '#767577', true: '#82C294' }}
              />
              <Text style={styles.checkboxLabel}>Visible to visitors</Text>
            </View>
          </View> */}
        </View>

        {contentType?.fields && contentType.fields.length > 0 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Field Values</Text>
            <View style={styles.fieldsGrid}>
              {contentType.fields
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((field) => (
                <View key={field.id} style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    {field.label || field.name}
                    {field.required && <Text style={styles.requiredStar}> *</Text>}
                  </Text>
                  <Text style={styles.fieldTypeHint}>
                    {field.type}
                  </Text>
                  {renderFieldInput(field)}
                </View>
              ))}
            </View>
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
            text="Save Changes"
            color="green"
            onPress={handleSubmit}
            disabled={!title.trim()}
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
    borderBottomColor: '#e5e5e5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  formContent: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    fontSize: 16,
  },
  fieldsGrid: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  requiredStar: {
    color: '#d32f2f',
  },
  fieldTypeHint: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  fieldInput: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FF8559',
    backgroundColor: '#fdf2ee',
    borderRadius: 8,
    fontSize: 16,
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
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    marginTop: 20,
  },
  actionBtn: {
    minWidth: 120,
  },
});

export default EditItemModal;