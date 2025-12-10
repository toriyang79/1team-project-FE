import React from 'react';
import '../styles/VideoDetailModal.css';
import VideoPlayer from './VideoPlayer';
import CommentSection from './CommentSection';

const VideoDetailModal = ({ video, onClose }) => {
  if (!video) {
    return null;
  }

  // Stop event propagation to prevent closing modal when clicking inside
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="modal-video-player-container">
          <VideoPlayer video={video} autoPlay={true} />
        </div>
        <div className="modal-comment-section-container">
          <CommentSection videoId={video.id} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetailModal;
