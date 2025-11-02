import React, { useState } from 'react';
import './AddSocialMediaModal.css';
import Modal from '../Modal/Modal';
import Button from '../../../Profile/Button/Button';

const AddSocialMediaModal = ({ visible, onClose, setter }) => {
    const [socialMediaLink, setSocialMediaLink] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (socialMediaLink.trim()) {
            setter((oldLinks) => [...oldLinks, 
                {
                    id: crypto.randomUUID(),
                    url: socialMediaLink
                }
            ])
            setSocialMediaLink('');
            onClose();
        }
    };

    const handleCancel = () => {
        setSocialMediaLink('');
        onClose();
    };

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
                        onChange={(e) => setSocialMediaLink(e.target.value)}
                        placeholder="https://example.com/your-profile"
                        className="add-social-modal-input"
                        autoFocus
                    />
                </div>
                
                <div className="add-social-modal-actions">
                    <Button 
                        text = "Cancel"
                        color = "coral"
                        action={handleCancel}
                        className="add-social-modal-cancel-btn"
                    />
                    <Button 
                        text = "Add Link"
                        color = "green"
                        action={handleSubmit}
                        disabled={!socialMediaLink.trim()}
                        className="add-social-modal-cancel-btn"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddSocialMediaModal;