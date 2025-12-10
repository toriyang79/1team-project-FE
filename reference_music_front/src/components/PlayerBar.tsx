import { useEffect, useMemo, useState } from "react";
import { likeTrack, unlikeTrack } from "../api/tracks";
import { usePlayer } from "../context/PlayerContext";
import { buildCoverUrl, buildMediaUrl } from "../utils/media";

const formatTime = (sec: number) => {
  if (!sec || Number.isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const PlayerBar = () => {
  const { current, isPlaying, toggle, next, prev, position, duration, seek, volume, setVolume } = usePlayer();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!current) return;
    setLiked(false);
    setLikes(current.likes_count ?? 0);
    setMenuOpen(false);
  }, [current]);

  const coverSrc = useMemo(() => {
    if (!current || !current.cover_url) return null;
    return buildCoverUrl(current.id);
  }, [current]);

  const downloadUrl = useMemo(() => (current ? buildMediaUrl(`/tracks/${current.id}/stream`) : ""), [current]);
  const shareUrl = useMemo(() => (current ? `${window.location.origin}/tracks/${current.id}` : ""), [current]);

  if (!current) return null;

  const handleLike = async () => {
    if (!current) return;
    try {
      if (liked) {
        const res = await unlikeTrack(current.id);
        setLiked(res.data.liked ?? false);
        setLikes(res.data.likes_count ?? Math.max(0, likes - 1));
      } else {
        const res = await likeTrack(current.id);
        setLiked(res.data.liked ?? true);
        setLikes(res.data.likes_count ?? likes + 1);
      }
    } catch (err) {
      console.error("like error", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setMenuOpen(false);
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: current.title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("공유 링크를 복사했습니다.");
      }
    } catch {
      alert("공유에 실패했습니다.");
    } finally {
      setMenuOpen(false);
    }
  };

    const handleDownload = async () => {
    if (!current || !downloadUrl) {
      alert("다운로드할 파일이 없습니다.");
      return;
    }
    try {
      const res = await fetch(downloadUrl, { credentials: "include" });
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName = (current.title || "track").replace(/[\\/:*?\"<>|]+/g, "_");
      link.href = url;
      link.download = `${safeName}.mp3`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("download error", err);
      alert("다운로드 중 오류가 발생했습니다.");
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-surface-dark/10 shadow-lg px-3 py-3 md:px-6">
      <div className="flex flex-col gap-3 relative max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-3 md:flex-row md:flex-nowrap md:items-center md:gap-6 md:justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-surface-dark/10 flex-shrink-0">
              {coverSrc ? (
                <img src={coverSrc} alt={current.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-dark/60 to-surface-dark/20" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{current.title}</p>
              <p className="text-xs text-muted-light truncate">
                {current.ai_provider} · {current.ai_model}
              </p>
            </div>
          </div>

          <div className="order-3 md:order-2 w-full md:flex-1 flex justify-center">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full bg-surface-dark/5 flex items-center justify-center hover:bg-surface-dark/10 transition-colors"
                aria-label="이전 곡"
              >
                <span className="material-symbols-outlined">skip_previous</span>
              </button>
              <button
                onClick={toggle}
                className="w-10 h-10 rounded-full bg-primary text-text-light flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label={isPlaying ? "일시정지" : "재생"}
              >
                <span className="material-symbols-outlined text-xl">{isPlaying ? "pause" : "play_arrow"}</span>
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full bg-surface-dark/5 flex items-center justify-center hover:bg-surface-dark/10 transition-colors"
                aria-label="다음 곡"
              >
                <span className="material-symbols-outlined">skip_next</span>
              </button>
            </div>
          </div>

          <div className="order-2 md:order-3 flex items-center gap-3 flex-wrap md:flex-nowrap flex-shrink-0 md:ml-6 md:justify-end">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="material-symbols-outlined text-base text-muted-light">volume_up</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(ev) => setVolume(Number(ev.target.value))}
                className="w-20 sm:w-28 accent-primary"
                aria-label="볼륨 조절"
              />
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleLike}
                className="h-9 px-3 rounded-full border border-surface-dark/15 flex items-center gap-1 hover:bg-surface-dark/5"
              >
                <span
                  className={`material-symbols-outlined text-sm ${liked ? "text-primary" : "text-current"}`}
                  style={liked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {liked ? "favorite" : "favorite_border"}
                </span>
                <span className="text-sm">{likes}</span>
              </button>
              <button
                onClick={handleShare}
                className="h-9 px-3 rounded-full border border-surface-dark/15 flex items-center gap-1 hover:bg-surface-dark/5"
              >
                <span className="material-symbols-outlined text-sm">ios_share</span>
                <span className="text-sm">공유</span>
              </button>
              <button
                onClick={handleDownload}
                className="h-9 px-3 rounded-full border border-surface-dark/15 flex items-center gap-1 hover:bg-surface-dark/5"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span className="text-sm">다운로드</span>
              </button>
            </div>

            <div className="relative block md:hidden ml-auto">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="h-9 w-9 rounded-full border border-surface-dark/15 flex items-center justify-center hover:bg-surface-dark/5"
                aria-label="추가 메뉴"
              >
                <span className="material-symbols-outlined">more_vert</span>
              </button>
              {menuOpen && (
                <div className="absolute bottom-11 right-0 bg-white shadow-lg border border-surface-dark/10 rounded-xl p-2 min-w-[160px] z-20 space-y-1">
                  <button
                    onClick={handleLike}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface-dark/5 text-left"
                  >
                    <span
                      className={`material-symbols-outlined text-sm ${liked ? "text-primary" : "text-current"}`}
                      style={liked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {liked ? "favorite" : "favorite_border"}
                    </span>
                    <span className="text-sm">좋아요 ({likes})</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface-dark/5 text-left"
                  >
                    <span className="material-symbols-outlined text-sm">ios_share</span>
                    <span className="text-sm">공유</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface-dark/5 text-left"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span className="text-sm">다운로드</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-light w-10 text-right">{formatTime(position)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={position}
            onChange={(ev) => seek(Number(ev.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="text-[11px] text-muted-light w-10">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
