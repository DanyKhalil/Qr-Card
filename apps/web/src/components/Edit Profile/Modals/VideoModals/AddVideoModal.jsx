import React, { useState } from 'react';
import "../AddSocialMediaModal/AddSocialMediaModal.css"
import Modal from '../Modal/Modal';
import Button from '../../../Profile/Button/Button';

const AddVideoModal = ({ visible, onClose, setter }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    
    const [videoUrlErrorMessage, setVideoUrlErrorMessage] = useState('');
    const [videoTitleErrorMessage, setVideoTitleErrorMessage] = useState('');
    const [videoUrlIsTouched, setVideoUrlIsTouched] = useState(false);
    const [videoTitleIsTouched, setVideoTitleIsTouched] = useState(false);

    const validateYouTubeUrl = (url) => {
        const trimmedUrl = url.trim();
        
        if (trimmedUrl === '') {
            return 'YouTube URL is required';
        }

        const youtubePatterns = [
            /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/, // Standard watch URL
            /^(https?:\/\/)?(www\.)?youtu\.be\/[a-zA-Z0-9_-]+/, // Short URL
            /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+/, // Embed URL
            /^(https?:\/\/)?(www\.)?youtube\.com\/v\/[a-zA-Z0-9_-]+/, // Legacy URL
            /^(https?:\/\/)?(www\.)?youtube\.com\/attribution_link\?.*v=[a-zA-Z0-9_-]+/, // Attribution links
        ];

        const isValidYouTubeUrl = youtubePatterns.some(pattern => pattern.test(trimmedUrl));
        
        if (!isValidYouTubeUrl) {
            return 'Please enter a valid YouTube URL (youtube.com, youtu.be)';
        }

        return '';
    };

    const validateVideoTitle = (title) => {
        const trimmedTitle = title.trim();
        
        if (trimmedTitle === '') {
            return 'Title is required';
        }
        if (trimmedTitle.length < 2) {
            return 'Title must be at least 2 characters long';
        }
        if (trimmedTitle.length > 100) {
            return 'Title must be less than 100 characters';
        }
        return '';
    };

    const handleVideoUrlChange = (e) => {
        const value = e.target.value;
        setVideoUrl(value);
        if (videoUrlIsTouched) {
            setVideoUrlErrorMessage(validateYouTubeUrl(value));
        }
    };

    const handleVideoTitleChange = (e) => {
        const value = e.target.value;
        setVideoTitle(value);
        if (videoTitleIsTouched) {
            setVideoTitleErrorMessage(validateVideoTitle(value));
        }
    };

    const handleVideoUrlBlur = () => {
        setVideoUrlIsTouched(true);
        setVideoUrlErrorMessage(validateYouTubeUrl(videoUrl));
    };

    const handleVideoTitleBlur = () => {
        setVideoTitleIsTouched(true);
        setVideoTitleErrorMessage(validateVideoTitle(videoTitle));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        setVideoUrlIsTouched(true);
        setVideoTitleIsTouched(true);
        
        const urlError = validateYouTubeUrl(videoUrl);
        const titleError = validateVideoTitle(videoTitle);
        
        setVideoUrlErrorMessage(urlError);
        setVideoTitleErrorMessage(titleError);

        if (urlError || titleError) {
            return;
        }

        if (videoUrl.trim() && videoTitle.trim()) {
            setter((oldVideos) => [...oldVideos, 
                {
                    id: crypto.randomUUID(),
                    video_url: videoUrl.trim(),
                    title: videoTitle.trim(),
                    description: videoDescription.trim(),
                }
            ])
            setVideoUrl('');
            setVideoTitle('');
            setVideoDescription('');
            setVideoUrlErrorMessage('');
            setVideoTitleErrorMessage('');
            setVideoUrlIsTouched(false);
            setVideoTitleIsTouched(false);
            onClose();
        }
    };

    const handleCancel = () => {
        setVideoUrl('');
        setVideoTitle('');
        setVideoDescription('');
        setVideoUrlErrorMessage('');
        setVideoTitleErrorMessage('');
        setVideoUrlIsTouched(false);
        setVideoTitleIsTouched(false);
        onClose();
    };

    const canSubmit = !videoUrlErrorMessage && !videoTitleErrorMessage && videoUrl.trim() && videoTitle.trim();

    return (
        <Modal 
            visible={visible} 
            onClose={handleCancel}
            title="Add Video"
        >
            <form onSubmit={handleSubmit} className="add-social-modal-form">
                <div className="add-social-modal-content">
                    <label htmlFor="video-url" className="add-social-modal-label">
                        YouTube URL *
                    </label>
                    <input
                        id="video-url"
                        type="url"
                        value={videoUrl}
                        onChange={handleVideoUrlChange}
                        onBlur={handleVideoUrlBlur}
                        placeholder="https://youtube.com/watch?v=..."
                        className={`add-social-modal-input ${videoUrlErrorMessage ? 'add-social-modal-input--error' : ''}`}
                        autoFocus
                    />
                    <div className="add-social-modal-message">
                        {videoUrlErrorMessage ? (
                            <div className="add-social-modal-error">
                                {videoUrlErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="video-title" className="add-social-modal-label">
                        Title *
                    </label>
                    <input
                        id="video-title"
                        type="text"
                        value={videoTitle}
                        onChange={handleVideoTitleChange}
                        onBlur={handleVideoTitleBlur}
                        placeholder="My Video"
                        className={`add-social-modal-input ${videoTitleErrorMessage ? 'add-social-modal-input--error' : ''}`}
                    />
                    <div className="add-social-modal-message">
                        {videoTitleErrorMessage ? (
                            <div className="add-social-modal-error">
                                {videoTitleErrorMessage}
                            </div>
                        ) : (
                            <div className="add-social-modal-error" style={{ visibility: "hidden" }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-social-modal-content">
                    <label htmlFor="video-description" className="add-social-modal-label">
                        Description
                    </label>
                    <input
                        id="video-description"
                        type="text"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="This video shows how..."
                        className="add-social-modal-input"
                    />
                </div>
                
                <div className="add-social-modal-actions">
                    <Button 
                        text="Cancel"
                        color="coral"
                        action={handleCancel}
                        className="add-social-modal-cancel-btn"
                    />
                    <Button 
                        text="Add Video"
                        color="green"
                        action={handleSubmit}
                        disabled={!canSubmit}
                        className="add-social-modal-submit-btn"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddVideoModal;