import React, { useState } from 'react';
import "./YotubePreview.css"

const YoutubePreview = ({ 
  youtubeUrl, 
  width = "100%",
  height = "400px",
  className = "",
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from various YouTube URL formats
  const getVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);

  if (!videoId) {
    return <div className="youtube-error">Invalid YouTube URL</div>;
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}${autoPlay ? '?autoplay=1' : ''}`;

  const handleThumbnailClick = () => {
    setIsPlaying(true);
  };

  const handleIframeClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`youtube-preview ${className}`}
      style={{ width, height }}
    >
      {!isPlaying ? (
        <div 
          className="youtube-thumbnail-container"
          onClick={handleThumbnailClick}
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        >
          <div className="youtube-play-button">
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="red"/>
              <path d="M 45,24 27,14 27,34" fill="white"/>
            </svg>
          </div>
          <div className="youtube-overlay"></div>
        </div>
      ) : (
        <div className="youtube-embed-container">
          <iframe
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onClick={handleIframeClick}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default YoutubePreview;