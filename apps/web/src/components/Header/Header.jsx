import React from 'react';
import './Header.css';

import companyLogo from "../../assets/images/logos/qr-card.png"
import searchIcon from "../../assets/images/icons/search-icon-white.png"
import scanQrIcon from "../../assets/images/icons/scan-qr-icon-white.png"
import profileIcon from "../../assets/images/icons/profile-icon-white.png"
import logoutIcon from "../../assets/images/icons/logout-icon.png"
import { useNavigate, useParams } from 'react-router-dom';

const Header = ({activeIndex}) => {
    const getToken = () => {
        return localStorage.getItem("token");
    };
    const getCurrentUser = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };


    const navigate = useNavigate();
    const goToProfile = () => {navigate(`/profile`)}
    const goToScanQrCode = () => {navigate(`/scan-qr-code`)}
    const goToSearch = () => {navigate(`/Filtering`)}
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate('/Login');
    }

    let companyName = "QR CARD";
    let menuItems = [
        {name: "Search", icon: searchIcon, action:goToSearch, active:(activeIndex === 0)},
        {name: "Scan QR", icon: scanQrIcon, action: goToScanQrCode, active:(activeIndex === 1)},
        {name: "My Profile", icon: profileIcon, action: goToProfile, active:(activeIndex === 2)},
        getCurrentUser()?.id ? {name: "Logout", icon: logoutIcon, action: logout, active:(activeIndex === 3)} : null ,
    ].filter((obj) => obj !== null);
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