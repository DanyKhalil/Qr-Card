import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';

const EditCustomTypeModal = ({ visible, onClose, contentType, onUpdate }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (contentType && visible) {
      setName(contentType.name || '');
      setSlug(contentType.slug || '');
      setDescription(contentType.description || '');
    }
  }, [contentType, visible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && slug.trim()) {
      onUpdate(contentType.id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim()
      });
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      onClose={handleCancel}
      title="Edit Content Type"
    >
      <form onSubmit={handleSubmit} className="custom-type-form">
        <div className="form-content">
          <label htmlFor="edit-type-name" className="form-label">
            Name *
          </label>
          <input
            id="edit-type-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Projects, Recipes, Portfolio"
            className="custom-form-input"
            autoFocus
            required
          />
        </div>

        {/* <div className="form-content">
          <label htmlFor="edit-type-slug" className="form-label">
            Slug *
          </label>
          <input
            id="edit-type-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="e.g., projects, recipes"
            className="custom-form-input"
            required
          />
        </div> */}

        <div className="form-content">
          <label htmlFor="edit-type-description" className="form-label">
            Description
          </label>
          <textarea
            id="edit-type-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this content type..."
            className="form-textarea"
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <Button 
            text="Cancel"
            color="coral"
            action={handleCancel}
            className="form-cancel-btn"
          />
          <Button 
            text="Save Changes"
            color="green"
            action={handleSubmit}
            disabled={!name.trim() || !slug.trim()}
            className="form-submit-btn"
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditCustomTypeModal;