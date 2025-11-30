import React from 'react';
import './YoutubeVideos.css';
import YouTubeCard from '../Youtube Card/YoutubeCard';
import Button from '../../Profile/Button/Button';
import { IoPencil, IoTrash, IoAnalytics, IoSave, IoClose, IoAdd } from "react-icons/io5";

const YoutubeVideos = ({ 
    videos = [],
    setter,
    gap = "30px",
    className = "",
    addAction,
    updateAction,
    objectSetter
}) => {
    // if (!videos || videos.length === 0) {
    //     return null;
    // }

    return (
        <div className={`user-videos-section ${className}`}>
            <h2 className="title-section-title">
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
                        updateAction={updateAction}
                        objectSetter={objectSetter}
                    />
                </div>
                ))}
            </div>
            <br></br>
            <Button text='Add Video Link' color='green' width='100%' action={addAction} icon={<IoAdd size={18} />}/>
        </div>
    );
};

export default YoutubeVideos;