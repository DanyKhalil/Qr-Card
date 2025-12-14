import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';

const EditItemModal = ({ visible, onClose, item, onUpdate, contentType }) => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [fieldValues, setFieldValues] = useState({});
  const [uploadingImages, setUploadingImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  
  // Refs for file inputs
  const fileInputRefs = useRef({});

  useEffect(() => {
    if (visible && item && contentType) {
      setTitle(item.title || '');
      setVisibility(item.visibility !== false);
      
      // Initialize field values from item data
      const initialValues = {};
      const initialPreviews = {};
      
      contentType.fields?.forEach(field => {
        const existingValue = item.values?.find(v => v.field_key === field.key);
        
        if (field.type === 'image') {
          // For image fields, check if we have an existing URL
          if (existingValue?.value && typeof existingValue.value === 'string') {
            initialValues[field.key] = existingValue.value; // Store URL
            initialPreviews[field.key] = existingValue.value; // Set preview URL
          } else {
            initialValues[field.key] = '';
          }
        } else {
          initialValues[field.key] = existingValue?.value || getDefaultValue(field.type);
        }
      });
      
      setFieldValues(initialValues);
      setImagePreviews(initialPreviews);
      setUploadingImages({});
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
      case 'image': return ''; // Empty string for image URL
      default: return '';
    }
  };

  const handleFieldChange = (fieldKey, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleImageUpload = (fieldKey, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate image file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Show uploading state
    setUploadingImages(prev => ({
      ...prev,
      [fieldKey]: true
    }));

    // Simulate upload process
    setTimeout(() => {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Store file object in field values
      handleFieldChange(fieldKey, file);
      
      // Update preview
      setImagePreviews(prev => ({
        ...prev,
        [fieldKey]: previewUrl
      }));
      
      setUploadingImages(prev => ({
        ...prev,
        [fieldKey]: false
      }));

    }, 1000);

    // Reset file input
    event.target.value = '';
  };

  const triggerFileInput = (fieldKey) => {
    if (fileInputRefs.current[fieldKey]) {
      fileInputRefs.current[fieldKey].click();
    }
  };

  const removeImage = (fieldKey) => {
    // Clean up blob URL if it was a new file
    if (fieldValues[fieldKey] instanceof File && imagePreviews[field.key]) {
      URL.revokeObjectURL(imagePreviews[field.key]);
    }
    
    // Clear the field value
    handleFieldChange(fieldKey, '');
    
    // Clear the preview
    setImagePreviews(prev => ({
      ...prev,
      [fieldKey]: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!item) return;

    // Validate required fields
    const requiredFields = contentType.fields?.filter(field => field.required) || [];
    const missingRequired = requiredFields.filter(field => {
      const value = fieldValues[field.key];
      
      // Special handling for image type
      if (field.type === 'image') {
        return !value || value === '';
      }
      
      return value === '' || value === null || value === undefined;
    });

    if (missingRequired.length > 0) {
      alert(`Please fill in all required fields: ${missingRequired.map(f => f.name || f.label).join(', ')}`);
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
    const isUploading = uploadingImages[field.key];
    const previewUrl = imagePreviews[field.key] || (typeof value === 'string' && value.startsWith('http') ? value : null);

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="field-input"
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            required={field.required}
          />
        );
      
      case 'longtext':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="field-textarea"
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            rows="4"
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="field-input"
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            required={field.required}
          />
        );
      
      case 'boolean':
        return (
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              className="field-checkbox"
            />
            <span className="checkbox-label">{field.label || field.name}</span>
          </label>
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
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
                handleFieldChange(field.key, parsedValue);
              } catch {
                handleFieldChange(field.key, e.target.value);
              }
            }}
            className="field-textarea"
            placeholder='Enter JSON data...'
            rows="4"
            required={field.required}
          />
        );
      
      case 'image':
        return (
          <div className="image-upload-field">
            <input
              type="file"
              ref={el => fileInputRefs.current[field.key] = el}
              onChange={(e) => handleImageUpload(field.key, e)}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            {/* Show existing image or uploaded preview */}
            {previewUrl ? (
              <div className="image-preview-container">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="image-preview"
                />
                <div className="image-actions">
                  <Button
                    text="Change"
                    color="green"
                    action={() => triggerFileInput(field.key)}
                    size="small"
                  />
                  <Button
                    text="Remove"
                    color="coral"
                    action={() => removeImage(field.key)}
                    size="small"
                  />
                </div>
                {fieldValues[field.key] instanceof File && (
                  <div className="file-info">
                    <strong>New file:</strong> {fieldValues[field.key].name}
                    <br />
                    <small>Size: {(fieldValues[field.key].size / 1024).toFixed(2)} KB</small>
                  </div>
                )}
              </div>
            ) : isUploading ? (
              <div className="uploading-state">
                <div className="uploading-spinner"></div>
                <span>Uploading image...</span>
              </div>
            ) : (
              <div className="image-upload-placeholder" onClick={() => triggerFileInput(field.key)}>
                <div className="upload-icon">📁</div>
                <div className="upload-text">Click to upload image</div>
                <div className="upload-hint">Supports: JPG, PNG, GIF, WEBP</div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="field-input"
            placeholder={`Enter ${fieldName.toLowerCase()}...`}
            required={field.required}
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
      size="large"
    >
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          
          <div className="form-content">
            <label htmlFor="edit-item-title" className="form-label">
              Title *
            </label>
            <input
              id="edit-item-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter item title..."
              className="custom-form-input"
              autoFocus
              required
            />
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
                  <label htmlFor={`edit-field-${field.key}`} className="field-label">
                    {field.label || field.name}
                    {field.required && <span className="required-star"> *</span>}
                  </label>
                  <div className="field-type-hint">
                    {field.type === 'image' ? 'Image Upload' : field.type}
                  </div>
                  {renderFieldInput(field)}
                </div>
              ))}
            </div>
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
            text="Save Changes"
            color="green"
            action={handleSubmit}
            disabled={!title.trim()}
            className="form-submit-btn"
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditItemModal;