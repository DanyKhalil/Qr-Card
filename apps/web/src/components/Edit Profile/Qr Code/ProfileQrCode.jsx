import React, { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./ProfileQrCode.css";
import Button from "../../Profile/Button/Button";
import { IoColorPalette } from "react-icons/io5";

const ProfileQrCode = ({ profileUrl, color="#000000", setter }) => {
    const qrRef = useRef(null);
    const [qrSize, setQrSize] = useState(180);
    const [showColorPicker, setShowColorPicker] = useState(false);

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
            
            {/* QR Code Display */}
            <QRCodeCanvas 
                value={profileUrl} 
                size={qrSize}
                bgColor="#ffffff"
                fgColor={color}
            />
            
            <br />
            
            {/* Color Picker Section */}
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
                        {/* Custom Color Input */}
                        <div className="custom-color-input">
                            <input 
                                type="color" 
                                value={color}
                                onChange={handleColorChange}
                                className="color-input"
                            />
                            <span className="color-hex">{color.toUpperCase()}</span>
                        </div>
                        
                        {/* Preset Colors (Optional) */}
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
                        
                        {/* Reset to Default */}
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