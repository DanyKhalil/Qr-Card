import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';

const AddFieldModal = ({ visible, onClose, onAdd, existingFields, fieldTypes }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [required, setRequired] = useState(false);

  useEffect(() => {
    if (visible) {
      setFieldName('');
      setFieldKey('');
      setFieldLabel('');
      setFieldType('text');
      setRequired(false);
    }
  }, [visible]);

  const handleFieldNameChange = (e) => {
    const name = e.target.value;
    setFieldName(name);
    // Auto-generate field key from name
    if (!fieldKey || fieldKey === fieldName.toLowerCase().replace(/[^a-z0-9_]/g, '_')) {
      setFieldKey(name.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
    }
  };

  const handleFieldKeyChange = (e) => {
    setFieldKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fieldName.trim() && fieldKey.trim()) {
      // Check if field key is unique
      if (existingFields.some(field => field.field_key === fieldKey)) {
        alert('Field key must be unique. Please choose a different key.');
        return;
      }

      onAdd({
        field_name: fieldName.trim(),
        field_key: fieldKey.trim(),
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
          <label htmlFor="field-name" className="form-label">
            Field Name *
          </label>
          <input
            id="field-name"
            type="text"
            value={fieldName}
            onChange={handleFieldNameChange}
            placeholder="e.g., Cooking Time, Ingredients, Description"
            className="form-input"
            autoFocus
            required
          />
        </div>

        <div className="form-content">
          <label htmlFor="field-key" className="form-label">
            Field Key *
          </label>
          <input
            id="field-key"
            type="text"
            value={fieldKey}
            onChange={handleFieldKeyChange}
            placeholder="e.g., cooking_time, ingredients"
            className="form-input"
            required
          />
          <div className="slug-hint">Used in database. Only lowercase letters, numbers, and underscores.</div>
        </div>

        <div className="form-content">
          <label htmlFor="field-label" className="form-label">
            Display Label
          </label>
          <input
            id="field-label"
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            placeholder="e.g., Cooking Time (minutes)"
            className="form-input"
          />
          <div className="slug-hint">User-friendly label (optional)</div>
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
            disabled={!fieldName.trim() || !fieldKey.trim()}
            className="form-submit-btn"
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddFieldModal;