import React from 'react';
import './TitleAndLinks.css';
import IconWithName from '../Icon With Name/IconWithName';

const TitleAndLinks = ({ title, links }) => {
  if (!links || !Array.isArray(links) || links.length === 0) {
    return null;
  }

  return (
    <div className="social-section">
      <h2 className="section-title">{title}</h2>
      <div className="social-links">
        {links.map((social, index) => (
          <IconWithName 
            key={index}
            name={social.name}
            iconName={social.iconName}
          />
        ))}
      </div>
    </div>
  );
};

export default TitleAndLinks;