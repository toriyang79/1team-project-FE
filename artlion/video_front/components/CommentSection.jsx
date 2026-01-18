import React, { useState, useEffect, useCallback } from 'react';
import '../styles/CommentSection.css';
import { commentAPI } from '../services/api';

const Comment = ({ comment, onCommentDeleted, onCommentUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await commentAPI.deleteComment(comment.video_id, comment.id);
        onCommentDeleted(comment.id);
        alert('댓글이 삭제되었습니다.');
      } catch (error) {
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editedContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    try {
      const updatedComment = await commentAPI.updateComment(
        comment.video_id,
        comment.id,
        editedContent
      );
      onCommentUpdated(updatedComment);
      setIsEditing(false);
    } catch (error) {
      alert('댓글 수정에 실패했습니다.');
    }
  };

  return (
    <div className="comment">
      <div className="comment-author-avatar"></div>
      <div className="comment-body">
        <div>
          <span className="comment-author">{comment.user_identifier}</span>
          <span className="comment-timestamp">{new Date(comment.created_at).toLocaleString()}</span>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <textarea
              className="edit-comment-input"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="comment-form-actions">
              <button type="button" className="edit-cancel-button" onClick={() => setIsEditing(false)}>취소</button>
              <button type="submit" className="edit-submit-button">저장</button>
            </div>
          </form>
        ) : (
          <>
            <p className="comment-text">{comment.content}</p>
            <div className="comment-actions">
              {/* This should be conditional based on the logged-in user */}
              <button className="comment-action-button" onClick={() => setIsEditing(true)}>수정</button>
              <button className="comment-action-button" onClick={handleDelete}>삭제</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ skip: 0, limit: 20 });

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await commentAPI.getComments(videoId, pagination.skip, pagination.limit);
      // 중복 키 방지: 이미 존재하는 id는 제외하고 병합
      setComments(prev => {
        const existingIds = new Set(prev.map((c) => c.id));
        const next = data.comments.filter((c) => !existingIds.has(c.id));
        return [...prev, ...next];
      });
      setTotalComments(data.total);
      setError(null);
    } catch (err) {
      setError('댓글을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [videoId, pagination]);

  useEffect(() => {
    setComments([]);
    setPagination({ skip: 0, limit: 20 });
    fetchComments();
  }, [videoId]); // fetchComments is not included to avoid re-fetching on pagination change

  useEffect(() => {
    // This effect runs when pagination state changes
    if (pagination.skip > 0) {
        fetchComments();
    }
  }, [pagination, fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const addedComment = await commentAPI.addComment(videoId, newComment);
      setComments(prevComments => [addedComment, ...prevComments]);
      setTotalComments(prev => prev + 1);
      setNewComment('');
    } catch (error) {
      alert('댓글 작성에 실패했습니다.');
    }
  };
  
  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    setTotalComments(prev => prev - 1);
  };
  
  const handleCommentUpdated = (updatedComment) => {
    setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c));
  };

  const loadMore = () => {
    setPagination(prev => ({ ...prev, skip: prev.skip + prev.limit }));
  };

  return (
    <div className="comment-section">
      <h3 className="comment-header">댓글 ({totalComments})</h3>
      
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <textarea
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글 추가..."
          rows="3"
        />
        <div className="comment-form-actions">
          <button type="submit" className="comment-submit-button">등록</button>
        </div>
      </form>

      <div className="comment-list">
        {error && <p>{error}</p>}
        {comments.map((comment) => (
          <Comment 
            key={comment.id} 
            comment={comment}
            onCommentDeleted={handleCommentDeleted}
            onCommentUpdated={handleCommentUpdated}
          />
        ))}
        {loading && <p>Loading...</p>}
        {!loading && comments.length < totalComments && (
          <button onClick={loadMore}>더 보기</button>
        )}
        {totalComments === 0 && !loading && <p>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>}
      </div>
    </div>
  );
};

export default CommentSection;
