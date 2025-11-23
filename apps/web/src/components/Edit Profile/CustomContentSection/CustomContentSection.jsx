import React, { useState } from 'react';
import './CustomContentSection.css';
import CustomContentTypeCard from './CustomContentTypeCard';
import AddCustomTypeModal from './CustomType/AddCustomTypeModal';

const CustomContentSection = ({ 
  customContent = [], 
  setCustomContent,
  className = "" 
}) => {
  const [addTypeModalVisible, setAddTypeModalVisible] = useState(false);

  const handleAddType = (newType) => {
    const newTypeWithId = {
      ...newType,
      id: `temp-${Date.now()}`,
      fields: [],
      items: []
    };
    setCustomContent([...customContent, newTypeWithId]);
  };

  const handleUpdateType = (typeId, updatedType) => {
    setCustomContent(customContent.map(type => 
      type.id === typeId ? { ...type, ...updatedType } : type
    ));
  };

  const handleDeleteType = (typeId) => {
    setCustomContent(customContent.filter(type => type.id !== typeId));
  };

  const handleUpdateFields = (typeId, fields) => {
    setCustomContent(customContent.map(type => 
      type.id === typeId ? { ...type, fields } : type
    ));
  };

  const handleUpdateItems = (typeId, items) => {
    setCustomContent(customContent.map(type => 
      type.id === typeId ? { ...type, items } : type
    ));
  };

  return (
    <div className={`custom-content-section ${className}`}>
      <div className="custom-content-header">
        <h2 className="custom-content-title">Custom Content</h2>
        <button 
          className="add-type-btn"
          onClick={() => setAddTypeModalVisible(true)}
        >
          + Add Content Type
        </button>
      </div>

      <div className="custom-types-grid">
        {customContent.map((contentType) => (
          <CustomContentTypeCard
            key={contentType.id}
            contentType={contentType}
            onUpdateType={handleUpdateType}
            onDeleteType={handleDeleteType}
            onUpdateFields={handleUpdateFields}
            onUpdateItems={handleUpdateItems}
          />
        ))}
        
        {customContent.length === 0 && (
          <div className="empty-state">
            <p>No custom content types yet.</p>
            <p>Click "Add Content Type" to get started.</p>
          </div>
        )}
      </div>

      <AddCustomTypeModal
        visible={addTypeModalVisible}
        onClose={() => setAddTypeModalVisible(false)}
        onAdd={handleAddType}
      />
    </div>
  );
};

export default CustomContentSection;