import React, { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./ProfileQrCode.css";
import Button from "../Button/Button";
import { IoDownload } from "react-icons/io5";
import IconWithName from "../Icon With Name/IconWithName";

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
  image, // Profile image URL
}) => {
  const qrRef = useRef(null);
  const [qrSize, setQrSize] = useState(180);

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

  // Load all icon images for canvas rendering
  const loadIconImages = async () => {
    const iconImages = {};
    
    // Get unique icon types from userLinks
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

  const handleDownload = async () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    // Create a larger canvas for the full design
    const padding = 40;
    const borderWidth = 2;
    const profileImageSize = 100; // INCREASED: Larger profile image
    const imageMargin = 20;
    const nameHeight = name ? 40 : 0;
    const qrCodeSize = qrSize * 0.7; // REDUCED: Smaller QR code (70% of original)
    
    // Calculate layout for vertical icons
    const maxIconsToShow = Math.min(userLinks.length, 6);
    const iconItemHeight = 35;
    const totalSocialHeight = maxIconsToShow * iconItemHeight;
    
    // Calculate max width needed for social items
    const iconImages = await loadIconImages();
    const iconSize = 20;
    const iconTextSize = 14;
    
    // Measure the longest username to determine canvas width
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
    
    // Calculate total content width (icon + spacing + text)
    const totalContentWidth = iconSize + 15 + maxTextWidth;
    
    // Ensure canvas is wide enough for content
    const minWidth = Math.max(qrCodeSize + (padding * 2), totalContentWidth + (padding * 2));
    const totalWidth = minWidth;
    
    // Calculate total height including profile image
    const totalHeight = profileImageSize + imageMargin + nameHeight + qrCodeSize + 
                        (padding * 2) + totalSocialHeight + 40;
    
    const downloadCanvas = document.createElement("canvas");
    downloadCanvas.width = totalWidth;
    downloadCanvas.height = totalHeight;
    const ctx = downloadCanvas.getContext("2d");

    // Fill background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw outer border
    ctx.strokeStyle = color;
    ctx.lineWidth = 6; // INCREASED from 2 to 6px for thicker border
    ctx.strokeRect(
      3, // Changed from borderWidth/2 (which was 1) to 3 (half of 6)
      3,
      totalWidth - 6, // Changed from totalWidth - borderWidth to totalWidth - 6
      totalHeight - 6
    );

    // Draw subtle inner border for design
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      borderWidth + 10,
      borderWidth + 10,
      totalWidth - borderWidth - 20,
      totalHeight - borderWidth - 20
    );

    // Draw profile image if provided
    if (image) {
      try {
        const profileImg = await loadImage(image);
        const imageX = totalWidth / 2 - profileImageSize / 2;
        const imageY = padding;
        
        // Create rounded image with clipping
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
        
        // Draw the image
        ctx.drawImage(
          profileImg,
          imageX,
          imageY,
          profileImageSize,
          profileImageSize
        );
        
        // Restore context
        ctx.restore();
        
        // ADD THICK BORDER AROUND IMAGE (4px thick, same as QR color)
        ctx.beginPath();
        ctx.arc(
          totalWidth / 2,
          imageY + profileImageSize / 2,
          profileImageSize / 2,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = 4; // Thick border
        ctx.stroke();
        
        // ADD INNER WHITE BORDER FOR NICE EFFECT
        ctx.beginPath();
        ctx.arc(
          totalWidth / 2,
          imageY + profileImageSize / 2,
          profileImageSize / 2 - 2, // Slightly smaller radius
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
      } catch (error) {
        console.warn("Failed to load profile image:", error);
        // Fallback: draw a placeholder circle with thick border
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
        
        // Thick colored border for placeholder
        ctx.beginPath();
        ctx.arc(
          totalWidth / 2,
          padding + profileImageSize / 2,
          profileImageSize / 2,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = 4; // Thick border
        ctx.stroke();
        
        // Draw initial letter
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

    // Draw QR code (centered)
    const qrY = padding + profileImageSize + imageMargin + nameHeight;
    const qrX = (totalWidth - qrCodeSize) / 2;
    
    // Draw QR code background with gradient for better look
    const gradient = ctx.createLinearGradient(
      qrX - 10, qrY - 10, 
      qrX + qrCodeSize + 10, qrY + qrCodeSize + 10
    );
    gradient.addColorStop(0, "#f8f8f8");
    gradient.addColorStop(1, "#f0f0f0");
    ctx.fillStyle = gradient;
    ctx.fillRect(qrX - 10, qrY - 10, qrCodeSize + 20, qrCodeSize + 20);
    
    // Draw QR code border
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX - 10, qrY - 10, qrCodeSize + 20, qrCodeSize + 20);

    // Draw QR code with subtle shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.drawImage(canvas, qrX, qrY, qrCodeSize, qrCodeSize);
    ctx.shadowColor = "transparent"; // Reset shadow

    // Draw name if provided (positioned below image)
    if (name) {
      ctx.font = "bold 28px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = "#333333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const nameY = padding + profileImageSize + imageMargin;
      
      // Add subtle text shadow for depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;
      ctx.fillText(name, totalWidth / 2, nameY);
      ctx.shadowColor = "transparent"; // Reset shadow
    }

    // Draw social media icons and usernames if provided
    if (userLinks.length > 0) {
      // Center the group of social links
      const groupStartX = totalWidth / 2;
      const groupStartY = qrY + qrCodeSize + 40;
      
      for (let i = 0; i < maxIconsToShow; i++) {
        const link = userLinks[i];
        const y = groupStartY + (i * iconItemHeight);
        
        // Calculate width of this specific item
        const displayName = link.name || "";
        ctx.font = `${iconTextSize}px 'Segoe UI', Arial, sans-serif`;
        const textWidth = ctx.measureText(displayName).width;
        const itemWidth = iconSize + 15 + textWidth;
        
        // Calculate starting X position to center this item
        const itemStartX = groupStartX - (itemWidth / 2);
        
        // Draw circular colored background for icon (pretty effect)
        ctx.beginPath();
        ctx.arc(
          itemStartX + iconSize/2,
          y,
          iconSize/2 + 4, // Slightly larger than icon
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `${color}20`; // Color with 20% opacity
        ctx.fill();
        
        // Draw icon
        const iconName = link.iconName?.toLowerCase();
        if (iconImages[iconName]) {
          ctx.drawImage(
            iconImages[iconName], 
            itemStartX, 
            y - iconSize/2, 
            iconSize, 
            iconSize
          );
        } else {
          // Fallback: draw text icon
          ctx.font = `bold ${iconSize}px Arial`;
          ctx.fillStyle = color;
          ctx.textAlign = "left";
          ctx.fillText(iconName?.charAt(0).toUpperCase() || "?", itemStartX, y);
        }
        
        // Draw username
        ctx.font = `${iconTextSize}px 'Segoe UI', Arial, sans-serif`;
        ctx.fillStyle = "#666666";
        ctx.textAlign = "left";
        
        // Truncate long usernames if they exceed canvas width
        let displayText = displayName;
        if (displayText && displayText.length > 25) {
          displayText = displayText.substring(0, 22) + '...';
        }
        
        ctx.fillText(displayText, itemStartX + iconSize + 10, y + 5);
      }
    }

    // Download the composite image
    const downloadedImage = downloadCanvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadedImage;
    downloadLink.download = `${name.replace(/\s+/g, '_').toLowerCase() || 'profile'}_qr_code.png`;
    downloadLink.click();
  };

  return (
    <div className="qr-container" ref={qrRef}>
      <h2 className="title-section-title">Share Profile</h2>
      
      {/* Preview container with border and name */}
      <div className="qr-preview" style={{
        border: `2px solid ${color}`,
        padding: '25px',
        borderRadius: '12px',
        backgroundColor: 'white',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Profile image - Updated with thick border to match download */}
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
                width: '100px', // Increased to match download
                height: '100px', // Increased to match download
                borderRadius: '50%',
                objectFit: 'cover',
                border: `4px solid ${color}`, // Thick border to match download
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Added shadow
                padding: '2px', // Creates inner white border effect
                backgroundColor: 'white' // Creates inner white border
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                // Show fallback
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
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' // Added text shadow
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
          action={handleDownload}
          width={qrSize + 40}
          icon={<IoDownload size={18} />} 
        />
      </div>
    </div>
  );
};

export default ProfileQrCode;