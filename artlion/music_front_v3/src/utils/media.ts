export const buildMediaUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const envMedia = import.meta.env.VITE_MUSIC_MEDIA_BASE_URL;
  const apiBase = import.meta.env.VITE_MUSIC_API_BASE_URL || '';

  // MEDIA_BASE_URL 우선, 없으면 API_BASE_URL(경로 포함)을 그대로 사용
  const base = (envMedia || apiBase || window.location.origin).toString().replace(/\/$/, '');

  const normalized = path.replace(/^\/+/, '');
  try {
    return new URL(normalized, `${base}/`).toString();
  } catch {
    return `${base}/${encodeURI(normalized)}`;
  }
};

// 내부에서 API_BASE_URL만 쓰는 공통 함수 (중복 제거용)
const getApiBase = () => {
  const apiBase = import.meta.env.VITE_MUSIC_API_BASE_URL || '';
  return apiBase.replace(/\/$/, ''); // 끝에 / 있으면 제거
};


// // 스트림 URL (/tracks/{id}/stream)
// export const buildStreamUrl = (trackId: number) => {
//   const base = import.meta.env.VITE_MUSIC_API_BASE_URL || '';
//   return `${base.replace(/\/$/, '')}/tracks/${trackId}/stream`;
// };


// 스트림 URL (/tracks/{id}/stream)
export const buildStreamUrl = (trackId: number | string) => {
  const base = getApiBase();
  return `${base}/tracks/${trackId}/stream`;
};


// ✅ 새로 추가: 커버 URL (/tracks/{id}/cover)
export const buildCoverUrl = (trackId: number | string) => {
  const base = getApiBase();
  return `${base}/tracks/${trackId}/cover`;
};