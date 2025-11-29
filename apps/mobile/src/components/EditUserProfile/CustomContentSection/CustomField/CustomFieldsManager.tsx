import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  StyleSheet 
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
    { value: 'json', label: 'JSON Data' }
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
    const newIndex = direction === 'up' ? index - 1 : direction === 'down' ? index + 1 : index;
    
    // Swap the display_order values
    const tempOrder = newFields[index].display_order;
    newFields[index].display_order = newFields[newIndex].display_order;
    newFields[newIndex].display_order = tempOrder;
    
    // Swap the array positions
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    
    setFields(newFields);
    onUpdateFields(contentType.id, newFields);
  };

  const handleSaveAndClose = () => {
    onUpdateFields(contentType.id, fields);
    onClose();
  };

  // Create sorted fields for display
  const sortedFields = [...fields].sort((a, b) => a.display_order - b.display_order);

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title={`Manage Fields - ${contentType?.name || 'Unknown'}`}
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
          <View style={styles.fieldsContent}>
            {sortedFields.map((field, index) => (
              <View key={field.id} style={styles.fieldItem}>
                <View style={styles.fieldInfo}>
                  <View style={styles.fieldDetails}>
                    <Text style={styles.fieldType}>
                      {fieldTypes.find(t => t.value === field.type)?.label || field.type}
                    </Text>
                    {field.required && <Text style={styles.fieldRequired}>Required</Text>}
                  </View>
                  <Text style={styles.fieldLabel}>{field.label || field.name || 'Unnamed Field'}</Text>
                  <Text style={styles.fieldKey}>Key: {field.key}</Text>
                </View>
                
                <View style={styles.fieldActions}>
                  <TouchableOpacity 
                    style={[styles.fieldActionBtn, styles.moveBtn, index === 0 && styles.disabledBtn]}
                    onPress={() => handleReorder(field.id, 'up')}
                    disabled={index === 0}
                  >
                    <Ionicons name="chevron-up" size={18} color={index === 0 ? "#999" : "#333"} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.fieldActionBtn, styles.moveBtn, index === sortedFields.length - 1 && styles.disabledBtn]}
                    onPress={() => handleReorder(field.id, 'down')}
                    disabled={index === sortedFields.length - 1}
                  >
                    <Ionicons name="chevron-down" size={18} color={index === sortedFields.length - 1 ? "#999" : "#333"} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.fieldActionBtn, styles.editBtn]}
                    onPress={() => {
                      setCurrentField(field);
                      setEditFieldModalVisible(true);
                    }}
                  >
                    <Ionicons name="pencil-outline" size={18} color="#2196f3" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.fieldActionBtn, styles.deleteBtn]}
                    onPress={() => handleDeleteField(field.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
          fieldTypes={fieldTypes}
        />

        <EditFieldModal
          visible={editFieldModalVisible}
          onClose={() => setEditFieldModalVisible(false)}
          field={currentField}
          onUpdate={handleUpdateField}
          fieldTypes={fieldTypes}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fieldsManager: {
    minHeight: 300,
  },
  fieldsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  fieldsDescription: {
    color: '#666',
    flex: 1,
    marginRight: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  addFieldBtn: {
    backgroundColor: '#82c294',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addFieldBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  fieldsContent: {
    marginBottom: 16,
  },
  emptyFields: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 16,
  },
  emptyFieldsText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#fdf2ee',
    borderRadius: 8,
  },
  fieldInfo: {
    flex: 1,
    marginRight: 12,
  },
  fieldDetails: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  fieldType: {
    fontSize: 12,
    color: '#007bff',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fieldRequired: {
    fontSize: 12,
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fieldLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  fieldKey: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  fieldActions: {
    flexDirection: 'row',
    gap: 4,
  },
  fieldActionBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 4,
    padding: 6,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveBtn: {},
  editBtn: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  deleteBtn: {
    backgroundColor: '#f3a7b2',
    borderColor: '#f44336',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  fieldsManagerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
});

export default CustomFieldsManager;