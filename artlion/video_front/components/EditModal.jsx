import React, { useState, useRef } from 'react';
import { videoAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/EditModal.css';

const EditModal = ({ isOpen, onClose, video, onEditSuccess }) => {
  const { isDark } = useTheme();
  const [newFilename, setNewFilename] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen && video) {
      // Remove file extension from original filename
      const nameWithoutExt = video.original_filename.replace(/\.[^/.]+$/, '');
      setNewFilename(nameWithoutExt);
      setNewFile(null);
      setError(null);
      setUploadProgress(0);
    }
  }, [isOpen, video]);

  const handleFileSelect = (selectedFile) => {
    setError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('지원하지 않는 파일 형식입니다. MP4, MOV, AVI, WEBM 파일만 가능합니다.');
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_SIZE) {
      setError(`파일 크기가 너무 큽니다. 최대 ${MAX_SIZE / (1024 * 1024)}MB까지 가능합니다.`);
      return;
    }

    setNewFile(selectedFile);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!video) return;

    // Check if anything changed
    const nameWithoutExt = video.original_filename.replace(/\.[^/.]+$/, '');
    const filenameChanged = newFilename.trim() && newFilename.trim() !== nameWithoutExt;
    const fileChanged = newFile !== null;

    if (!filenameChanged && !fileChanged) {
      setError('변경 사항이 없습니다.');
      return;
    }

    setEditing(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Get file extension from original or new file
      const fileExt = newFile
        ? '.' + newFile.name.split('.').pop()
        : video.original_filename.match(/\.[^/.]+$/)?.[0] || '';

      const finalFilename = filenameChanged
        ? newFilename.trim() + fileExt
        : null;

      const response = await videoAPI.updateVideo(
        video.id,
        newFile,
        finalFilename,
        (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      );

      // Success
      setEditing(false);
      setUploadProgress(100);

      if (onEditSuccess) {
        onEditSuccess(response);
      }

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      setEditing(false);
      setError(err.response?.data?.detail || '수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setNewFile(null);
    setError(null);
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen || !video) return null;

  const nameWithoutExt = video.original_filename.replace(/\.[^/.]+$/, '');

  return (
    <div className={`edit-modal-overlay ${isDark ? 'dark' : 'light'}`} onClick={handleCancel}>
      <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <h2>동영상 수정</h2>
          <button className="close-button" onClick={handleCancel}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="edit-modal-body">
          {/* Filename Edit */}
          <div className="edit-section">
            <label className="edit-label">파일명</label>
            <div className="filename-input-container">
              <input
                type="text"
                className="filename-input"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                placeholder="파일명 입력"
                disabled={editing}
              />
              <span className="file-extension">
                {newFile
                  ? '.' + newFile.name.split('.').pop()
                  : video.original_filename.match(/\.[^/.]+$/)?.[0] || ''}
              </span>
            </div>
          </div>

          {/* File Replace */}
          <div className="edit-section">
            <label className="edit-label">파일 교체 (선택)</label>
            <div className="file-replace-container">
              {newFile ? (
                <div className="selected-file-info">
                  <span className="material-symbols-outlined">video_file</span>
                  <div className="file-details">
                    <p className="file-name">{newFile.name}</p>
                    <p className="file-size">{(newFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button
                    className="remove-file-btn"
                    onClick={() => setNewFile(null)}
                    disabled={editing}
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              ) : (
                <button
                  className="select-file-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={editing}
                >
                  <span className="material-symbols-outlined">upload_file</span>
                  <span>파일 선택</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/mov,video/avi,video/webm"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Progress Bar */}
          {editing && (
            <div className="edit-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <p className="progress-text">{uploadProgress}%</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="edit-error">
              <span className="material-symbols-outlined">error</span>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="edit-modal-footer">
          <button className="btn-cancel" onClick={handleCancel} disabled={editing}>
            취소
          </button>
          <button className="btn-save" onClick={handleSave} disabled={editing}>
            {editing ? '수정 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
