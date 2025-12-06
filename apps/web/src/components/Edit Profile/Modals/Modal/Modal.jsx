import React from 'react';
import './Modal.css';

const Modal = ({ visible, onClose, children, title, maxWidth = 700 }) => {
    if (!visible) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div 
                className="modal-container"
                style={{ maxWidth: `${maxWidth}px` }}
            >
                <div className="modal-header">
                    {title && <h2 className="modal-title">{title}</h2>}
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;