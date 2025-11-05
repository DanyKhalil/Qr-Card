import React from 'react';
import AddressCard from '../Address Card/AddressCard';
import './Locations.css';

const Locations = ({
  locations = [],
  className = "",
  gap = "30px"
}) => {
  // dont render if no locations
  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <div className={`locations-section ${className}`}>
      <h2 className="locations-title">Locations</h2>
      
      <div 
        className="locations-grid"
        style={{ gap: gap }}
      >
        {locations.map((location, index) => (
          <div key={index} className="location-item">
            <AddressCard {...location} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;