import React from 'react';
import YoutubePreview from '../Youtube Preview/YoutubePreview';
import './YoutubeVideos.css';

const YoutubeVideos = ({ 
    userName = "User",
    videos = [],
    gap = "30px",
    className = ""
}) => {
    if (!videos || videos.length === 0) {
        return null;
    }

    return (
        <div className={`user-videos-section ${className}`}>
            <h2 className="user-videos-title">
                Videos of <span className="user-name">{userName}</span>
            </h2>
            
            <div 
                className="videos-column"
                style={{ gap: gap }}
            >
                {videos.map((videoUrl, index) => (
                <div key={index} className="video-item">
                    <YoutubePreview 
                        youtubeUrl={videoUrl}
                        width="100%"
                        height="250px"
                        autoPlay={false}
                    />
                </div>
                ))}
            </div>
        </div>
    );
};

export default YoutubeVideos;