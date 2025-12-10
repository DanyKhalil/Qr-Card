import React, { useState, useEffect } from "react";
import "./CustomItemCard.css";

const CustomItemCard = ({ customItem, cardLayout = true }) => {
  if (!customItem) return null;

  const { title, fields, values } = customItem;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all image URLs from the item
  const getImageUrls = () => {
    const imageUrls = [];
    
    fields.forEach(field => {
      if (field.type === 'image' && values?.[field.key]) {
        imageUrls.push(values[field.key]);
      }
    });
    
    return imageUrls;
  };

  const imageUrls = getImageUrls();
  const hasImages = imageUrls.length > 0;

  // Helper function to check if value is an image URL
  const isImageUrl = (value) => {
    if (!value || typeof value !== "string") return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const isImageExtension = imageExtensions.some(ext => 
      value.toLowerCase().endsWith(ext)
    );
    
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

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  // Reset image index when customItem changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [customItem]);

  if (cardLayout) {
    return (
      <div className="custom-card-layout">
        {/* Image Carousel Section */}
        {hasImages && (
          <div className="card-image-section">
            <div className="image-carousel">
              <img 
                src={imageUrls[currentImageIndex]} 
                alt={`${title || "Item"} - Image ${currentImageIndex + 1}`}
                className="carousel-image"
                onError={handleImageError}
              />
              
              {/* Navigation Arrows */}
              {imageUrls.length > 1 && (
                <>
                  <button 
                    className="carousel-arrow carousel-arrow-left"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button 
                    className="carousel-arrow carousel-arrow-right"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {/* Image Indicators */}
            {imageUrls.length > 1 && (
              <div className="image-indicators">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Card Content */}
        <div className="card-content">
          {/* Title */}
          <h2 className="card-title">{title || "Untitled"}</h2>
          
          {/* Fields */}
          <div className="card-fields">
            {fields
              .filter(field => !isImageField(field)) // Exclude image fields from list
              .map((field) => {
                const value = values?.[field.key];
                
                return (
                  <div className="card-field" key={field.key}>
                    <div className="field-header">
                      <span className="field-label">{field.label}:</span>
                      <span className="field-value">
                        {formatValue(value, field.type)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  // Original layout (table-like)
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