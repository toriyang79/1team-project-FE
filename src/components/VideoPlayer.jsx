import React, { useRef, useState, useEffect } from 'react';
import { videoAPI, likeAPI } from '../services/api';
import '../styles/VideoPlayer.css';

const VideoPlayer = ({ video, onDelete, onEdit, onSelect, autoPlay = false }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Track current volume (1 = 100%)
  const [isMuted, setIsMuted] = useState(false); // Track mute state
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    if (video) {
      fetchLikeStatus();
    }
  }, [video?.id]);
  
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.volume = 0.5; // Set volume to 50%
      videoRef.current.muted = false; // Ensure it's not muted
      setVolume(0.5); // Update React state
      setIsMuted(false); // Update React state

      videoRef.current.play().catch(error => {
        console.warn("Autoplay was prevented.", error);
      });
    }
  }, [autoPlay]);

  const fetchLikeStatus = async () => {
    try {
      const data = await likeAPI.getLikeStatus(video.id);
      setLikeCount(data.like_count);
      setIsLiked(data.is_liked);
    } catch (error) {
      console.error('Failed to fetch like status:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const data = await likeAPI.toggleLike(video.id);
      setLikeCount(data.like_count);
      setIsLiked(data.is_liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  if (!video) {
    return null;
  }

  const streamUrl = videoAPI.getStreamUrl(video.id);

  const handleOpenLightbox = () => {
    onSelect?.(video);
  };

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="video-element"
          src={streamUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
          playsInline
          // Removed `muted={isMuted}` from here, as it's handled by setting volume directly
          onVolumeChange={(e) => {
            setIsMuted(e.target.muted);
            setVolume(e.target.volume);
          }}
        />
        
        {/* Render a click interceptor only in the main grid view (not in autoplay/modal mode) */}
        {!autoPlay && (
          <div className="click-interceptor" onClick={handleOpenLightbox}></div>
        )}
      </div>

      <div className="video-info">
        <h3 className="video-title" title={video.original_filename}>
          {video.original_filename}
        </h3>
        <div className="video-meta">
          <span className="video-size">
            {(video.file_size / (1024 * 1024)).toFixed(2)} MB
          </span>
          <span className="video-date">
            {new Date(video.uploaded_at).toLocaleDateString()}
          </span>
          <div className="video-actions">
            <button
              className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLikeToggle}
              disabled={isLikeLoading}
              title={isLiked ? '좋아요 취소' : '좋아요'}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
                favorite
              </span>
              {likeCount > 0 && <span className="like-count">{likeCount}</span>}
            </button>
            <button className="action-btn comment-btn" onClick={handleOpenLightbox} title="댓글">
              <span className="material-symbols-outlined">comment</span>
            </button>
            <button className="action-btn edit-btn" onClick={() => onEdit?.(video)} title="수정">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className="action-btn delete-btn" onClick={() => onDelete?.(video)} title="삭제">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
