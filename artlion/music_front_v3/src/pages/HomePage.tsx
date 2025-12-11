import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listTracks, type Track } from "../api/tracks.ts";
import { buildCoverUrl } from "../utils/media";
import { usePlayer } from "../context/PlayerContext";

const HomePage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [displayTracks, setDisplayTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { play, unavailable } = usePlayer();

  const formatDuration = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "string" && value.includes(":")) return value;
    const secNum = Number(value);
    if (Number.isNaN(secNum) || secNum < 0) return null;
    const m = Math.floor(secNum / 60);
    const s = `${Math.floor(secNum % 60)}`.padStart(2, "0");
    return `${m}:${s}`;
  };

  const shuffleTracks = (list: Track[]) => {
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    listTracks()
      .then((res) => {
        const data = res.data;
        let list: Track[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && typeof data === 'object') {
          // 혹시 { tracks: [...] } 형태일 수도 있음
          if (Array.isArray((data as any).tracks)) {
            list = (data as any).tracks;
          } else if (Array.isArray((data as any).items)) {
            list = (data as any).items;
          } else if (Array.isArray((data as any).data)) {
            list = (data as any).data;
          }
        }
        setTracks(list);
        setDisplayTracks(list);
      })
      .catch(() => setError("추천 음악을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."))
      .finally(() => setLoading(false));
  }, []);

  // 메모이제이션하여 재생 상태 변경 시 불필요한 리스트 리렌더 방지
  const visibleTracks = useMemo(
    () => displayTracks.filter((t) => !unavailable.has(t.id)),
    [displayTracks, unavailable]
  );

  const getMetaText = (track: Track) => {
    const duration = formatDuration(track.duration_seconds ?? (track as any).duration);
    return track.genre ?? (duration ? `길이 ${duration}` : null);
  };

  const safeTracks = tracks.filter((t) => !unavailable.has(t.id));

  const getTopList = <K extends keyof Track>(key: K, limit = 4) =>
    [...safeTracks].sort((a, b) => Number(b[key] ?? 0) - Number(a[key] ?? 0)).slice(0, limit);

  const topDownloaded = getTopList("downloads_count" as keyof Track);
  const topLiked = getTopList("likes_count");

  const TopCard = ({ track, label }: { track: Track; label: string }) => (
    <article className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 flex gap-3 shadow-sm w-full max-w-[320px]">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-dark/10 flex-shrink-0">
        {track.cover_url ? (
          <img src={buildCoverUrl(track.id)} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-dark/60 to-surface-dark/20" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-xs text-primary font-semibold">{label}</span>
        <Link to={`tracks/${track.id}`} className="font-bold text-sm line-clamp-2 hover:text-primary transition-colors">
          {track.title}
        </Link>
        {getMetaText(track) && <p className="text-xs text-muted-light line-clamp-1">{getMetaText(track)}</p>}
        <div className="text-[11px] text-muted-light flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            {track.likes_count ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">download</span>
            {track.downloads_count ?? 0}
          </span>
        </div>
      </div>
    </article>
  );

  return (
    <div className="@container flex flex-col gap-10">
      <section className="flex flex-col gap-4 text-center items-center px-4">
        <div className="flex flex-col gap-3 max-w-3xl">
          <h2 className="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[864px]:text-6xl">
            AI가 만든 음악을 지금 바로 감상하세요
          </h2>
          <p className="text-base font-normal leading-normal @[480px]:text-lg text-muted-light">
            마음에 드는 트랙을 재생하고, 마음에 들면 좋아요를 눌러주세요. 로그인 없이도 상세 페이지로 이동할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-2xl font-bold leading-tight tracking-[-0.015em]">추천 트랙</h3>
          <button
            type="button"
            onClick={() => setDisplayTracks((prev) => shuffleTracks(prev.length ? prev : tracks))}
            className="flex items-center gap-2 h-10 px-4 rounded-full bg-primary text-background-dark text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            새로고침
          </button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,240px))] justify-center gap-4">
          {loading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-[3/4] rounded-xl bg-surface-light dark:bg-surface-dark/70 animate-pulse"
              />
            ))}
          {!loading &&
            !error &&
            visibleTracks.map((track) => (
              <article
                key={track.id}
                className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:-translate-y-1 transition-transform w-full max-w-[240px]"
              >
                <div className="relative aspect-square rounded-lg bg-surface-dark/10 overflow-hidden">
                  <Link to={`tracks/${track.id}`} className="absolute inset-0 z-0">
                    {track.cover_url ? (
                      <img
                        src={buildCoverUrl(track.id)}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-dark/60 to-surface-dark/20" />
                    )}
                  </Link>
                  <button
                    onClick={() => play(track, visibleTracks)}
                    className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-primary text-text-light flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                    aria-label="재생"
                  >
                    <span className="material-symbols-outlined text-2xl">play_arrow</span>
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <Link to={`tracks/${track.id}`} className="group">
                    <h4 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">{track.title}</h4>
                  </Link>
                  {getMetaText(track) && (
                    <p className="text-sm text-muted-light line-clamp-2">{getMetaText(track)}</p>
                  )}
                  <div className="text-xs text-muted-light flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                      {track.likes_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">download</span>
                      {track.downloads_count ?? 0}
                    </span>
                  </div>
                  <p className="text-xs text-muted-light truncate">
                    {track.ai_provider} · {track.ai_model}
                  </p>
                </div>
              </article>
            ))}
          {!loading && error && (
            <div className="col-span-full text-center text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</div>
          )}
          {!loading && !error && visibleTracks.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-light">재생 가능한 트랙이 없어요.</div>
          )}
        </div>
      </section>

      {(topDownloaded.length || topLiked.length) && (
        <section className="flex flex-col gap-4 px-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold leading-tight tracking-[-0.01em]">지금 인기</h3>
          </div>
          {topDownloaded.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-primary">다운로드 많은 순</div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                {topDownloaded.map((t) => (
                  <TopCard key={`download-${t.id}`} track={t} label="다운로드" />
                ))}
              </div>
            </div>
          )}
          {topLiked.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-primary">좋아요 많은 순</div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                {topLiked.map((t) => (
                  <TopCard key={`like-${t.id}`} track={t} label="좋아요" />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default HomePage;
