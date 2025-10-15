import React from 'react';
import './TwoColumnLayout.css';
import TitleAndLinks from '../Title With Links/TitleAndLinks';

const TwoColumnLayout = ({ 
    className = "",
    gap = "0px",
    contactLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
    connectLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
    websiteLink = [{name:"www.dany.com", iconName:"web"}]
}) => {

    return (
        <div className={`two-column-layout ${className}`}>
            <div className="column left-column">
                <TitleAndLinks title="Contact" links={contactLinks}/>
                <TitleAndLinks title="Connect" links={connectLinks}/>
                <TitleAndLinks title="Website" links={websiteLink}/>
            </div>
            
            <div 
                className="separator"
                style={{
                    width: "5px",
                    backgroundColor: "#4CAF50",
                    marginLeft: gap,
                    marginRight: gap
                }}
            />
            
            <div className="column right-column">
                {/* {rightChild} */}
            </div>
        </div>
    );
};

// Left Column Component
const LeftColumn = ({ children, className = "" }) => {
    return (
        <div className={`left-column-content ${className}`}>
            {children}
        </div>
    );
};

// Right Column Component
const RightColumn = ({ children, className = "" }) => {
    return (
        <div className={`right-column-content ${className}`}>
            {children}
        </div>
    );
};

export default TwoColumnLayout;
export { LeftColumn, RightColumn };