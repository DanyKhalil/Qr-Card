import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

import companyLogo from "../../assets/images/logos/qr-card.png";
import searchIcon from "../../assets/images/icons/search-icon-white.png";
import scanQrIcon from "../../assets/images/icons/scan-qr-icon-white.png";
import profileIcon from "../../assets/images/icons/profile-icon-white.png";
import logoutIcon from "../../assets/images/icons/logout-icon.png";
import notificationIcon from "../../assets/images/icons/notification-icon.png";
import adminIcon from "../../assets/images/icons/admin-icon.png";
import paymentIcon from "../../assets/images/icons/payment-icon.png";
import { useNavigate } from 'react-router-dom';
import { userApi } from "../../services/userApi";

const Header = ({ activeIndex }) => {
    const [profilePopup, setProfilePopup] = useState(null);
    const [userProfiles, setUserProfiles] = useState([]);
    const [addingProfile, setAddingProfile] = useState(false);
    const [newProfileName, setNewProfileName] = useState("");
    const popupRef = useRef(null);

    const currentProfileId = localStorage.getItem("profileId");

    const getCurrentUser = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    };

    const navigate = useNavigate();

    const goToProfile = () => navigate(`/profile`);
    const goToScanQrCode = () => navigate(`/scan-qr-code`);
    const goToSearch = () => navigate(`/Filtering`);
    const goToNotification = () => navigate(`/notifications`);
    const goToAdmin = () => navigate(`/admin`);
    const goToPayments = () => navigate(`/payments`);

    const logout = () => {
        localStorage.clear();
        navigate('/Login');
    };

    const handleProfileRightClick = async (e) => {
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        setProfilePopup({
            top: rect.bottom + window.scrollY + 6,
            left: rect.left + window.scrollX,
        });

        try {
            if (!currentProfileId) return;
            const response = await userApi.getProfilesByProfileId(currentProfileId);
            setUserProfiles(response.profiles || []);
        } catch (error) {
            console.error("Failed to load profiles:", error);
        }
    };

    const handleProfileSelect = (profileId) => {
        if (profileId === currentProfileId) return;
        localStorage.setItem("profileId", profileId);
        setProfilePopup(null);
        window.location.reload();
    };

    const handleAddProfile = async () => {
        if (!newProfileName.trim()) return;
        try {
            const response = await userApi.createProfileFromProfileId(currentProfileId, newProfileName.trim());
            setUserProfiles((prev) => [...prev, response.profile]);
            setNewProfileName("");
            setAddingProfile(false);
        } catch (error) {
            console.error("Failed to create profile:", error);
        }
    };

    // click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setProfilePopup(null);
                setAddingProfile(false);
                setNewProfileName("");
            }
        };

        if (profilePopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profilePopup]);

    let companyName = "QR CARD";

    let menuItems = [
        getCurrentUser()?.role === 'admin'
            ? { name: "", icon: paymentIcon, action: goToPayments, active: activeIndex === -2 }
            : null,
        getCurrentUser()?.role === 'admin'
            ? { name: "", icon: adminIcon, action: goToAdmin, active: activeIndex === -1 }
            : null,
        getCurrentUser()?.id
            ? { name: "Search", icon: searchIcon, action: goToSearch, active: activeIndex === 0 }
            : null,
        { name: "Scan QR", icon: scanQrIcon, action: goToScanQrCode, active: activeIndex === 1 },
        getCurrentUser()?.id
            ? { name: "Notifications", icon: notificationIcon, action: goToNotification, active: activeIndex === 2 }
            : null,
        { name: "My Profile", icon: profileIcon, action: goToProfile, active: activeIndex === 3 },
        getCurrentUser()?.id
            ? { name: "Logout", icon: logoutIcon, action: logout, active: activeIndex === 4 }
            : null,
    ].filter(Boolean);

    return (
        <div className="header">
            <div className="header-left">
                <img src={companyLogo} alt={`${companyName} logo`} className="logo" />
                <span className="company-name">{companyName}</span>
            </div>

            <div className="header-right">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={item.active ? "menu-item active" : "menu-item"}
                        onClick={item.action}
                        onContextMenu={
                            item.name === "My Profile"
                                ? handleProfileRightClick
                                : undefined
                        }
                    >
                        <img src={item.icon} alt={item.name} className="menu-icon" />
                        <span className="menu-name">{item.name}</span>
                    </div>
                ))}
            </div>

            {profilePopup && (
                <div
                    ref={popupRef}
                    className="profile-popup"
                    style={{
                        top: profilePopup.top,
                        left: profilePopup.left,
                    }}
                >
                    {userProfiles.map((profile) => {
                        const isActive = profile.id === currentProfileId;
                        return (
                            <div
                                key={profile.id}
                                className={`profile-popup-item ${isActive ? "active" : ""}`}
                                onClick={() => handleProfileSelect(profile.id)}
                            >
                                <img
                                    src={profile.profile_pic_url || profileIcon}
                                    alt={profile.name}
                                    className="profile-popup-avatar"
                                />
                                <span className="profile-popup-name">{profile.name}</span>
                            </div>
                        );
                    })}

                    {/* Add new profile section */}
                    {addingProfile ? (
                        <div className="profile-popup-add">
                            <input
                                type="text"
                                placeholder="Profile name"
                                value={newProfileName}
                                onChange={(e) => setNewProfileName(e.target.value)}
                                className="profile-popup-input"
                            />
                            <button
                                className="profile-popup-create-btn"
                                onClick={handleAddProfile}
                            >
                                Create
                            </button>
                        </div>
                    ) : (
                        <div
                            className="profile-popup-item"
                            style={{ fontWeight: 'bold', justifyContent: 'center' }}
                            onClick={() => setAddingProfile(true)}
                        >
                            + Add another profile
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Header;
