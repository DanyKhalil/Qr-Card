import React from 'react';
import './YouTubeCard.css';
import Button from '../../Profile/Button/Button';

const YouTubeCard = ({ 
    title = "",
    description = "",
    url = "", 
    className = "" 
}) => {
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
                    <Button text="Edit" color="green" action={()=>alert("edit")} width="100px"/>
                    <Button text="Remove" color="coral" action={()=>alert("remove")} width="100px"/>
                </div>
            </div>
        </div>
    );
};

export default YouTubeCard;