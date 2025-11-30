import React, { useState } from 'react';
import './AddSocialMediaModal.css';
import Modal from '../Modal/Modal';
import Button from '../../../Profile/Button/Button';

const AddSocialMediaModal = ({ visible, onClose, setter }) => {
    const [socialMediaLink, setSocialMediaLink] = useState('');
    const [socialMediaLinkErrorMessage, setSocialMediaLinkErrorMessage] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const socialMediaPatterns = {
        whatsapp: /^(https?:\/\/)?(www\.)?(wa\.me\/|whatsapp\.com\/)/,
        facebook: /^(https?:\/\/)?(www\.)?(facebook\.com\/|fb\.com\/)/,
        instagram: /^(https?:\/\/)?(www\.)?instagram\.com\//,
        tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\//,
        youtube: /^(https?:\/\/)?(www\.)?(youtube\.com\/|youtu\.be\/)/,
        x: /^(https?:\/\/)?(www\.)?x\.com\//,
        twitter: /^(https?:\/\/)?(www\.)?(twitter\.com\/|x\.com\/)/,
        linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\//,
        github: /^(https?:\/\/)?(www\.)?github\.com\//
    };

    const validateSocialMediaLink = (url) => {
        const trimmedUrl = url.trim();
        
        if (trimmedUrl === '') {
            return 'Please enter a social media link';
        }

        const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?$/;
        if (!urlPattern.test(trimmedUrl)) {
            return 'Please enter a valid URL';
        }

        const isSupportedPlatform = Object.values(socialMediaPatterns).some(pattern => 
            pattern.test(trimmedUrl)
        );

        if (!isSupportedPlatform) {
            const supportedPlatforms = Object.keys(socialMediaPatterns).join(', ');
            return `Please enter a supported social media link (${supportedPlatforms})`;
        }

        return '';
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSocialMediaLink(value);
        
        if (isTouched) {
            const error = validateSocialMediaLink(value);
            setSocialMediaLinkErrorMessage(error);
        }
    };

    const handleInputBlur = () => {
        setIsTouched(true);
        const error = validateSocialMediaLink(socialMediaLink);
        setSocialMediaLinkErrorMessage(error);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsTouched(true);
        
        const error = validateSocialMediaLink(socialMediaLink);
        if (error) {
            setSocialMediaLinkErrorMessage(error);
            return;
        }

        if (socialMediaLink.trim()) {
            setter((oldLinks) => [...oldLinks, 
                {
                    id: crypto.randomUUID(),
                    url: socialMediaLink.trim()
                }
            ]);
            setSocialMediaLink('');
            setSocialMediaLinkErrorMessage('');
            setIsTouched(false);
            onClose();
        }
    };

    const handleCancel = () => {
        setSocialMediaLink('');
        setSocialMediaLinkErrorMessage('');
        setIsTouched(false);
        onClose();
    };

    const detectPlatform = (url) => {
        for (const [platform, pattern] of Object.entries(socialMediaPatterns)) {
            if (pattern.test(url)) {
                return platform;
            }
        }
        return null;
    };

    const currentPlatform = detectPlatform(socialMediaLink);

    return (
        <Modal 
            visible={visible} 
            onClose={handleCancel}
            title="Add Social Media Link"
        >
            <form onSubmit={handleSubmit} className="add-social-modal-form">
                <div className="add-social-modal-content">
                    <label htmlFor="social-link" className="add-social-modal-label">
                        Social Media Link
                    </label>
                    <input
                        id="social-link"
                        type="url"
                        value={socialMediaLink}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="https://instagram.com/yourusername"
                        className={`add-social-modal-input ${socialMediaLinkErrorMessage ? 'add-social-modal-input--error' : ''}`}
                        autoFocus
                    />
                    <div className="add-social-modal-message">
                        {socialMediaLinkErrorMessage ? (
                            <div className="add-social-modal-error">
                                {socialMediaLinkErrorMessage}
                            </div>
                        ) : currentPlatform ? (
                            <div className="add-social-modal-platform-hint">
                                ✓ {currentPlatform.charAt(0).toUpperCase() + currentPlatform.slice(1)} link detected
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="add-social-modal-actions">
                    <Button 
                        text="Cancel"
                        color="coral"
                        action={handleCancel}
                        className="add-social-modal-cancel-btn"
                    />
                    <Button 
                        text="Add Link"
                        color="green"
                        action={handleSubmit}
                        disabled={!socialMediaLink.trim() || !!socialMediaLinkErrorMessage}
                        className="add-social-modal-submit-btn"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddSocialMediaModal;