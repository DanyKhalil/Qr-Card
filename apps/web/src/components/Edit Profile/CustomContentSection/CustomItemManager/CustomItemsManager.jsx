import React, { useState, useEffect } from 'react';
import Modal from '../../Modals/Modal/Modal';
import Button from '../../../Profile/Button/Button';
import './CustomItemsManager.css';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';

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
                      <span className={`item-visibility ${item.visibility ? 'visible' : 'hidden'}`}>
                        {item.visibility ? 'Visible' : 'Hidden'}
                      </span>
                      <span className="item-date">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      className="item-action-btn visibility-btn"
                      onClick={() => handleToggleVisibility(item.id)}
                      title={item.visibility ? 'Hide item' : 'Show item'}
                    >
                      {item.visibility ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button 
                      className="item-action-btn edit-btn"
                      onClick={() => {
                        setCurrentItem(item);
                        setEditItemModalVisible(true);
                      }}
                      title="Edit item"
                    >
                      ✏️
                    </button>
                    <button 
                      className="item-action-btn delete-btn"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="item-values">
                  {item.values && item.values.length > 0 ? (
                    <div className="values-grid">
                      {item.values.map((value, index) => (
                        <div key={index} className="value-item">
                          <span className="value-label">
                            {value.field_label || value.field_name}:
                          </span>
                          <span className="value-content">
                            {typeof value.value === 'object' 
                              ? JSON.stringify(value.value) 
                              : String(value.value || '').substring(0, 100)}
                            {String(value.value || '').length > 100 ? '...' : ''}
                          </span>
                        </div>
                      ))}
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