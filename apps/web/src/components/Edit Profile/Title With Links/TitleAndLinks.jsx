import React from 'react';
import './TitleAndLinks.css';
import IconWithName from '../Icon With Name/IconWithName';
import Button from '../../Profile/Button/Button';

const TitleAndLinks = ({ title, links, setter, addAction }) => {
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
            id={social.id}
            name={social.name}
            iconName={social.iconName}
            link={social.link}
            setter={setter}
          />
        ))}
      </div>
      <br></br>
      <Button 
        text="Add Links"
        color="green"
        width="150px"
        action={addAction}
      />
    </div>
  );
};

export default TitleAndLinks;