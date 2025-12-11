import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Track, Comment } from "../api/tracks";
import { addComment, deleteTrack, fetchComments, getTrack, likeTrack, listTracks, unlikeTrack, updateTrack } from "../api/tracks";
import { buildCoverUrl, buildStreamUrl } from "../utils/media";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../../../src/contexts/AuthContext";

const TrackDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { play, prev, next, unavailable } = usePlayer();
  const { user, isAuthenticated } = useAuth();

  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similar, setSimilar] = useState<Track[]>([]);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [coverError, setCoverError] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const trackId = Number(id);
  const isOwner = isAuthenticated && track?.owner_user_id !== undefined && user?.id === track.owner_user_id;

  const getUploaderName = (t: Track) => {
    if (t.owner_user_id && isAuthenticated && user?.id === t.owner_user_id) {
      return user?.nickname || user?.email || `ID ${t.owner_user_id}`;
    }
    return (t as any).owner_nickname || (t as any).owner_name || (t.owner_user_id ? `ID ${t.owner_user_id}` : "-");
  };

  const formatDuration = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "string" && value.includes(":")) return value;
    const secNum = Number(value);
    if (Number.isNaN(secNum) || secNum < 0) return null;
    const m = Math.floor(secNum / 60);
    const s = `${Math.floor(secNum % 60)}`.padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (!id || Number.isNaN(trackId)) {
      setError("잘못된 트랙 ID 입니다.");
      setLoading(false);
      return;
    }

    getTrack(trackId)
      .then((res) => {
        setTrack(res.data);
        setLikesCount(res.data.likes_count);
        setEditTitle(res.data.title);
        setEditGenre(res.data.genre ?? "");
        setEditTags(res.data.tags ?? "");
        setEditDesc(res.data.description ?? "");
      })
      .catch(() => setError("트랙을 불러오지 못했습니다."))
      .finally(() => setLoading(false));

    listTracks()
      .then((res) => {
        const others = res.data.filter((item: Track) => item.id !== trackId);
        setSimilar(others.slice(0, 5));
      })
      .catch(() => undefined);

    fetchComments(trackId)
      .then((res) => setComments(res.data))
      .catch(() => undefined);
  }, [id, trackId]);

  useEffect(() => {
    setCoverError(false);
  }, [track?.id]);

  const coverUrl = useMemo(() => {
    if (!track || !track.cover_url) return null;
    return buildCoverUrl(track.id);
  }, [track]);

  const audioUrl = useMemo(() => {
    if (!track) return "";
    return buildStreamUrl(track.id);
  }, [track]);

  const uploadedAt = useMemo(() => {
    if (!track) return "";
    return new Date(track.created_at).toLocaleDateString();
  }, [track]);

  const durationText = useMemo(() => {
    if (!track) return null;
    const totalSeconds = track.duration_seconds ?? (track as any).duration;
    return formatDuration(totalSeconds);
  }, [track]);

  const handlePlay = () => {
    if (!track) return;
    play(track, [track, ...similar]);
  };

  const handleLike = async () => {
    if (!track) return;
    try {
      if (liked) {
        const res = await unlikeTrack(track.id);
        setLiked(false);
        setLikesCount(res.data.likes_count ?? Math.max(0, likesCount - 1));
      } else {
        const res = await likeTrack(track.id);
        setLiked(true);
        setLikesCount(res.data.likes_count ?? likesCount + 1);
      }
    } catch (err) {
      console.error("like error", err);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: track?.title ?? "Artlion", url: shareUrl });
        return;
      } catch (err) {
        console.error("share error", err);
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("링크를 클립보드에 복사했어요.");
    } catch {
      alert(shareUrl);
    }
  };

  const handleComment = async () => {
    if (!track || !commentBody.trim()) return;
    try {
      const res = await addComment(track.id, commentBody.trim());
      setComments((prev) => [res.data, ...prev]);
      setCommentBody("");
    } catch (err) {
      console.error("comment error", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleUpdate = async () => {
    if (!track) return;
    setSaving(true);
    try {
      const res = await updateTrack(track.id, {
        title: editTitle,
        genre: editGenre || null,
        tags: editTags || null,
        description: editDesc || null,
      });
      setTrack(res.data);
      setEditing(false);
    } catch (err) {
      console.error("update error", err);
      alert("수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!track) return;
    if (!confirm("이 트랙을 삭제할까요?")) return;
    try {
      await deleteTrack(track.id);
      navigate("/music/profile");
    } catch (err) {
      console.error("delete error", err);
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-2">
        <div className="h-10 w-32 bg-surface-light rounded-lg animate-pulse" />
        <div className="h-64 w-full bg-surface-light rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !track) {
    return <div className="px-2 text-red-600 bg-red-50 rounded-lg p-4 text-sm">{error ?? "트랙을 찾을 수 없습니다."}</div>;
  }

  return (
    <div className="flex flex-col gap-12 px-2 pb-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <section className="flex-1 bg-surface-light p-6 rounded-xl shadow-sm flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 md:h-64 aspect-square rounded-lg bg-surface-dark/10 overflow-hidden">
              {!coverError && coverUrl ? (
                <img src={coverUrl} alt={track.title} className="w-full h-full object-cover" onError={() => setCoverError(true)} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-dark/60 to-surface-dark/20" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold leading-tight">{track.title}</h1>
                <p className="text-muted-light text-sm mt-1">
                  {track.ai_provider} · {track.ai_model}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-light">
                {track.genre && <span className="px-3 py-1 rounded-full bg-surface-dark/10">{track.genre}</span>}
                {track.tags && <span className="px-3 py-1 rounded-full bg-surface-dark/10">{track.tags}</span>}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  className="w-14 h-14 flex items-center justify-center bg-primary rounded-full text-text-light hover:opacity-90 transition-opacity"
                  onClick={handlePlay}
                  aria-label="재생"
                  disabled={unavailable.has(track.id)}
                >
                  <span className="material-symbols-outlined text-5xl -mr-1">play_arrow</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="w-11 h-11 rounded-full bg-surface-dark/10 dark:bg-gray-800 dark:text-gray-100 flex items-center justify-center hover:bg-black/5 dark:hover:bg-gray-700"
                    aria-label="이전"
                  >
                    <span className="material-symbols-outlined">skip_previous</span>
                  </button>
                  <button
                    onClick={next}
                    className="w-11 h-11 rounded-full bg-surface-dark/10 dark:bg-gray-800 dark:text-gray-100 flex items-center justify-center hover:bg-black/5 dark:hover:bg-gray-700"
                    aria-label="다음"
                  >
                    <span className="material-symbols-outlined">skip_next</span>
                  </button>
                </div>
                <div className="flex flex-col text-sm text-muted-light">
                  <span>좋아요 {likesCount}</span>
                  <span>재생 {track.plays_count}</span>
                  <span>다운로드 {track.downloads_count ?? 0}</span>
                  <span>업로더 {getUploaderName(track)}</span>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap text-sm">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 h-10 rounded-full bg-surface-dark/10 hover:bg-black/5 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700 transition-colors ${
                    liked ? "text-primary" : ""
                  }`}
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span>좋아요</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 h-10 rounded-full bg-surface-dark/10 hover:bg-black/5 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">share</span>
                  <span>공유</span>
                </button>
                {isOwner && (
                  <>
                    <button
                      onClick={() => setEditing((v) => !v)}
                      className="flex items-center gap-2 px-4 h-10 rounded-full bg-surface-dark/10 hover:bg-black/5 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">edit</span>
                      <span>수정</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                      <span>삭제</span>
                    </button>
                  </>
                )}
              </div>
              {editing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-dark/5 p-4 rounded-lg">
                  <input
                    className="w-full rounded-lg bg-white border border-surface-dark/20 px-3 py-2 text-sm"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="제목"
                  />
                  <input
                    className="w-full rounded-lg bg-white border border-surface-dark/20 px-3 py-2 text-sm"
                    value={editGenre}
                    onChange={(e) => setEditGenre(e.target.value)}
                    placeholder="장르"
                  />
                  <input
                    className="w-full rounded-lg bg-white border border-surface-dark/20 px-3 py-2 text-sm"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="태그"
                  />
                  <textarea
                    className="w-full rounded-lg bg-white border border-surface-dark/20 px-3 py-2 text-sm sm:col-span-2"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="설명"
                  />
                  <div className="flex gap-2 sm:col-span-2">
                    <button onClick={handleUpdate} disabled={saving} className="px-4 h-10 rounded-full bg-primary text-white text-sm font-bold disabled:opacity-60">
                      {saving ? "저장 중..." : "저장"}
                    </button>
                    <button onClick={() => setEditing(false)} className="px-4 h-10 rounded-full bg-surface-dark/10 text-sm">
                      취소
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-1 space-y-2">
                <audio controls className="w-full rounded-lg" src={audioUrl} />
                <div className="flex justify-between text-xs text-muted-light">
                  <span>00:00</span>
                  <span>{durationText ?? ""}</span>
                </div>
              </div>
              <p className="text-sm text-muted-light whitespace-pre-line">{track.description ?? "설명 없음"}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-light">
                <span>업로드: {uploadedAt}</span>
                {track.owner_user_id && <span>작성자 ID: {track.owner_user_id}</span>}
              </div>
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">비슷한 트랙</h3>
          </div>
          <div className="flex flex-col gap-3">
            {similar.length === 0 && <p className="text-sm text-muted-light">추천할 트랙이 없습니다.</p>}
            {similar.map((item) => (
              <Link
                key={item.id}
                to={`/tracks/${item.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-light shadow-sm hover:-translate-y-0.5 transition-transform"
              >
                <div className="w-16 h-16 rounded-md overflow-hidden bg-surface-dark/10">
                  {item.cover_url ? (
                    <img src={buildCoverUrl(item.id)} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface-dark/60 to-surface-dark/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{item.title}</p>
                  {(() => {
                    const duration = formatDuration(item.duration_seconds ?? (item as any).duration);
                    const meta = item.genre ?? (duration ? `길이 ${duration}` : null);
                    return meta ? <p className="text-xs text-muted-light truncate">{meta}</p> : null;
                  })()}
                  <div className="text-[11px] text-muted-light flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                      {item.likes_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">download</span>
                      {item.downloads_count ?? 0}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-light truncate">업로더: {getUploaderName(item)}</p>
                  <p className="text-[11px] text-muted-light truncate">
                    {item.ai_provider} · {item.ai_model}
                  </p>
                </div>
                <button
                  onClick={(ev) => {
                    ev.preventDefault();
                    play(item, [item, ...similar.filter((s) => s.id !== item.id)]);
                  }}
                  className="w-9 h-9 rounded-full bg-primary text-text-light flex items-center justify-center hover:opacity-90"
                  aria-label="재생"
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                </button>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <section className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">댓글</h3>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-dark/10" />
          <div className="flex-1 space-y-2">
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              className="form-textarea w-full min-h-24 resize-none rounded-lg text-text-light focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-surface-light placeholder:text-muted-light text-base font-normal px-4 py-3"
              placeholder="댓글을 입력해주세요"
            />
            <div className="flex justify-end">
              <button onClick={handleComment} className="px-4 h-10 rounded-full bg-primary text-white text-sm font-bold hover:opacity-90">
                등록
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {comments.length === 0 && <p className="text-sm text-muted-light">아직 댓글이 없습니다.</p>}
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-dark/10" />
              <div className="flex-1">
                <p className="font-bold text-sm">
                  User {comment.user_id ?? "unknown"} <span className="text-muted-light font-normal ml-2">{new Date(comment.created_at).toLocaleString()}</span>
                </p>
                <p className="text-sm whitespace-pre-line">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrackDetailPage;
