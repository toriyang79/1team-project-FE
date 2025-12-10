import React, { useState, useRef } from 'react';
import { videoAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/UploadModal.css';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('지원하지 않는 파일 형식입니다. MP4, MOV, AVI, WEBM 파일만 업로드 가능합니다.');
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_SIZE) {
      setError(`파일 크기가 너무 큽니다. 최대 ${MAX_SIZE / (1024 * 1024)}MB까지 업로드 가능합니다.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await videoAPI.uploadVideo(file, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      // Upload successful
      setUploading(false);
      setUploadProgress(100);

      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(response);
      }

      // Reset and close
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        onClose();
      }, 1000);
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.detail || '업로드 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setFile(null);
    setError(null);
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`upload-modal-overlay ${isDark ? 'dark' : 'light'}`} onClick={handleCancel}>
      <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="upload-modal-header">
          <h2>동영상 업로드</h2>
          <button className="close-button" onClick={handleCancel}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="upload-modal-body">
          {!file ? (
            <div
              className={`upload-dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="material-symbols-outlined upload-icon">cloud_upload</span>
              <p className="upload-text">클릭하거나 파일을 드래그하여 업로드</p>
              <p className="upload-hint">MP4, MOV, AVI, WEBM (최대 100MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/mov,video/avi,video/webm"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="file-selected">
              <div className="file-info">
                <span className="material-symbols-outlined">video_file</span>
                <div className="file-details">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>

              {uploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="progress-text">{uploadProgress}%</p>
                </div>
              )}

              {!uploading && (
                <button className="change-file-button" onClick={() => setFile(null)}>
                  다른 파일 선택
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="upload-error">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="upload-modal-footer">
          <button className="btn-cancel" onClick={handleCancel} disabled={uploading}>
            취소
          </button>
          <button
            className="btn-upload"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? '업로드 중...' : '업로드'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
