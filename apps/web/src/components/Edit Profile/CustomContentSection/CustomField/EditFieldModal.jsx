import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';

const EditFieldModal = ({ visible, onClose, field, onUpdate, fieldTypes }) => {
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [required, setRequired] = useState(false);

  useEffect(() => {
    if (field && visible) {
      setFieldLabel(field.label || field.field_name || '');
      setFieldType(field.field_type || 'text');
      setRequired(field.required || false);
    }
  }, [field, visible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fieldLabel.trim() && field) {
      const updateData = {
        label: fieldLabel.trim(),
        type: fieldType,
        required: required
      };

      onUpdate(field.id, updateData);
      onClose();
    }
  };

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title="Edit Field"
    >
      <form onSubmit={handleSubmit} className="custom-type-form">
        <div className="form-content">
          <label htmlFor="edit-field-label" className="form-label">
            Field Label *
          </label>
          <input
            id="edit-field-label"
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            placeholder="e.g., Cooking Time, Ingredients, Description, Profile Photo"
            className="custom-form-input"
            autoFocus
            required
          />
          <div className="slug-hint">
            Field name: {field?.field_name || '...'}
          </div>
        </div>

        <div className="form-content">
          <label htmlFor="edit-field-type" className="form-label">
            Field Type *
          </label>
          <select
            id="edit-field-type"
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className="custom-form-input"
          >
            {fieldTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
            {/* Add the image type option */}
            <option value="image">Image Upload</option>
          </select>
          
          {/* Simple helper text for image type */}
          {fieldType === 'image' && (
            <div className="field-type-hint">
              Users will be able to upload any image file.
            </div>
          )}
        </div>

        <div className="form-content">
          <label className="form-label checkbox-label">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="form-checkbox"
            />
            Required Field
          </label>
        </div>
        
        <div className="form-actions">
          <Button 
            text="Cancel"
            color="coral"
            action={onClose}
            className="form-cancel-btn"
          />
          <Button 
            text="Save Changes"
            color="green"
            action={handleSubmit}
            disabled={!fieldLabel.trim()}
            className="form-submit-btn"
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditFieldModal;