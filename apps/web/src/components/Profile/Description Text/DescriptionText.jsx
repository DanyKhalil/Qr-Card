import React from 'react';
import './DescriptionText.css';

const DescriptionText = ({ text, className = '' }) => {
  return (
    <div className={`description-text ${className}`}>
      {text}
    </div>
  );
};

export default DescriptionText;