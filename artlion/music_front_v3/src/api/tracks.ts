import { api } from "./client.ts";

export type Track = {
  id: number;
  title: string;
  description: string | null;
  cover_url: string | null;
  genre: string | null;
  tags: string | null;
  ai_provider: string;
  ai_model: string;
  duration_seconds: number | null;
  owner_user_id: number;
  status: string;
  audio_url: string;
  likes_count: number;
  plays_count: number;
  downloads_count?: number;
  created_at: string;
};

export const listTracks = () => api.get<Track[]>("/tracks");
export const getTrack = (id: number) => api.get<Track>(`/tracks/${id}`);
export const createTrack = (formData: FormData, config?: Record<string, any>) =>
  api.post<Track>("/tracks/upload/direct", formData, config);
export const updateTrack = (id: number, payload: Partial<Pick<Track, "title" | "description" | "genre" | "tags">>) =>
  api.patch<Track>(`/tracks/${id}`, payload);
export const deleteTrack = (id: number) => api.delete(`/tracks/${id}`);

export const likeTrack = (id: number) => api.post<{ liked: boolean; likes_count: number }>(`/interactions/tracks/${id}/like`);
export const unlikeTrack = (id: number) =>
  api.delete<{ liked: boolean; likes_count: number }>(`/interactions/tracks/${id}/like`);

export type Comment = {
  id: number;
  track_id: number;
  user_id: number | null;
  body: string;
  created_at: string;
};

export const fetchComments = (trackId: number) => api.get<Comment[]>(`/interactions/tracks/${trackId}/comments`);
export const addComment = (trackId: number, body: string) =>
  api.post<Comment>(`/interactions/tracks/${trackId}/comments`, { track_id: trackId, body });
