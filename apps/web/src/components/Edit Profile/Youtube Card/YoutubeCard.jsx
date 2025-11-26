import React from 'react';
import './YouTubeCard.css';
import Button from '../../Profile/Button/Button';
import { IoPencil, IoTrash } from 'react-icons/io5';

const YouTubeCard = ({ 
    id,
    title = "",
    description = "",
    url = "",
    setter, 
    className = "",
    updateAction,
    objectSetter,
}) => {
    const videoObject={id:id, title:title, description:description, video_url:url};
    const handleDeleteVideo = (e) => {
        e.stopPropagation();
        let confirmation = window.confirm("Are you sure you want to remove this video?")
        if (confirmation)
            setter((oldVideos) => oldVideos.filter((video) => video.id != id))

    }
    return (
        <div className={`youtube-card ${className}`}>
            <div className="youtube-card__content">
                <div className="youtube-card__field">
                    <label className="youtube-card__label">Title:</label>
                    <div className="youtube-card__text-field">
                        {title}
                    </div>
                </div>

                <div className="youtube-card__field">
                    <label className="youtube-card__label">Description:</label>
                    <div className="youtube-card__text-field">
                        {description}
                    </div>
                </div>

                <div className="youtube-card__field">
                    <label className="youtube-card__label">URL:</label>
                    <div className="youtube-card__text-field">
                        {url}
                    </div>
                </div>

                <div className="youtube-card__buttons">
                    <Button text="Edit" color="green" action={()=>{updateAction(); objectSetter(videoObject)}} width="120px" icon={<IoPencil size={18}/>}/>
                    <Button text="Remove" color="coral" action={handleDeleteVideo} width="120px" icon={<IoTrash size={18}/>} />
                </div>
            </div>
        </div>
    );
};

export default YouTubeCard;