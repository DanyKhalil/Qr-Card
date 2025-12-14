import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import './PopupComponent.css';

const PopupComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Check if user already closed it before
    const wasClosed = localStorage.getItem('popupClosed');
    if (wasClosed === 'true') {
      setIsVisible(false);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('popupClosed', 'true');
    }, 300);
  };

  const handleJoinClick = () => {
    window.location.href = '/registration';
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div 
        className={`popup-container ${isExiting ? 'popup-exiting' : ''}`}
      >
        <div className="popup-card">
          {/* Decorative top accent */}
          <div className="popup-accent" />
          
          <div className="popup-content">
            {/* Header with close button */}
            <div className="popup-header">
              <div className="popup-title-container">
                <div className="popup-icon">
                  <Sparkles className="icon" />
                </div>
                <h3 className="popup-title">
                  Join Our Community
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="close-button"
                aria-label="Close popup"
              >
                <X className="close-icon" />
              </button>
            </div>

            {/* Content */}
            <div className="popup-body">
              <p className="popup-description">
                Create your personalized profile and unlock premium features for your first month - completely free. No credit card required.
              </p>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-dot dot-blue" />
                  <span className="feature-text">Customizable profile</span>
                </div>
                <div className="feature-item">
                  <div className="feature-dot dot-purple" />
                  <span className="feature-text">Easy sharing</span>
                </div>
                <div className="feature-item">
                  <div className="feature-dot dot-pink" />
                  <span className="feature-text">Advanced analytics</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleJoinClick}
              className="cta-button"
            >
              <span>Start Free Month</span>
              <ArrowRight className="arrow-icon" />
            </button>

            {/* Footer note */}
            <p className="footer-note">
              No commitment - Cancel anytime
            </p>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="decorative-element decor-1" />
        <div className="decorative-element decor-2" />
      </div>
    </div>
  );
};

export default PopupComponent;