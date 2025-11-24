import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';

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

  const handleFieldLabelChange = (e) => {
    setFieldLabel(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fieldLabel.trim()) {
      // Auto-generate field name and key from label
      const fieldName = fieldLabel
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s_]/g, '') // Remove special chars except spaces and underscores
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_+/g, '_'); // Replace multiple underscores with single underscore

      const fieldKey = fieldName; // Use same value for both

      // Check if field key is unique
      if (existingFields.some(field => field.field_key === fieldKey)) {
        alert('A field with this name already exists. Please choose a different name.');
        return;
      }

      onAdd({
        field_name: fieldName,
        field_key: fieldKey,
        label: fieldLabel.trim(),
        field_type: fieldType,
        required: required,
        config: null
      });
      onClose();
    }
  };

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title="Add Field"
    >
      <form onSubmit={handleSubmit} className="custom-type-form">
        <div className="form-content">
          <label htmlFor="field-label" className="form-label">
            Field Label *
          </label>
          <input
            id="field-label"
            type="text"
            value={fieldLabel}
            onChange={handleFieldLabelChange}
            placeholder="e.g., Cooking Time, Ingredients, Description"
            className="form-input"
            autoFocus
            required
          />
          <div className="slug-hint">
            Field name will be auto-generated: {fieldLabel ? fieldLabel.toLowerCase().replace(/[^a-z0-9\s_]/g, '').replace(/\s+/g, '_') : '...'}
          </div>
        </div>

        <div className="form-content">
          <label htmlFor="field-type" className="form-label">
            Field Type *
          </label>
          <select
            id="field-type"
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
            text="Add Field"
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

export default AddFieldModal;