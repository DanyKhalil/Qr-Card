import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../UserProfile/Button/Button';
import AddFieldModal from './AddFieldModal';
import EditFieldModal from './EditFieldModal';
import { Ionicons } from '@expo/vector-icons';

const CustomFieldsManager = ({ visible, onClose, contentType, onUpdateFields }) => {
  const [fields, setFields] = useState([]);
  const [addFieldModalVisible, setAddFieldModalVisible] = useState(false);
  const [editFieldModalVisible, setEditFieldModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  useEffect(() => {
    if (contentType && visible) {
      setFields([...contentType.fields]);
    }
  }, [contentType, visible]);

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'longtext', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'date', label: 'Date' },
    { value: 'json', label: 'JSON Data' },
    { value: 'image', label: 'Image Upload' } // Added image option
  ];

  const handleAddField = (newField) => {
    const fieldWithId = {
      ...newField,
      id: `field-${Date.now()}`,
      display_order: fields.length
    };
    const updatedFields = [...fields, fieldWithId];
    setFields(updatedFields);
    onUpdateFields(contentType.id, updatedFields);
  };

  const handleUpdateField = (fieldId, updatedField) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId ? { ...field, ...updatedField } : field
    );
    setFields(updatedFields);
    onUpdateFields(contentType.id, updatedFields);
  };

  const handleDeleteField = (fieldId) => {
    Alert.alert(
      'Delete Field',
      'Are you sure you want to delete this field? This will also delete all values for this field in existing items.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedFields = fields.filter(field => field.id !== fieldId);
            setFields(updatedFields);
            onUpdateFields(contentType.id, updatedFields);
          }
        }
      ]
    );
  };

  const handleReorder = (fieldId, direction) => {
    const index = fields.findIndex(f => f.id === fieldId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) {
      return;
    }

    const newFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap display orders
    [newFields[index].display_order, newFields[newIndex].display_order] = 
    [newFields[newIndex].display_order, newFields[index].display_order];
    
    // Swap positions
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    
    setFields(newFields);
    onUpdateFields(contentType.id, newFields);
  };

  const handleSaveAndClose = () => {
    onUpdateFields(contentType.id, fields);
    onClose();
  };

  // Get type label for display
  const getTypeLabel = (typeValue) => {
    return fieldTypes.find(t => t.value === typeValue)?.label || typeValue;
  };

  // Create sorted fields for display
  const sortedFields = [...fields].sort((a, b) => a.display_order - b.display_order);

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title={`Manage Fields - ${contentType?.name || 'Unknown'}`}
      size="large"
    >
      <View style={styles.fieldsManager}>
        <View style={styles.fieldsHeader}>
          <Text style={styles.fieldsDescription}>
            Define the fields for your {contentType?.name?.toLowerCase() || 'content type'}.
          </Text>
          <TouchableOpacity 
            style={styles.addFieldBtn}
            onPress={() => setAddFieldModalVisible(true)}
          >
            <Text style={styles.addFieldBtnText}>+ Add Field</Text>
          </TouchableOpacity>
        </View>

        {fields.length === 0 ? (
          <View style={styles.emptyFields}>
            <Text style={styles.emptyFieldsText}>No fields yet. Add your first field to get started.</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.fieldsList}
            showsVerticalScrollIndicator={true}
          >
            {sortedFields.map((field, index) => (
              <View key={field.id} style={styles.fieldItem}>
                <View style={styles.fieldInfo}>
                  <View style={styles.fieldMain}>
                    {/* Field key badge - like web version */}
                    <Text style={styles.fieldKey}>{field.field_key || field.key}</Text>
                  </View>
                  <View style={styles.fieldDetails}>
                    <Text style={styles.fieldType}>{getTypeLabel(field.field_type || field.type)}</Text>
                    {field.required && <Text style={styles.fieldRequired}>Required</Text>}
                  </View>
                  {/* Field label with italic style like web */}
                  {field.label && (
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                  )}
                </View>
                
                <View style={styles.fieldActions}>
                  <TouchableOpacity 
                    style={[
                      styles.fieldActionBtn, 
                      styles.moveBtn,
                      index === 0 && styles.disabledBtn
                    ]}
                    onPress={() => handleReorder(field.id, 'up')}
                    disabled={index === 0}
                  >
                    <Ionicons 
                      name="chevron-up" 
                      size={18} 
                      color={index === 0 ? "#C5B3FF" : "#6B63FF"} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.fieldActionBtn, 
                      styles.moveBtn,
                      index === sortedFields.length - 1 && styles.disabledBtn
                    ]}
                    onPress={() => handleReorder(field.id, 'down')}
                    disabled={index === sortedFields.length - 1}
                  >
                    <Ionicons 
                      name="chevron-down" 
                      size={18} 
                      color={index === sortedFields.length - 1 ? "#C5B3FF" : "#6B63FF"} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.fieldActionBtn, styles.editBtn]}
                    onPress={() => {
                      setCurrentField(field);
                      setEditFieldModalVisible(true);
                    }}
                  >
                    <Ionicons name="pencil-outline" size={18} color="#6B63FF" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.fieldActionBtn, styles.deleteBtn]}
                    onPress={() => handleDeleteField(field.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#C5B3FF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.fieldsManagerActions}>
          <Button 
            text="Done"
            color="green"
            onPress={handleSaveAndClose}
          />
        </View>

        <AddFieldModal
          visible={addFieldModalVisible}
          onClose={() => setAddFieldModalVisible(false)}
          onAdd={handleAddField}
          existingFields={fields}
          fieldTypes={fieldTypes.filter(t => t.value !== 'image')} // Pass without image for AddFieldModal
        />

        <EditFieldModal
          visible={editFieldModalVisible}
          onClose={() => setEditFieldModalVisible(false)}
          field={currentField}
          onUpdate={handleUpdateField}
          fieldTypes={fieldTypes.filter(t => t.value !== 'image')} // Pass without image for EditFieldModal
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fieldsManager: {
    height: 500, // Fixed height like web's max-height: 600px
    display: 'flex',
    flexDirection: 'column',
  },
  fieldsHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0DEFF',
  },
  fieldsDescription: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#555',
    flex: 1,
    marginRight: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  addFieldBtn: {
    backgroundColor: '#6B63FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addFieldBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fieldsList: {
    flex: 1,
    marginBottom: 24,
  },
  emptyFields: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    flex: 1,
  },
  emptyFieldsText: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fieldItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#F8F6FF',
    borderWidth: 1,
    borderColor: '#E0DEFF',
    borderRadius: 8,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  fieldKey: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 12,
    color: '#555',
    backgroundColor: '#EDE9FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fieldDetails: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  fieldType: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 12,
    color: '#6B63FF',
    backgroundColor: '#EDE9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fieldRequired: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 12,
    color: '#C5B3FF',
    backgroundColor: '#F8F6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fieldLabel: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  fieldActions: {
    flexDirection: 'row',
    gap: 4,
  },
  fieldActionBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0DEFF',
    borderRadius: 4,
    padding: 6,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveBtn: {
    // Specific styles if needed
  },
  editBtn: {
    backgroundColor: '#EDE9FF',
    borderColor: '#6B63FF',
  },
  deleteBtn: {
    backgroundColor: '#F8F6FF',
    borderColor: '#C5B3FF',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  fieldsManagerActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0DEFF',
  },
});

export default CustomFieldsManager;