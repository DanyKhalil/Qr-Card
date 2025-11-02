import React from 'react';
import './YoutubeVideos.css';
import YouTubeCard from '../Youtube Card/YoutubeCard';
import Button from '../../Profile/Button/Button';

const YoutubeVideos = ({ 
    videos = [],
    setter,
    gap = "30px",
    className = "",
    addAction
}) => {
    if (!videos || videos.length === 0) {
        return null;
    }

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
                        id={videoUrl.id}
                        title={videoUrl.title}
                        description={videoUrl.description}
                        url={videoUrl.video_url}
                        setter={setter}
                    />
                </div>
                ))}
            </div>
            <br></br>
            <Button text='Add Video Link' color='green' width='100%' action={addAction}/>
        </div>
    );
};

export default YoutubeVideos;