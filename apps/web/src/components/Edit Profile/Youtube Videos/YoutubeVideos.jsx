import React from 'react';
import './YoutubeVideos.css';
import YouTubeCard from '../Youtube Card/YoutubeCard';

const YoutubeVideos = ({ 
    videos = [],
    gap = "30px",
    className = ""
}) => {
    if (!videos || videos.length === 0) {
        return null;
    }
    console.log(videos)

    return (
        <div className={`user-videos-section ${className}`}>
            <h2 className="section-title">
                Videos
            </h2>
            
            <div 
                className="videos-column"
                style={{ gap: gap }}
            >
                {videos.map((videoUrl, index) => (
                <div key={index} className="video-item">
                    <YouTubeCard 
                        title={videoUrl.title}
                        description={videoUrl.description}
                        url={videoUrl.video_url}
                    />
                </div>
                ))}
            </div>
        </div>
    );
};

export default YoutubeVideos;