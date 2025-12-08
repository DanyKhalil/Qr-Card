import React from "react";
import "./CustomItemCard.css";

const CustomItemCard = ({ customItem }) => {
  if (!customItem) return null;

  const { title, fields, values } = customItem;

  // Helper function to check if value is an image URL
  const isImageUrl = (value) => {
    if (!value || typeof value !== "string") return false;
    
    // Check if it's a URL that ends with image extension
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const isImageExtension = imageExtensions.some(ext => 
      value.toLowerCase().endsWith(ext)
    );
    
    // Check if it's a URL that contains common image patterns
    const isImageUrlPattern = value.startsWith('http') && 
      (value.includes('/uploads/') || value.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/i));
    
    return isImageExtension || isImageUrlPattern;
  };

  // Helper function to check if field type is image
  const isImageField = (field) => {
    return field.type === 'image' || isImageUrl(values?.[field.key]);
  };

  // Helper function to format values
  const formatValue = (value, fieldType) => {
    if (fieldType === 'boolean') {
      return typeof value === "boolean" ? (value ? "Yes" : "No") : "N/A";
    }
    
    if (fieldType === 'image') {
      return "N/A";
    }
    
    if (!value && value !== 0 && value !== false) {
      return "N/A";
    }
    
    return value;
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback) {
      fallback.style.display = 'block';
    }
  };

  return (
    <div className="custom-card">
      <h2 className="custom-card-title">{title || "Untitled"}</h2>
      <div className="custom-card-fields">
        {fields.map((field) => {
          const value = values?.[field.key];
          const isImage = isImageField(field);
          
          return (
            <div className={`custom-card-field ${isImage ? 'image-field' : ''}`} key={field.key}>
              <span className="field-label">{field.label}:</span>
              
              {isImage && value ? (
                <div className="image-value-container">
                  <img 
                    src={value} 
                    alt={field.label || "Image"} 
                    className="field-image"
                    onError={handleImageError}
                  />
                  <div className="image-fallback" style={{ display: 'none' }}>
                    Image not available
                  </div>
                </div>
              ) : (
                <span className="field-value">
                  {formatValue(value, field.type)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomItemCard;