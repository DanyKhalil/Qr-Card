import React, { useEffect, useState } from 'react';
import "../AddSocialMediaModal/AddSocialMediaModal.css"
import Modal from '../Modal/Modal';
import Button from '../../../Profile/Button/Button';

const EditVideoModal = ({ videoObject ,visible, onClose, setter }) => {
    const [videoUrl, setVideoUrl] = useState(videoObject.video_url);
    const [videoTitle, setVideoTitle] = useState(videoObject.title);
    const [videoDescription, setVideoDescription] = useState(videoObject.description);

    useEffect(() => {
        setVideoUrl(videoObject.video_url);
        setVideoTitle(videoObject.title);
        setVideoDescription(videoObject.description);
    }, [videoObject]); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (videoUrl.trim() && videoTitle.trim()) {
            setter((oldVideos) => 
                oldVideos.map(vid => 
                    vid.id === videoObject.id 
                        ? {
                            ...vid,
                            video_url: videoUrl.trim(),
                            title: videoTitle.trim(),
                            description: videoDescription.trim(),
                          }
                        : vid
                )
            );
            setVideoUrl('');
            setVideoTitle('');
            setVideoDescription('');
            onClose();
        }
    };

    const handleCancel = () => {
        setVideoUrl('');
        setVideoTitle('');
        setVideoDescription('');
        onClose();
    };

    return (
        <Modal 
            visible={visible} 
            onClose={handleCancel}
            title="Edit Video"
        >
            <form onSubmit={handleSubmit} className="add-social-modal-form">
                <div className="add-social-modal-content">
                    <label htmlFor="social-link" className="add-social-modal-label">
                        Video Url
                    </label>
                    <input
                        id="social-link"
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/your-video"
                        className="add-social-modal-input"
                        autoFocus
                    />
                </div>
                <div className="add-social-modal-content">
                    <label htmlFor="title-link" className="add-social-modal-label">
                        Title
                    </label>
                    <input
                        id="title-link"
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="My Video"
                        className="add-social-modal-input"
                    />
                </div>
                <div className="add-social-modal-content">
                    <label htmlFor="description-link" className="add-social-modal-label">
                        Description
                    </label>
                    <input
                        id="description-link"
                        type="text"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="This video shows how..."
                        className="add-social-modal-input"
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
                        text = "Save"
                        color = "green"
                        action={handleSubmit}
                        disabled={!videoUrl.trim() && !videoTitle.trim()}
                        className="add-social-modal-cancel-btn"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default EditVideoModal;
