import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';
import './CustomFieldsManager.css';
import AddFieldModal from './AddFieldModal';
import EditFieldModal from './EditFieldModal';
import { IoAlbumsOutline, IoGitBranchOutline, IoLayersOutline, IoListOutline, IoPencil, IoTrash } from 'react-icons/io5';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

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
    if (window.confirm('Are you sure you want to delete this field? This will also delete all values for this field in existing items.')) {
      const updatedFields = fields.filter(field => field.id !== fieldId);
      setFields(updatedFields);
      onUpdateFields(contentType.id, updatedFields);
    }
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

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title={`Manage Fields - ${contentType?.name}`}
      size="large"
    >
      <div className="fields-manager">
        <div className="fields-header">
          <p className="fields-description">
            Define the fields for your {contentType?.name?.toLowerCase() || 'content type'}.
          </p>
          <button 
            className="add-field-btn"
            onClick={() => setAddFieldModalVisible(true)}
          >
            + Add Field
          </button>
        </div>

        <div className="fields-list">
          {fields.length === 0 ? (
            <div className="empty-fields">
              <p>No fields yet. Add your first field to get started.</p>
            </div>
          ) : (
            fields.sort((a, b) => a.display_order - b.display_order).map((field, index) => (
              <div key={field.id} className="field-item">
                <div className="field-info">
                  <div className="field-main">
                    {/* <span className="field-name">{field.field_name}</span> */}
                    {/* <span className="field-key">({field.field_key})</span> */}
                  </div>
                  <div className="field-details">
                    <span className="field-type">{fieldTypes.find(t => t.value === field.type)?.label}</span>
                    {field.required && <span className="field-required">Required</span>}
                  </div>
                  {field.label && <div className="field-label">{field.label}</div>}
                </div>
                
                <div className="field-actions">
                  <button 
                    className="field-action-btn move-btn"
                    onClick={() => handleReorder(field.id, 'up')}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <IoIosArrowUp size={18} />
                  </button>
                  <button 
                    className="field-action-btn move-btn"
                    onClick={() => handleReorder(field.id, 'down')}
                    disabled={index === fields.length - 1}
                    title="Move down"
                  >
                    <IoIosArrowDown size={18} />
                  </button>
                  <button 
                    className="field-action-btn edit-btn"
                    onClick={() => {
                      setCurrentField(field);
                      setEditFieldModalVisible(true);
                    }}
                    title="Edit field"
                  >
                    <IoPencil size={18}/>
                  </button>
                  <button 
                    className="field-action-btn delete-btn"
                    onClick={() => handleDeleteField(field.id)}
                    title="Delete field"
                  >
                    <IoTrash size={18} color='darkred'/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="fields-manager-actions">
          <Button 
            text="Done"
            color="green"
            action={handleSaveAndClose}
          />
        </div>

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
      </div>
    </Modal>
  );
};

export default CustomFieldsManager;