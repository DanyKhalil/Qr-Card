import React from 'react';
import './YoutubeVideos.css';
import YouTubeCard from '../Youtube Card/YoutubeCard';
import Button from '../../Profile/Button/Button';

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
            <br></br>
            <Button text='Add Video Link' color='green' width='100%' />
        </div>
    );
};

export default YoutubeVideos;