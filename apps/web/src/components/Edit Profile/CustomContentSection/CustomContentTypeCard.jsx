import React, { useState } from 'react';
import './CustomContentTypeCard.css';
import CustomFieldsManager from './CustomField/CustomFieldsManager';
import CustomItemsManager from './CustomItemManager/CustomItemsManager';
import EditCustomTypeModal from './CustomType/EditCustomTypeModal';

const CustomContentTypeCard = ({ 
  contentType, 
  onUpdateType, 
  onDeleteType,
  onUpdateFields,
  onUpdateItems 
}) => {
  const [editTypeModalVisible, setEditTypeModalVisible] = useState(false);
  const [manageFieldsModalVisible, setManageFieldsModalVisible] = useState(false);
  const [manageItemsModalVisible, setManageItemsModalVisible] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${contentType.name}"? This will also delete all its items.`)) {
      onDeleteType(contentType.id);
    }
  };

  return (
    <div className="content-type-card">
      <div className="content-type-header">
        <div className="content-type-info">
          <h3 className="type-name">{contentType.name}</h3>
          <p className="type-slug">{contentType.slug}</p>
          {contentType.description && (
            <p className="type-description">{contentType.description}</p>
          )}
        </div>
        
        <div className="content-type-stats">
          <span className="stat">{contentType.fields?.length || 0} fields</span>
          <span className="stat">{contentType.items?.length || 0} items</span>
        </div>

        <div className="content-type-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => setEditTypeModalVisible(true)}
            title="Edit Type"
          >
            ✏️
          </button>
          <button 
            className="action-btn fields-btn"
            onClick={() => setManageFieldsModalVisible(true)}
            title="Manage Fields"
          >
            📋
          </button>
          <button 
            className="action-btn items-btn"
            onClick={() => setManageItemsModalVisible(true)}
            title="Manage Items"
          >
            📝
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
            title="Delete Type"
          >
            🗑️
          </button>
        </div>
      </div>

      <EditCustomTypeModal
        visible={editTypeModalVisible}
        onClose={() => setEditTypeModalVisible(false)}
        contentType={contentType}
        onUpdate={onUpdateType}
      />

      <CustomFieldsManager
        visible={manageFieldsModalVisible}
        onClose={() => setManageFieldsModalVisible(false)}
        contentType={contentType}
        onUpdateFields={onUpdateFields}
      />

      <CustomItemsManager
        visible={manageItemsModalVisible}
        onClose={() => setManageItemsModalVisible(false)}
        contentType={contentType}
        onUpdateItems={onUpdateItems}
      />
    </div>
  );
};

export default CustomContentTypeCard;