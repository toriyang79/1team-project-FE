import { useEffect, useState } from "react";
import { listTracks, type Track } from "../api/tracks.ts";
import { Link } from "react-router-dom";
import { buildCoverUrl } from "../utils/media";
import { useAuth } from "../../../src/contexts/AuthContext";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "string" && value.includes(":")) return value;
    const secNum = Number(value);
    if (Number.isNaN(secNum) || secNum < 0) return null;
    const m = Math.floor(secNum / 60);
    const s = `${Math.floor(secNum % 60)}`.padStart(2, "0");
    return `${m}:${s}`;
  };

  const getMetaText = (track: Track) => {
    const duration = formatDuration(track.duration_seconds ?? (track as any).duration);
    return track.genre ?? (duration ? `길이 ${duration}` : null);
  };

  useEffect(() => {
    listTracks()
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        if (isAuthenticated && user?.id !== undefined) {
          setTracks(all.filter((t) => t.owner_user_id === user.id));
        } else {
          setTracks([]);
        }
      })
      .catch(() => setError("트랙을 불러오지 못했어요."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.id]);

  return (
    <div className="flex flex-col gap-8 px-2">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-surface-dark/60 to-surface-dark/20" />
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold">{user?.nickname || user?.email || "Guest Artist"}</h2>
            <p className="text-sm text-muted-light">AI로 만들어진 음악을 감상하고, 좋아요를 눌러주세요.</p>
            <div className="flex gap-4 text-sm text-muted-light mt-1">
              <span>팔로워 1.2k</span>
              <span>업로드 {tracks.length}곡</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex min-w-[100px] items-center justify-center rounded-full h-10 px-4 bg-primary text-text-light text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
            팔로우
          </button>
          <button className="flex min-w-[100px] items-center justify-center rounded-full h-10 px-4 bg-surface-light text-text-light text-sm font-bold leading-normal tracking-[0.015em] hover:bg-black/5 transition-colors">
            메시지
          </button>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          <button className="h-10 px-4 rounded-full bg-primary text-text-light text-sm font-bold">Music</button>
          <button className="h-10 px-4 rounded-full bg-surface-light text-text-light text-sm font-medium hover:bg-black/5 transition-colors">
            Images
          </button>
          <button className="h-10 px-4 rounded-full bg-surface-light text-text-light text-sm font-medium hover:bg-black/5 transition-colors">
            Video
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,240px))] justify-center gap-4">
          {loading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-[3/4] rounded-lg bg-surface-light border border-surface-dark/10 animate-pulse"
              />
            ))}
          {!loading &&
            !error &&
            tracks.map((track) => (
              <Link
                key={track.id}
                to={`/music/tracks/${track.id}`}
                className="bg-surface-light rounded-lg overflow-hidden shadow-sm hover:-translate-y-1 transition-transform w-full max-w-[240px]"
              >
                <div className="aspect-[3/4] bg-surface-dark/10">
                  {track.cover_url ? (
                    <img
                      src={buildCoverUrl(track.id)}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface-dark/60 to-surface-dark/20" />
                  )}
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <p className="font-bold line-clamp-1">{track.title}</p>
                  {getMetaText(track) && (
                    <p className="text-xs text-muted-light line-clamp-1">{getMetaText(track)}</p>
                  )}
                  <div className="text-[11px] text-muted-light flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                      {track.likes_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">download</span>
                      {track.plays_count ?? 0}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-light truncate">
                    업로더: {user?.nickname || user?.email || "-"}
                  </p>
                  <p className="text-[11px] text-muted-light truncate">
                    {track.ai_provider} · {track.ai_model}
                  </p>
                </div>
              </Link>
            ))}
          {!loading && error && (
            <div className="col-span-full text-center text-sm text-red-600 bg-red-50 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
