import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/DeleteConfirmModal.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, videoName, isDeleting }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className={`delete-modal-overlay ${isDark ? 'dark' : 'light'}`} onClick={onClose}>
      <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <span className="material-symbols-outlined delete-icon">warning</span>
          <h2>동영상 삭제</h2>
        </div>

        <div className="delete-modal-body">
          <p>정말로 이 동영상을 삭제하시겠습니까?</p>
          {videoName && <p className="video-name-display">"{videoName}"</p>}
          <p className="warning-text">이 작업은 되돌릴 수 없습니다.</p>
        </div>

        <div className="delete-modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={isDeleting}>
            취소
          </button>
          <button className="btn-delete" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
