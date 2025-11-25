import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';
import './CustomTypeModal.css';

const AddCustomTypeModal = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (visible) {
      setName('');
      setSlug('');
      setDescription('');
    }
  }, [visible]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    // Auto-generate slug from name
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && slug.trim()) {
      onAdd({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim()
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    setSlug('');
    setDescription('');
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      onClose={handleCancel}
      title="Add Content Type"
    >
      <form onSubmit={handleSubmit} className="custom-type-form">
        <div className="form-content">
          <label htmlFor="type-name" className="form-label">
            Name *
          </label>
          <input
            id="type-name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g., Projects, Recipes, Portfolio"
            className="custom-form-input"
            autoFocus
            required
          />
        </div>

        {/* <div className="form-content">
          <label htmlFor="type-slug" className="form-label">
            Slug *
          </label>
          <input
            id="type-slug"
            type="text"
            value={slug}
            onChange={handleSlugChange}
            placeholder="e.g., projects, recipes"
            className="form-input"
            required
          />
          <div className="slug-hint">Used in URLs. Only lowercase letters, numbers, and hyphens.</div>
        </div> */}

        <div className="form-content">
          <label htmlFor="type-description" className="form-label">
            Description
          </label>
          <textarea
            id="type-description"
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
            text="Add Content Type"
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

export default AddCustomTypeModal;