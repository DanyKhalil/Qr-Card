import React, { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./ProfileQrCode.css";
import Button from "../../Profile/Button/Button";
import { IoColorPalette } from "react-icons/io5";
import { FaUser, FaPhone, FaShareAlt, FaGlobe } from "react-icons/fa";

const ProfileQrCode = ({
  profileUrl,
  color = "#000000",
  setter,
  includeProfilePic = true,
  setIncludeProfilePic,
  includeContact = true,
  setIncludeContact,
  includeSocialMedia = true,
  setIncludeSocialMedia,
  includeWebsite = true,
  setIncludeWebsite
}) => {
  const qrRef = useRef(null);
  const [qrSize, setQrSize] = useState(180);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  if (!profileUrl) return null;

  // Responsive size for QR code
  useEffect(() => {
    const updateSize = () => {
      if (qrRef.current) {
        const containerWidth = qrRef.current.offsetWidth;
        setQrSize(containerWidth * 0.6);
      }
    };
    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Color change handler
  const handleColorChange = (e) => {
    setter(e.target.value);
  };

  // Predefined color options (optional)
  const presetColors = [
    "#000000", // Black
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Purple
    "#FFA07A", // Orange
  ];

  return (
    <div className="qr-container" ref={qrRef}>
      <h2 className="title-section-title">Share Profile</h2>
      
      <QRCodeCanvas 
        value={profileUrl} 
        size={qrSize}
        bgColor="#ffffff"
        fgColor={color}
      />
      
      <br />
      
      <Button
        text={showOptions ? "Hide Options" : "Show QR Options"}
        color="blue"
        bold
        action={() => setShowOptions(!showOptions)}
        width={qrSize}
        icon={<IoColorPalette size={18} />}
        style={{ marginBottom: showOptions ? '15px' : '0' }}
      />
      
      {showOptions && (
        <div className="qr-options-container">
          <div className="qr-option">
            <div className="qr-option-header">
              <FaUser className="qr-option-icon" />
              <span className="qr-option-label">Profile Picture</span>
            </div>
            <label className="qr-checkbox">
              <input
                type="checkbox"
                checked={includeProfilePic}
                onChange={(e) => setIncludeProfilePic(e.target.checked)}
                className="qr-checkbox-input"
              />
              <span className="qr-checkbox-custom"></span>
            </label>
          </div>

          <div className="qr-option">
            <div className="qr-option-header">
              <FaPhone className="qr-option-icon" />
              <span className="qr-option-label">Contact Information</span>
            </div>
            <label className="qr-checkbox">
              <input
                type="checkbox"
                checked={includeContact}
                onChange={(e) => setIncludeContact(e.target.checked)}
                className="qr-checkbox-input"
              />
              <span className="qr-checkbox-custom"></span>
            </label>
          </div>

          <div className="qr-option">
            <div className="qr-option-header">
              <FaShareAlt className="qr-option-icon" />
              <span className="qr-option-label">Social Media</span>
            </div>
            <label className="qr-checkbox">
              <input
                type="checkbox"
                checked={includeSocialMedia}
                onChange={(e) => setIncludeSocialMedia(e.target.checked)}
                className="qr-checkbox-input"
              />
              <span className="qr-checkbox-custom"></span>
            </label>
          </div>

          <div className="qr-option">
            <div className="qr-option-header">
              <FaGlobe className="qr-option-icon" />
              <span className="qr-option-label">Website</span>
            </div>
            <label className="qr-checkbox">
              <input
                type="checkbox"
                checked={includeWebsite}
                onChange={(e) => setIncludeWebsite(e.target.checked)}
                className="qr-checkbox-input"
              />
              <span className="qr-checkbox-custom"></span>
            </label>
          </div>
        </div>
      )}
      
      <div className="color-picker-container">
        <Button
          text="Change QR Color"
          color="blue"
          bold
          action={() => setShowColorPicker(!showColorPicker)}
          width={qrSize}
          icon={<IoColorPalette size={18} />} 
        />
        
        {showColorPicker && (
          <div className="color-picker-dropdown">
            <div className="custom-color-input">
              <input 
                type="color" 
                value={color}
                onChange={handleColorChange}
                className="color-input"
              />
              <span className="color-hex">{color.toUpperCase()}</span>
            </div>
            
            <div className="preset-colors">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className="color-swatch"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    setter(presetColor);
                    setShowColorPicker(false);
                  }}
                  title={presetColor}
                />
              ))}
            </div>
            
            <button 
              className="reset-color-btn"
              onClick={() => {
                setter("#000000");
                setShowColorPicker(false);
              }}
            >
              Reset to Black
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileQrCode;