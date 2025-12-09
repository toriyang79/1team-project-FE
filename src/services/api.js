import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Video API
export const videoAPI = {
  // Get all videos
  getVideos: async (skip = 0, limit = 20) => {
    try {
      const response = await api.get('/api/videos/', {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  // Get single video
  getVideo: async (videoId) => {
    try {
      const response = await api.get(`/api/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  },

  // Search videos
  searchVideos: async (query, skip = 0, limit = 20) => {
    try {
      const response = await api.get('/api/videos/search', {
        params: { q: query, skip, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  },

  // Upload video
  uploadVideo: async (file, onUploadProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  // Delete video
  deleteVideo: async (videoId) => {
    try {
      const response = await api.delete(`/api/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Update video
  updateVideo: async (videoId, file = null, originalFilename = null, onUploadProgress = null) => {
    try {
      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      }

      if (originalFilename) {
        formData.append('original_filename', originalFilename);
      }

      const response = await api.put(`/api/videos/${videoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  },

  // Get video stream URL
  getStreamUrl: (videoId) => {
    return `${API_BASE_URL}/api/videos/${videoId}/stream`;
  },

  // Get video download URL
  getDownloadUrl: (videoId) => {
    return `${API_BASE_URL}/api/videos/${videoId}/download`;
  },
};

// Like API
export const likeAPI = {
  // Toggle like (좋아요 토글)
  toggleLike: async (videoId) => {
    try {
      const response = await api.post(`/api/videos/${videoId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Get like status (좋아요 상태 조회)
  getLikeStatus: async (videoId) => {
    try {
      const response = await api.get(`/api/videos/${videoId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error fetching like status:', error);
      throw error;
    }
  },
};

// Comment API
export const commentAPI = {
  // Get comments for a video
  getComments: async (videoId, skip = 0, limit = 20) => {
    try {
      const response = await api.get(`/api/videos/${videoId}/comments`, {
        params: { skip, limit },
      });
      return response.data; // { total, comments }
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a new comment
  addComment: async (videoId, content) => {
    try {
      const response = await api.post(`/api/videos/${videoId}/comments`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Update a comment
  updateComment: async (videoId, commentId, content) => {
    try {
      const response = await api.patch(`/api/videos/${videoId}/comments/${commentId}`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (videoId, commentId) => {
    try {
      const response = await api.delete(`/api/videos/${videoId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
};

export default api;
