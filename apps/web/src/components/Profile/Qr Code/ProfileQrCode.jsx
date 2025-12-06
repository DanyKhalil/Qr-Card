import React, { useRef, useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./ProfileQrCode.css";
import Button from "../Button/Button";
import { IoDownload } from "react-icons/io5";
import IconWithName from "../Icon With Name/IconWithName";
import Modal from "../../Edit Profile/Modals/Modal/Modal";

// Import your icons directly
import Whatsapp from "../../../assets/images/icons/whatsapp-icon-black.png";
import Instagram from "../../../assets/images/icons/instagram-icon-black.png";
import Facebook from "../../../assets/images/icons/facebook-icon-black.png";
import Tiktok from "../../../assets/images/icons/tiktok-icon-black.png";
import Youtube from "../../../assets/images/icons/youtube-icon-black.png";
import X from "../../../assets/images/icons/x-icon-black.png";
import Github from "../../../assets/images/icons/github-icon-black.png";
import Phone from "../../../assets/images/icons/phone-icon-black.png";
import Email from "../../../assets/images/icons/email-icon-black.png";
import Web from "../../../assets/images/icons/web-icon-black.png";
import LinkedIn from "../../../assets/images/icons/linkedin-icon-black.png";

const ProfileQrCode = ({ 
  profileUrl, 
  color = "#000000", 
  name = "",
  userLinks = [],
  image,
}) => {
  console.log('profile', profileUrl)
  console.log('links', userLinks)
  const qrRef = useRef(null);
  const [qrSize, setQrSize] = useState(180);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("classic");
  const [previewDataUrls, setPreviewDataUrls] = useState({});

  if (!profileUrl) return null;

  useEffect(() => {
    const updateSize = () => {
      if (qrRef.current) {
        const containerWidth = qrRef.current.offsetWidth;
        setQrSize(Math.min(containerWidth * 0.6, 300));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Icon mapping object using imported images
  const iconMap = {
    whatsapp: Whatsapp,
    facebook: Facebook,
    instagram: Instagram,
    tiktok: Tiktok,
    youtube: Youtube,
    x: X,
    twitter: X,
    linkedin: LinkedIn,
    github: Github,
    phone: Phone,
    email: Email,
    web: Web,
  };

  const loadIconImages = async () => {
    const iconImages = {};
    
    const uniqueIcons = [...new Set(userLinks.map(link => link.iconName?.toLowerCase()))];
    
    for (const iconName of uniqueIcons) {
      if (iconName && iconMap[iconName]) {
        try {
          const iconSrc = iconMap[iconName];
          const img = await loadImage(iconSrc);
          iconImages[iconName] = img;
        } catch (error) {
          console.warn(`Failed to load icon for ${iconName}:`, error);
        }
      }
    }
    
    return iconImages;
  };

  // Function to create QR code preview with specific style
  const createQRCodePreview = useCallback(async (style) => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return null;

    // Style-specific configurations
    const styleConfigs = {
      classic: {
        profileImageSize: 80,
        imageMargin: 15,
        qrCodeSizeFactor: 0.6,
        nameFont: "bold 22px 'Georgia', serif",
        socialFont: "12px 'Segoe UI', Arial, sans-serif",
        borderWidth: 4,
        showGradient: true,
        backgroundColor: "#ffffff",
        borderColor: color,
      },
      modern: {
        profileImageSize: 85,
        imageMargin: 20,
        qrCodeSizeFactor: 0.55,
        nameFont: "bold 24px 'Helvetica', Arial, sans-serif",
        socialFont: "11px 'Arial', sans-serif",
        borderWidth: 6,
        showGradient: false,
        backgroundColor: "#f9f9f9",
        borderColor: color,
      },
      elegant: {
        profileImageSize: 75,
        imageMargin: 25,
        qrCodeSizeFactor: 0.65,
        nameFont: "bold 20px 'Lucida Handwriting', cursive",
        socialFont: "10px 'Lucida Handwriting', cursive",
        borderWidth: 3,
        showGradient: true,
        backgroundColor: "#ffffff",
        borderColor: "#333333",
      }
    };

    const config = styleConfigs[style] || styleConfigs.classic;
    
    // Smaller canvas for preview
    const padding = 20;
    const borderWidth = config.borderWidth;
    const profileImageSize = config.profileImageSize;
    const imageMargin = config.imageMargin;
    const nameHeight = name ? 30 : 0;
    const qrCodeSize = qrSize * config.qrCodeSizeFactor;
    
    // Calculate layout for vertical icons (show max 2 for preview)
    const maxIconsToShow = Math.min(userLinks.length, 2);
    const iconItemHeight = 25;
    const totalSocialHeight = maxIconsToShow * iconItemHeight;
    
    // Calculate max width needed
    const iconImages = await loadIconImages();
    const iconSize = 16;
    const iconTextSize = style === 'elegant' ? 10 : style === 'modern' ? 11 : 12;
    
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = `${iconTextSize}px 'Segoe UI', Arial, sans-serif`;
    
    let maxTextWidth = 0;
    for (let i = 0; i < Math.min(maxIconsToShow, userLinks.length); i++) {
      const link = userLinks[i];
      const displayName = link.name || "";
      const textWidth = tempCtx.measureText(displayName).width;
      maxTextWidth = Math.max(maxTextWidth, textWidth);
    }
    
    const totalContentWidth = iconSize + 10 + maxTextWidth;
    const minWidth = Math.max(qrCodeSize + (padding * 2), totalContentWidth + (padding * 2));
    const totalWidth = minWidth;
    
    const totalHeight = profileImageSize + imageMargin + nameHeight + qrCodeSize + 
                        (padding * 2) + totalSocialHeight + 20;
    
    const previewCanvas = document.createElement("canvas");
    previewCanvas.width = totalWidth;
    previewCanvas.height = totalHeight;
    const ctx = previewCanvas.getContext("2d");

    // Fill background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw outer border
    ctx.strokeStyle = config.borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(
      borderWidth / 2,
      borderWidth / 2,
      totalWidth - borderWidth,
      totalHeight - borderWidth
    );

    // Draw profile image
    if (image) {
      try {
        const profileImg = await loadImage(image);
        const imageX = totalWidth / 2 - profileImageSize / 2;
        const imageY = padding;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          imageX + profileImageSize / 2,
          imageY + profileImageSize / 2,
          profileImageSize / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(profileImg, imageX, imageY, profileImageSize, profileImageSize);
        ctx.restore();
        
        // Border around image
        ctx.beginPath();
        ctx.arc(
          totalWidth / 2,
          imageY + profileImageSize / 2,
          profileImageSize / 2,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = style === 'elegant' ? 2 : 3;
        ctx.stroke();
        
      } catch (error) {
        // Fallback placeholder
        ctx.beginPath();
        ctx.arc(
          totalWidth / 2,
          padding + profileImageSize / 2,
          profileImageSize / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "#f0f0f0";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.font = `bold ${profileImageSize/2}px 'Segoe UI', Arial, sans-serif`;
        ctx.fillStyle = "#666";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          name?.charAt(0).toUpperCase() || "?",
          totalWidth / 2,
          padding + profileImageSize / 2
        );
      }
    }

    // Draw QR code
    const qrY = padding + profileImageSize + imageMargin + nameHeight;
    const qrX = (totalWidth - qrCodeSize) / 2;
    
    // QR code background
    if (config.showGradient) {
      const gradient = ctx.createLinearGradient(
        qrX - 8, qrY - 8, 
        qrX + qrCodeSize + 8, qrY + qrCodeSize + 8
      );
      gradient.addColorStop(0, "#f8f8f8");
      gradient.addColorStop(1, "#f0f0f0");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = "#f5f5f5";
    }
    ctx.fillRect(qrX - 8, qrY - 8, qrCodeSize + 16, qrCodeSize + 16);
    
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    ctx.strokeRect(qrX - 8, qrY - 8, qrCodeSize + 16, qrCodeSize + 16);

    // Draw QR code
    ctx.drawImage(canvas, qrX, qrY, qrCodeSize, qrCodeSize);

    // Draw name
    if (name) {
      ctx.font = config.nameFont;
      ctx.fillStyle = style === 'elegant' ? "#222" : style === 'modern' ? "#111" : "#333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const nameY = padding + profileImageSize + imageMargin;
      
      // Truncate name if too long for preview
      let displayName = name;
      if (displayName.length > 15) {
        displayName = displayName.substring(0, 12) + '...';
      }
      
      ctx.fillText(displayName, totalWidth / 2, nameY);
    }

    // Draw social media icons (max 2 for preview)
    if (userLinks.length > 0) {
      const groupStartX = totalWidth / 2;
      const groupStartY = qrY + qrCodeSize + 20;
      
      for (let i = 0; i < maxIconsToShow; i++) {
        const link = userLinks[i];
        const y = groupStartY + (i * iconItemHeight);
        
        const displayName = link.name || "";
        ctx.font = config.socialFont;
        const textWidth = ctx.measureText(displayName).width;
        const itemWidth = iconSize + 8 + textWidth;
        const itemStartX = groupStartX - (itemWidth / 2);
        
        // Draw icon
        const iconName = link.iconName?.toLowerCase();
        if (iconImages[iconName]) {
          ctx.drawImage(iconImages[iconName], itemStartX, y - iconSize/2, iconSize, iconSize);
        } else {
          ctx.font = `bold ${iconSize}px Arial`;
          ctx.fillStyle = color;
          ctx.textAlign = "left";
          ctx.fillText(iconName?.charAt(0).toUpperCase() || "?", itemStartX, y);
        }
        
        // Draw username (truncated for preview)
        ctx.font = config.socialFont;
        ctx.fillStyle = style === 'elegant' ? "#555" : style === 'modern' ? "#444" : "#666";
        ctx.textAlign = "left";
        
        let displayText = displayName;
        if (displayText && displayText.length > 12) {
          displayText = displayText.substring(0, 10) + '...';
        }
        
        ctx.fillText(displayText, itemStartX + iconSize + 5, y + 4);
      }
    }

    return previewCanvas.toDataURL("image/png");
  }, [profileUrl, name, userLinks, image, color, qrSize]);

  // Generate previews when modal opens
  useEffect(() => {
    if (showStyleModal) {
      const generatePreviews = async () => {
        const styles = ['classic', 'modern', 'elegant'];
        const previews = {};
        
        for (const style of styles) {
          const preview = await createQRCodePreview(style);
          if (preview) {
            previews[style] = preview;
          }
        }
        
        setPreviewDataUrls(previews);
      };
      
      generatePreviews();
    }
  }, [showStyleModal, createQRCodePreview]);

  // Function to create QR code with specific style for download
  const createQRCodeForDownload = async (style) => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return null;

    // Full size configurations for download
    const styleConfigs = {
      classic: {
        profileImageSize: 100,
        imageMargin: 20,
        qrCodeSizeFactor: 0.7,
        nameFont: "bold 28px 'Georgia', serif",
        socialFont: "14px 'Segoe UI', Arial, sans-serif",
        borderWidth: 6,
        showGradient: true,
        backgroundColor: "#ffffff",
        borderColor: color,
      },
      modern: {
        profileImageSize: 110,
        imageMargin: 25,
        qrCodeSizeFactor: 0.65,
        nameFont: "bold 30px 'Helvetica', Arial, sans-serif",
        socialFont: "13px 'Arial', sans-serif",
        borderWidth: 8,
        showGradient: false,
        backgroundColor: "#f9f9f9",
        borderColor: color,
      },
      elegant: {
        profileImageSize: 90,
        imageMargin: 30,
        qrCodeSizeFactor: 0.75,
        nameFont: "bold 26px 'Lucida Handwriting', cursive",
        socialFont: "12px 'Lucida Handwriting', cursive",
        borderWidth: 4,
        showGradient: true,
        backgroundColor: "#ffffff",
        borderColor: "#333333",
      }
    };

    const config = styleConfigs[style] || styleConfigs.classic;
    
    const padding = 40;
    const borderWidth = config.borderWidth;
    const profileImageSize = config.profileImageSize;
    const imageMargin = config.imageMargin;
    const nameHeight = name ? 40 : 0;
    const qrCodeSize = qrSize * config.qrCodeSizeFactor;
    
    const maxIconsToShow = Math.min(userLinks.length, 6);
    const iconItemHeight = 35;
    const totalSocialHeight = maxIconsToShow * iconItemHeight;
    
    const iconImages = await loadIconImages();
    const iconSize = 20;
    const iconTextSize = style === 'elegant' ? 12 : style === 'modern' ? 13 : 14;
    
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = `${iconTextSize}px 'Segoe UI', Arial, sans-serif`;
    
    let maxTextWidth = 0;
    for (let i = 0; i < maxIconsToShow; i++) {
      const link = userLinks[i];
      const displayName = link.name || "";
      const textWidth = tempCtx.measureText(displayName).width;
      maxTextWidth = Math.max(maxTextWidth, textWidth);
    }
    
    const totalContentWidth = iconSize + 15 + maxTextWidth;
    const minWidth = Math.max(qrCodeSize + (padding * 2), totalContentWidth + (padding * 2));
    const totalWidth = minWidth;
    
    const totalHeight = profileImageSize + imageMargin + nameHeight + qrCodeSize + 
                        (padding * 2) + totalSocialHeight + 40;
    
    const downloadCanvas = document.createElement("canvas");
    downloadCanvas.width = totalWidth * 3;
    downloadCanvas.height = totalHeight * 3;
    const ctx = downloadCanvas.getContext("2d");

    ctx.scale(3, 3);

    // Fill background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw outer border
    ctx.strokeStyle = config.borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(
      borderWidth / 2,
      borderWidth / 2,
      totalWidth - borderWidth,
      totalHeight - borderWidth
    );

    // Draw subtle inner border
    ctx.strokeStyle = style === 'elegant' ? "#ddd" : "#f0f0f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      borderWidth + 10,
      borderWidth + 10,
      totalWidth - borderWidth - 20,
      totalHeight - borderWidth - 20
    );

    // Draw profile image
    if (image) {
      try {
        const profileImg = await loadImage(image);
        const imageX = totalWidth / 2 - profileImageSize / 2;
        const imageY = padding;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          imageX + profileImageSize / 2,
          imageY + profileImageSize / 2,
          profileImageSize / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(profileImg, imageX, imageY, profileImageSize, profileImageSize);
        ctx.restore();
        
        // Border around image
        ctx.beginPath();
        ctx.arc(
          totalWidth / 2,
          imageY + profileImageSize / 2,
          profileImageSize / 2,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = style === 'elegant' ? 3 : 4;
        ctx.stroke();
        
      } catch (error) {
        // Fallback placeholder
        ctx.beginPath();
        ctx.arc(
          totalWidth / 2,
          padding + profileImageSize / 2,
          profileImageSize / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "#f0f0f0";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.font = `bold ${profileImageSize/2}px 'Segoe UI', Arial, sans-serif`;
        ctx.fillStyle = "#666";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          name?.charAt(0).toUpperCase() || "?",
          totalWidth / 2,
          padding + profileImageSize / 2
        );
      }
    }

    // Draw QR code
    const qrY = padding + profileImageSize + imageMargin + nameHeight;
    const qrX = (totalWidth - qrCodeSize) / 2;
    
    // QR code background
    if (config.showGradient) {
      const gradient = ctx.createLinearGradient(
        qrX - 10, qrY - 10, 
        qrX + qrCodeSize + 10, qrY + qrCodeSize + 10
      );
      gradient.addColorStop(0, "#f8f8f8");
      gradient.addColorStop(1, "#f0f0f0");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = "#f5f5f5";
    }
    ctx.fillRect(qrX - 10, qrY - 10, qrCodeSize + 20, qrCodeSize + 20);
    
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX - 10, qrY - 10, qrCodeSize + 20, qrCodeSize + 20);

    // Draw QR code with shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.drawImage(canvas, qrX, qrY, qrCodeSize, qrCodeSize);
    ctx.shadowColor = "transparent";

    // Draw name
    if (name) {
      ctx.font = config.nameFont;
      ctx.fillStyle = style === 'elegant' ? "#222" : style === 'modern' ? "#111" : "#333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const nameY = padding + profileImageSize + imageMargin;
      
      ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
      ctx.shadowBlur = style === 'elegant' ? 1 : 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillText(name, totalWidth / 2, nameY);
      ctx.shadowColor = "transparent";
    }

    // Draw social media icons
    if (userLinks.length > 0) {
      const groupStartX = totalWidth / 2;
      const groupStartY = qrY + qrCodeSize + 40;
      
      for (let i = 0; i < maxIconsToShow; i++) {
        const link = userLinks[i];
        const y = groupStartY + (i * iconItemHeight);
        
        const displayName = link.name || "";
        ctx.font = config.socialFont;
        const textWidth = ctx.measureText(displayName).width;
        const itemWidth = iconSize + 15 + textWidth;
        const itemStartX = groupStartX - (itemWidth / 2);
        
        // Draw icon background
        ctx.beginPath();
        ctx.arc(itemStartX + iconSize/2, y, iconSize/2 + 4, 0, Math.PI * 2);
        ctx.fillStyle = style === 'modern' ? `${color}15` : `${color}20`;
        ctx.fill();
        
        // Draw icon
        const iconName = link.iconName?.toLowerCase();
        if (iconImages[iconName]) {
          ctx.drawImage(iconImages[iconName], itemStartX, y - iconSize/2, iconSize, iconSize);
        } else {
          ctx.font = `bold ${iconSize}px Arial`;
          ctx.fillStyle = color;
          ctx.textAlign = "left";
          ctx.fillText(iconName?.charAt(0).toUpperCase() || "?", itemStartX, y);
        }
        
        // Draw username
        ctx.font = config.socialFont;
        ctx.fillStyle = style === 'elegant' ? "#555" : style === 'modern' ? "#444" : "#666";
        ctx.textAlign = "left";
        
        let displayText = displayName;
        if (displayText && displayText.length > 25) {
          displayText = displayText.substring(0, 22) + '...';
        }
        
        ctx.fillText(displayText, itemStartX + iconSize + 10, y + 5);
      }
    }

    return downloadCanvas.toDataURL("image/png");
  };

  const handleDownloadClick = () => {
    setShowStyleModal(true);
  };

  const handleStyleSelect = async (style) => {
    setSelectedStyle(style);
    const imageData = await createQRCodeForDownload(style);
    if (imageData) {
      const downloadLink = document.createElement("a");
      downloadLink.href = imageData;
      downloadLink.download = `${name.replace(/\s+/g, '_').toLowerCase()}_${style}_qr_code.png`;
      downloadLink.click();
    }
    setShowStyleModal(false);
  };

  const StylePreviewCard = ({ style, title, description, isSelected, onClick, previewUrl }) => (
    <div 
      className={`style-preview-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(style)}
    >
      <div className="preview-image-container">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={`${title} style preview`}
            className="style-preview-image"
          />
        ) : (
          <div className="preview-loading">Generating preview...</div>
        )}
      </div>
      <div className="preview-info">
        <div className="preview-title" style={{
          fontFamily: style === 'classic' ? "'Georgia', serif" : 
                     style === 'modern' ? "'Helvetica', sans-serif" : 
                     "'Times New Roman', serif",
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '5px',
          color: '#333'
        }}>
          {title}
        </div>
        <div className="preview-description" style={{
          fontFamily: style === 'classic' ? "'Segoe UI', sans-serif" : 
                     style === 'modern' ? "'Arial', sans-serif" : 
                     "'Times New Roman', serif",
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.4'
        }}>
          {description}
        </div>
        <div className="preview-select-button">
          Download {title}
        </div>
      </div>
    </div>
  );

  return (
    <div className="qr-container" ref={qrRef}>
      <h2 className="title-section-title">Share Profile</h2>
      
      <div className="qr-preview" style={{
        border: `2px solid ${color}`,
        padding: '25px',
        borderRadius: '12px',
        backgroundColor: 'white',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        {image && (
          <div className="qr-profile-image" style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '15px'
          }}>
            <img 
              src={image} 
              alt={name || "Profile"} 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `4px solid ${color}`,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '2px',
                backgroundColor: 'white'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                  width: 100px;
                  height: 100px;
                  border-radius: 50%;
                  background: #f0f0f0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 4px solid ${color};
                  font-size: 36px;
                  color: #666;
                `;
                placeholder.textContent = name ? name.charAt(0).toUpperCase() : '👤';
                e.target.parentNode.appendChild(placeholder);
              }}
            />
          </div>
        )}
        
        {name && (
          <div className="qr-name" style={{
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            <h3 style={{ 
              margin: 0, 
              color: '#333',
              fontSize: '24px',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>{name}</h3>
          </div>
        )}
        
        <div className="qr-code-wrapper" style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <QRCodeCanvas 
            value={profileUrl} 
            size={qrSize}
            bgColor="#ffffff"
            fgColor={color}
          />
        </div>
        
        {userLinks.length > 0 && (
          <div className="qr-social" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            marginTop: '20px',
          }}>
            {userLinks.slice(0, 6).map((link, index) => (
              <div key={index} style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-start',
                maxWidth: '250px'
              }}>
                <IconWithName
                  name={link.name}
                  iconName={link.iconName}
                  link={link.link}
                  fontSize="16px"
                  iconSize="22px"
                  className="qr-social-item"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Button
          text="Download QR Code"
          color="green"
          bold
          action={handleDownloadClick}
          width={qrSize + 40}
          icon={<IoDownload size={18} />} 
        />
      </div>

      {/* Style Selection Modal with Previews */}
      <Modal 
        visible={showStyleModal}
        onClose={() => setShowStyleModal(false)}
        title="Choose QR Code Style"
        maxWidth={1000}
      >
        <div className="style-selection-container">
          <div className="style-preview-grid">
            <StylePreviewCard
              style="classic"
              title="Classic"
              description="Professional design with serif fonts and gradient background"
              isSelected={selectedStyle === "classic"}
              onClick={handleStyleSelect}
              previewUrl={previewDataUrls.classic}
            />
            
            <StylePreviewCard
              style="modern"
              title="Modern"
              description="Sleek design with sans-serif fonts and minimal borders"
              isSelected={selectedStyle === "modern"}
              onClick={handleStyleSelect}
              previewUrl={previewDataUrls.modern}
            />
            
            <StylePreviewCard
              style="elegant"
              title="Elegant"
              description="Sophisticated serif fonts with refined spacing"
              isSelected={selectedStyle === "elegant"}
              onClick={handleStyleSelect}
              previewUrl={previewDataUrls.elegant}
            />
          </div>
          <div className="style-modal-footer">
            <Button
              text="Cancel"
              color="gray"
              action={() => setShowStyleModal(false)}
              width="120px"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileQrCode;