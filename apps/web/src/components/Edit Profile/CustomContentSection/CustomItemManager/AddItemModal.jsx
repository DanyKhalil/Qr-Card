import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';
import './AddItemModal.css';

const AddItemModal = ({ visible, onClose, onAdd, contentType }) => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    if (visible && contentType) {
      setTitle('');
      setVisibility(true);
      // Initialize field values based on content type fields
      const initialValues = {};
      contentType.fields?.forEach(field => {
        initialValues[field.field_key] = getDefaultValue(field.field_type);
      });
      setFieldValues(initialValues);
    }
  }, [visible, contentType]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = contentType.fields?.filter(field => field.required) || [];
    const missingRequired = requiredFields.filter(field => {
      const value = fieldValues[field.field_key];
      return value === '' || value === null || value === undefined;
    });

    if (missingRequired.length > 0) {
      alert(`Please fill in all required fields: ${missingRequired.map(f => f.field_name).join(', ')}`);
      return;
    }

    const valuesArray = Object.entries(fieldValues).map(([field_key, value]) => {
      const field = contentType.fields?.find(f => f.field_key === field_key);
      return {
        field_id: field?.id,
        field_key: field_key,
        field_name: field?.field_name,
        field_label: field?.label,
        field_type: field?.field_type,
        value: value
      };
    });

    onAdd({
      title: title.trim(),
      visibility: visibility,
      values: valuesArray
    });
    onClose();
  };

  const renderFieldInput = (field) => {
    const value = fieldValues[field.field_key] || getDefaultValue(field.field_type);

    switch (field.field_type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            className="field-input"
            placeholder={`Enter ${field.field_name.toLowerCase()}...`}
            required={field.required}
          />
        );
      
      case 'longtext':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            className="field-textarea"
            placeholder={`Enter ${field.field_name.toLowerCase()}...`}
            rows="4"
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            className="field-input"
            placeholder={`Enter ${field.field_name.toLowerCase()}...`}
            required={field.required}
          />
        );
      
      case 'boolean':
        return (
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.field_key, e.target.checked)}
              className="field-checkbox"
            />
            <span className="checkbox-label">{field.label || field.field_name}</span>
          </label>
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            className="field-input"
            required={field.required}
          />
        );
      
      case 'json':
        return (
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsedValue = JSON.parse(e.target.value);
                handleFieldChange(field.field_key, parsedValue);
              } catch {
                handleFieldChange(field.field_key, e.target.value);
              }
            }}
            className="field-textarea"
            placeholder='Enter JSON data...'
            rows="4"
            required={field.required}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            className="field-input"
            placeholder={`Enter ${field.field_name.toLowerCase()}...`}
            required={field.required}
          />
        );
    }
  };

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title={`Add ${contentType?.name || 'Item'}`}
      size="large"
    >
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          
          <div className="form-content">
            <label htmlFor="item-title" className="form-label">
              Title *
            </label>
            <input
              id="item-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter item title..."
              className="form-input"
              autoFocus
              required
            />
          </div>

          <div className="form-content">
            <label className="form-label checkbox-label">
              <input
                type="checkbox"
                checked={visibility}
                onChange={(e) => setVisibility(e.target.checked)}
                className="form-checkbox"
              />
              Visible to visitors
            </label>
          </div>
        </div>

        {contentType?.fields && contentType.fields.length > 0 && (
          <div className="form-section">
            <h3 className="section-title">Field Values</h3>
            <div className="fields-grid">
              {contentType.fields
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((field) => (
                <div key={field.id} className="field-group">
                  <label htmlFor={`field-${field.field_key}`} className="field-label">
                    {field.label || field.field_name}
                    {field.required && <span className="required-star"> *</span>}
                  </label>
                  <div className="field-type-hint">
                    {field.field_type}
                  </div>
                  {renderFieldInput(field)}
                </div>
              ))}
            </div>
          </div>
        )}

        {(!contentType?.fields || contentType.fields.length === 0) && (
          <div className="no-fields-notice">
            <p>No fields defined for this content type. Please add fields first.</p>
          </div>
        )}
        
        <div className="form-actions">
          <Button 
            text="Cancel"
            color="coral"
            action={onClose}
            className="form-cancel-btn"
          />
          <Button 
            text="Add Item"
            color="green"
            action={handleSubmit}
            disabled={!title.trim() || (!contentType?.fields || contentType.fields.length === 0)}
            className="form-submit-btn"
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddItemModal;