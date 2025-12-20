import React from 'react';
import './Header.css';

import companyLogo from "../../assets/images/logos/qr-card.png"
import searchIcon from "../../assets/images/icons/search-icon-white.png"
import scanQrIcon from "../../assets/images/icons/scan-qr-icon-white.png"
import profileIcon from "../../assets/images/icons/profile-icon-white.png"
import logoutIcon from "../../assets/images/icons/logout-icon.png"
import notificationIcon from "../../assets/images/icons/notification-icon.png"
import adminIcon from "../../assets/images/icons/admin-icon.png"
import paymentIcon from "../../assets/images/icons/payment-icon.png"
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
    const goToNotification = () => {navigate(`/notifications`)}
    const goToAdmin = () => {navigate(`/admin`)}
    const goToPayments = () => {navigate(`/payments`)}

    let companyName = "QR CARD";
    let menuItems = [
        getCurrentUser()?.role == 'admin' ? {name: (getCurrentUser()?.role == 'admin' ? "" : "Payments"), icon: paymentIcon, action:goToPayments, active:(activeIndex === -2)} : null,
        getCurrentUser()?.role == 'admin' ? {name: (getCurrentUser()?.role == 'admin' ? "" : "Admin"), icon: adminIcon, action:goToAdmin, active:(activeIndex === -1)} : null,
        {name: (getCurrentUser()?.role == 'admin' ? "" : "Search"), icon: searchIcon, action:goToSearch, active:(activeIndex === 0)},
        {name: (getCurrentUser()?.role == 'admin' ? "" : "Scan QR"), icon: scanQrIcon, action: goToScanQrCode, active:(activeIndex === 1)},
        {name: (getCurrentUser()?.role == 'admin' ? "" : "Notifications"), icon: notificationIcon, action:goToNotification, active:(activeIndex === 2)},
        {name: (getCurrentUser()?.role == 'admin' ? "" : "My Profile"), icon: profileIcon, action: goToProfile, active:(activeIndex === 3)},
        getCurrentUser()?.id ? {name: (getCurrentUser()?.role == 'admin' ? "" : "Logout"), icon: logoutIcon, action: logout, active:(activeIndex === 4)} : null ,
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