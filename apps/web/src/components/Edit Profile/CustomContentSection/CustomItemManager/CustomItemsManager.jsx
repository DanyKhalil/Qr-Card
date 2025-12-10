import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';
import './CustomItemsManager.css';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import { IoPencil, IoTrash } from 'react-icons/io5';

const CustomItemsManager = ({ visible, onClose, contentType, onUpdateItems }) => {
  const [items, setItems] = useState([]);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (contentType && visible) {
      setItems([...contentType.items]);
    }
  }, [contentType, visible]);

  const handleAddItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `item-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updatedItems = [...items, itemWithId];
    setItems(updatedItems);
    onUpdateItems(contentType.id, updatedItems);
  };

  const handleUpdateItem = (itemId, updatedItem) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, ...updatedItem } : item
    );
    setItems(updatedItems);
    onUpdateItems(contentType.id, updatedItems);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      onUpdateItems(contentType.id, updatedItems);
    }
  };

  const handleToggleVisibility = (itemId) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, visibility: !item.visibility } : item
    );
    setItems(updatedItems);
    onUpdateItems(contentType.id, updatedItems);
  };

  const handleSaveAndClose = () => {
    onUpdateItems(contentType.id, items);
    onClose();
  };

  // Helper function to get image URL from value
  const getImageUrl = (value) => {
    if (!value) return null;
    
    let url = null;
    
    // Handle different value types
    if (typeof value === 'string') {
      url = value;
    } else if (value instanceof File || (value && value.name && value.size)) {
      // Create blob URL for File objects
      url = URL.createObjectURL(value);
    } else if (value && typeof value === 'object' && value.url) {
      url = value.url;
    }
    
    // Validate if it's actually an image URL
    if (!url || typeof url !== 'string') return null;
    
    // Check if it ends with image extension
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const isImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().endsWith(ext)
    );
    
    // Check if it's a URL with common image patterns
    const isImageUrlPattern = (
      (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) &&
      (url.includes('/uploads/') || url.includes('/images/') || url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i))
    );
    
    // Check if it's a blob URL (from File object)
    const isBlobUrl = url.startsWith('blob:');
    
    return (isImageExtension || isImageUrlPattern || isBlobUrl) ? url : null;
  };

  // Helper function to check if value should display as image
  const shouldDisplayAsImage = (value, fieldType) => {
    if (fieldType === 'image') return true;
    
    // Check if value looks like an image
    const url = getImageUrl(value);
    return !!url;
  };

  // Helper function to get display text for non-image values
  const getDisplayText = (value) => {
    if (value === null || value === undefined) return '';
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Handle File objects (for non-image display)
    if (value instanceof File) {
      // Check if it might be an image file
      const fileName = value.name.toLowerCase();
      const isLikelyImage = fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/);
      return `📄 ${value.name} (${(value.size / 1024).toFixed(1)} KB)`;
    }
    
    // Handle objects
    if (typeof value === 'object') {
      // Check if it's an empty object
      if (Object.keys(value).length === 0) {
        return '[Empty Object]';
      }
      
      // Try to stringify, but limit length
      try {
        const str = JSON.stringify(value);
        return str.length > 100 ? str.substring(0, 100) + '...' : str;
      } catch (e) {
        return '[Object]';
      }
    }
    
    // Handle strings and numbers
    const stringValue = String(value);
    
    // Truncate very long text
    if (stringValue.length > 150) {
      return stringValue.substring(0, 150) + '...';
    }
    
    return stringValue;
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback) {
      fallback.style.display = 'block';
    }
  };

  return (
    <Modal 
      visible={visible} 
      onClose={onClose}
      title={`Manage ${contentType?.name || 'Items'}`}
      size="large"
    >
      <div className="items-manager">
        <div className="items-header">
          <p className="items-description">
            Manage your {contentType?.name?.toLowerCase() || 'content'} items.
          </p>
          <button 
            className="add-item-btn"
            onClick={() => setAddItemModalVisible(true)}
          >
            + Add Item
          </button>
        </div>

        <div className="items-list">
          {items.length === 0 ? (
            <div className="empty-items">
              <p>No items yet. Add your first item to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <div className="item-title-section">
                    <h4 className="item-title">{item.title || 'Untitled Item'}</h4>
                    <div className="item-meta">
                      {/* <span className={`item-visibility ${item.visibility ? 'visible' : 'hidden'}`}>
                        {item.visibility ? 'Visible' : 'Hidden'}
                      </span>
                      <span className="item-date">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span> */}
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      className="item-action-btn edit-btn"
                      onClick={() => {
                        setCurrentItem(item);
                        setEditItemModalVisible(true);
                      }}
                      title="Edit item"
                    >
                      <IoPencil size={18}/>
                    </button>
                    <button 
                      className="item-action-btn delete-btn"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete item"
                    >
                      <IoTrash size={18}/>
                    </button>
                  </div>
                </div>

                <div className="item-values">
                  {item.values && item.values.length > 0 ? (
                    <div className="values-grid">
                      {item.values.map((value, index) => {
                        const isImage = shouldDisplayAsImage(value.value, value.field_type);
                        const imageUrl = isImage ? getImageUrl(value.value) : null;
                        
                        return (
                          <div key={index} className={`value-item ${isImage ? 'image-value-item' : ''}`}>
                            <span className="value-label">
                              {value.field_label || value.field_name}:
                            </span>
                            
                            {isImage && imageUrl ? (
                              <div className="image-value-content">
                                <div className="image-preview-wrapper">
                                  <img 
                                    src={imageUrl} 
                                    alt={value.field_label || 'Image preview'}
                                    className="item-image-preview"
                                    onError={handleImageError}
                                  />
                                  <div className="image-fallback" style={{ display: 'none' }}>
                                    📷 Image not available
                                  </div>
                                </div>
                                {value.value instanceof File && (
                                  <div className="image-file-info">
                                    <small>New file: {value.value.name}</small>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="value-content">
                                {getDisplayText(value.value)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="no-values">No field values set</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="items-manager-actions">
          <Button 
            text="Done"
            color="green"
            action={handleSaveAndClose}
          />
        </div>

        <AddItemModal
          visible={addItemModalVisible}
          onClose={() => setAddItemModalVisible(false)}
          onAdd={handleAddItem}
          contentType={contentType}
        />

        <EditItemModal
          visible={editItemModalVisible}
          onClose={() => setEditItemModalVisible(false)}
          item={currentItem}
          onUpdate={handleUpdateItem}
          contentType={contentType}
        />
      </div>
    </Modal>
  );
};

export default CustomItemsManager;