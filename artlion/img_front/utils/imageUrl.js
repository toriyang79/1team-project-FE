export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  // Vite는 import.meta.env 사용
  let base =
    import.meta.env.VITE_IMG_MEDIA_BASE_URL ||
    import.meta.env.VITE_IMG_API_BASE_URL ||
    import.meta.env.REACT_APP_IMG_MEDIA_BASE_URL ||
    import.meta.env.REACT_APP_IMG_API_BASE_URL ||
    "";

  // trailing slash 제거
  base = base.replace(/\/$/, "");

  // 프록시 prefix 제거: /img-api, /api/v1, /api
  base = base.replace(/\/img-api$/, "").replace(/\/api\/v1$/, "").replace(/\/api$/, "");

  // 환경변수가 비어있으면 현재 origin 사용
  if (!base) {
    base = window.location.origin;
  }

  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${base}${normalized}`;
};
