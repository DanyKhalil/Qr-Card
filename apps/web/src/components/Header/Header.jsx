import React from 'react';
import './Header.css';

import companyLogo from "../../assets/images/logos/qr-card.png"
import searchIcon from "../../assets/images/icons/search-icon-white.png"
import scanQrIcon from "../../assets/images/icons/scan-qr-icon-white.png"
import profileIcon from "../../assets/images/icons/profile-icon-white.png"
import { useNavigate, useParams } from 'react-router-dom';

const Header = ({activeIndex}) => {
    const navigate = useNavigate();
    const goToProfile = () => {navigate(`/profile`)}
    const goToScanQrCode = () => {navigate(`/scan-qr-code`)}
    const goToSearch = () => {navigate(`/Filtering`)}

    let companyName = "QR CARD";
    let menuItems = [
        {name: "Search", icon: searchIcon, action:goToSearch, active:(activeIndex === 0)},
        {name: "Scan QR", icon: scanQrIcon, action: goToScanQrCode, active:(activeIndex === 1)},
        {name: "My Profile", icon: profileIcon, action: goToProfile, active:(activeIndex === 2)},
    ];
    return (
        <div className="header">
        <div className="header-left">
            <img src={companyLogo} alt={`${companyName} logo`} className="logo" />
            <span className="company-name">{companyName}</span>
        </div>

        <div className="header-right">
            {menuItems.map((item, index) => (
            <div key={index} className={item.active ? "menu-item active" : "menu-item"} onClick={()=> item.action()}>
                <img src={item.icon} alt={item.name} className="menu-icon" />
                <span className="menu-name">{item.name}</span>
            </div>
            ))}
        </div>
        </div>
    );
};

export default Header;