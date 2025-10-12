import React from 'react';
import './Header.css';

import companyLogo from "../../assets/images/logos/qr-card.png"
import searchIcon from "../../assets/images/icons/search-icon-white.png"
import scanQrIcon from "../../assets/images/icons/scan-qr-icon-white.png"
import profileIcon from "../../assets/images/icons/profile-icon-white.png"

const Header = () => {

    let companyName = "QR CARD";
    let menuItems = [
        {name: "Search", icon: searchIcon},
        {name: "Scan QR", icon: scanQrIcon},
        {name: "My Profile", icon: profileIcon},
    ];
    return (
        <div className="header">
        <div className="header-left">
            <img src={companyLogo} alt={`${companyName} logo`} className="logo" />
            <span className="company-name">{companyName}</span>
        </div>

        <div className="header-right">
            {menuItems.map((item, index) => (
            <div key={index} className="menu-item">
                <img src={item.icon} alt={item.name} className="menu-icon" />
                <span className="menu-name">{item.name}</span>
            </div>
            ))}
        </div>
        </div>
    );
};

export default Header;