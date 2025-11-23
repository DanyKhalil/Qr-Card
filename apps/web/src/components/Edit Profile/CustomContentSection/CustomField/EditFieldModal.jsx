import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';

const EditFieldModal = ({ visible, onClose, field, onUpdate, fieldTypes }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [required, setRequired] = useState(false);

  useEffect(() => {
    if (field && visible) {
      setFieldName(field.field_name || '');
      setFieldKey(field.field_key || '');
      setFieldLabel(field.label || '');
      setFieldType(field.field_type || 'text');
      setRequired(field.required || false);
    }
  }, [field, visible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fieldName.trim() && fieldKey.trim() && field) {
      onUpdate(field.id, {
        field_name: fieldName.trim(),
        field_key: fieldKey.trim(),
        label: fieldLabel.trim(),
        field_type: fieldType,
        required: required
      });
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
          <label htmlFor="edit-field-name" className="form-label">
            Field Name *
          </label>
          <input
            id="edit-field-name"
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="e.g., Cooking Time, Ingredients, Description"
            className="form-input"
            autoFocus
            required
          />
        </div>

        <div className="form-content">
          <label htmlFor="edit-field-key" className="form-label">
            Field Key *
          </label>
          <input
            id="edit-field-key"
            type="text"
            value={fieldKey}
            onChange={(e) => setFieldKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
            placeholder="e.g., cooking_time, ingredients"
            className="form-input"
            required
          />
        </div>

        <div className="form-content">
          <label htmlFor="edit-field-label" className="form-label">
            Display Label
          </label>
          <input
            id="edit-field-label"
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            placeholder="e.g., Cooking Time (minutes)"
            className="form-input"
          />
        </div>

        <div className="form-content">
          <label htmlFor="edit-field-type" className="form-label">
            Field Type *
          </label>
          <select
            id="edit-field-type"
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className="form-input"
          >
            {fieldTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
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
            disabled={!fieldName.trim() || !fieldKey.trim()}
            className="form-submit-btn"
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditFieldModal;