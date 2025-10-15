import React from 'react';
import IconWithName from '../Icon With Name/IconWithName';

const TitleAndLinks = ({ title, links }) => {
  return (
    <div className="social-section">
      <h1 className="section-title">{title}</h1>
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