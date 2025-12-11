import axios from "axios";

// 로컬(dev)에서는 프록시 경로(/video-api)로 강제해 CORS 회피, 배포 시에는 환경 변수 사용
const isLocalhost = typeof window !== "undefined" && window.location.origin.includes("localhost");
const envVideoBase = (import.meta.env.VITE_VIDEO_API_URL || "").trim();
const API_VIDEO_BASE_URL = envVideoBase || (isLocalhost ? "/video-api" : "https://shorts-artlion.duckdns.org/api");

const api = axios.create({
  baseURL: API_VIDEO_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Video API
export const videoAPI = {
  // Get all videos
  getVideos: async (skip = 0, limit = 20) => {
    const response = await api.get("/videos/", { params: { skip, limit } });
    return response.data;
  },

  // Get single video
  getVideo: async (videoId) => {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  },

  // Search videos
  searchVideos: async (query, skip = 0, limit = 20) => {
    const response = await api.get("/videos/search", { params: { q: query, skip, limit } });
    return response.data;
  },

  // Upload video
  uploadVideo: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return response.data;
  },

  // Delete video
  deleteVideo: async (videoId) => {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  },

  // Update video
  updateVideo: async (videoId, file = null, originalFilename = null, onUploadProgress = null) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (originalFilename) formData.append("original_filename", originalFilename);

    const response = await api.put(`/videos/${videoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return response.data;
  },

  // Get video stream URL
  getStreamUrl: (videoId) => `${API_VIDEO_BASE_URL}/videos/${videoId}/stream`,

  // Get video download URL
  getDownloadUrl: (videoId) => `${API_VIDEO_BASE_URL}/videos/${videoId}/download`,
};

// Like API
export const likeAPI = {
  // Toggle like
  toggleLike: async (videoId) => {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data;
  },

  // Get like status
  getLikeStatus: async (videoId) => {
    const response = await api.get(`/videos/${videoId}/like`);
    return response.data;
  },
};

// Comment API
export const commentAPI = {
  // Get comments for a video
  getComments: async (videoId, skip = 0, limit = 20) => {
    const response = await api.get(`/videos/${videoId}/comments`, { params: { skip, limit } });
    return response.data; // { total, comments }
  },

  // Add a new comment
  addComment: async (videoId, content) => {
    const response = await api.post(`/videos/${videoId}/comments`, { content });
    return response.data;
  },

  // Update a comment
  updateComment: async (videoId, commentId, content) => {
    const response = await api.patch(`/videos/${videoId}/comments/${commentId}`, { content });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (videoId, commentId) => {
    const response = await api.delete(`/videos/${videoId}/comments/${commentId}`);
    return response.data;
  },
};

export default api;
