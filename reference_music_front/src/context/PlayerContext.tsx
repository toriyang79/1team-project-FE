import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Track } from '../api/tracks';
import { buildStreamUrl } from '../utils/media';

type PlayerState = {
  current: Track | null;
  isPlaying: boolean;
  queue: Track[];
  index: number;
  unavailable: Set<number>;
  volume: number;
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  position: number;
  duration: number;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unavailable, setUnavailable] = useState<Set<number>>(new Set());
  const [volume, setVolumeState] = useState(1);

  const current = useMemo(() => (index >= 0 && index < queue.length ? queue[index] : null), [queue, index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    audio.src = buildStreamUrl(current.id);
    audio.load();
    const playNow = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('재생 실패', err);
        setIsPlaying(false);
        setUnavailable((prev) => new Set(prev).add(current.id));
        alert('이 트랙의 오디오 파일을 찾을 수 없습니다. 목록에서 숨깁니다.');
        setQueue((prev) => prev.filter((t) => t.id !== current.id));
        setIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    };
    playNow();
  }, [current]);

  // 타임 업데이트
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setPosition(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [current]);

  const play = (track: Track, newQueue?: Track[]) => {
    if (unavailable.has(track.id)) {
      alert('이 트랙은 재생할 수 없는 파일입니다.');
      return;
    }

    if (newQueue) {
      const filtered = newQueue.filter((t) => !unavailable.has(t.id));
      const idx = filtered.findIndex((t) => t.id === track.id);
      setQueue(filtered);
      setIndex(idx >= 0 ? idx : 0);
      return;
    }

    setQueue((prev) => {
      const exists = prev.find((t) => t.id === track.id);
      if (exists) return prev;
      return [...prev, track];
    });
    setIndex((prevIdx) => {
      if (prevIdx >= 0) return prevIdx;
      const found = queue.findIndex((t) => t.id === track.id);
      return found >= 0 ? found : 0;
    });
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const next = () => {
    if (queue.length === 0) return;
    setIndex((prev) => (prev + 1 < queue.length ? prev + 1 : 0));
  };

  const prev = () => {
    if (queue.length === 0) return;
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : queue.length - 1));
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setPosition(time);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => next();
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [next]);

  const value: PlayerState = {
    current,
    isPlaying,
    queue,
    index,
    unavailable,
    volume,
    play,
    toggle,
    next,
    prev,
    position,
    duration,
    seek,
    setVolume: (v: number) => {
      const clamped = Math.min(1, Math.max(0, v));
      setVolumeState(clamped);
      if (audioRef.current) audioRef.current.volume = clamped;
    },
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} className="hidden" crossOrigin="anonymous" />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
