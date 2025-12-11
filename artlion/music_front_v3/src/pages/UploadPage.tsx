import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseBlob } from "music-metadata-browser";
import { Buffer } from "buffer";

import { createTrack } from "../api/tracks";

// music-metadata-browser는 브라우저에서도 Buffer가 필요하다.
if (typeof (globalThis as any).Buffer === "undefined") {
  (globalThis as any).Buffer = Buffer;
}

const MAX_AUDIO_MB = 5;
const MAX_COVER_MB = 2;
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/flac"];
const ALLOWED_COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ToastType = "info" | "error" | "success";

const UploadPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [aiProvider, setAiProvider] = useState("suno");
  const [aiModel, setAiModel] = useState("suno");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioName, setAudioName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverName, setCoverName] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [isAudioDrag, setIsAudioDrag] = useState(false);
  const [isCoverDrag, setIsCoverDrag] = useState(false);

  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const devUserId = import.meta.env.VITE_MUSIC_DEV_USER_ID as string | undefined;

  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  const setTitleFromFile = (file: File) => {
    if (!title.trim()) {
      const name = file.name.replace(/\.[^/.]+$/, "");
      setTitle(name);
    }
  };

  const normalizeCoverMime = (mime?: string) => {
    let m = mime || "image/jpeg";
    if (m === "image/jpg") m = "image/jpeg";
    if (!ALLOWED_COVER_TYPES.includes(m)) m = "image/jpeg";
    return m;
  };

  const validateAudio = (file: File) => {
    if (file.size > MAX_AUDIO_MB * 1024 * 1024) {
      throw new Error(`음원은 ${MAX_AUDIO_MB}MB 이하만 업로드할 수 있습니다.`);
    }
    if (file.type && !ALLOWED_AUDIO_TYPES.includes(file.type)) {
      throw new Error("MP3 / WAV / FLAC 형식만 지원합니다.");
    }
  };

  const validateCover = (file: File) => {
    if (file.size > MAX_COVER_MB * 1024 * 1024) {
      throw new Error(`커버 이미지는 ${MAX_COVER_MB}MB 이하만 업로드할 수 있습니다.`);
    }
    const mime = normalizeCoverMime(file.type);
    if (!ALLOWED_COVER_TYPES.includes(mime)) {
      throw new Error("커버 이미지는 JPG / PNG / WEBP 형식만 지원합니다.");
    }
  };

  // 오디오에 내장된 커버를 추출해 cover_file로 전송할 준비를 한다.
  const extractEmbeddedCover = async (file: File) => {
    try {
      const metadata = await parseBlob(file);
      const picture = metadata.common.picture?.[0];
      if (picture?.data?.length) {
        const mime = normalizeCoverMime(picture.type || picture.format);
        const blob = new Blob([picture.data], { type: mime });
        const fileFromAudio = new File([blob], "cover_from_audio.jpg", { type: mime });
        validateCover(fileFromAudio);

        const previewUrl = URL.createObjectURL(fileFromAudio);
        setCoverPreview((prev) => {
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          return previewUrl;
        });
        setCoverFile(fileFromAudio);
        setCoverName("내장 이미지");
      }
    } catch (err) {
      console.warn("내장 커버 추출 실패", err);
    }
  };

  const handleAudioSelected = async (file: File) => {
    try {
      validateAudio(file);
    } catch (err: any) {
      showToast("error", err.message);
      return;
    }
    setAudioFile(file);
    setAudioName(file.name);
    setTitleFromFile(file);
    // 사용자가 직접 커버를 선택하지 않았다면 내장 커버를 추출해 cover_file로 사용
    if (!coverFile) {
      await extractEmbeddedCover(file);
    }
  };

  const handleCoverSelected = (file: File) => {
    try {
      validateCover(file);
    } catch (err: any) {
      showToast("error", err.message);
      return;
    }
    const mime = normalizeCoverMime(file.type);
    const normalizedFile = mime === file.type ? file : new File([file], file.name || "cover.jpg", { type: mime });
    const url = URL.createObjectURL(normalizedFile);
    setCoverPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
    setCoverFile(normalizedFile);
    setCoverName(normalizedFile.name);
  };

  const onAudioInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleAudioSelected(file);
  };

  const onCoverInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleCoverSelected(file);
  };

  const onDropAudio = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsAudioDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleAudioSelected(file);
  };

  const onDropCover = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsCoverDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleCoverSelected(file);
  };

  const handleSubmit = async () => {
    if (!audioFile) {
      showToast("error", "음원 파일을 먼저 선택하세요.");
      return;
    }
    if (!title.trim() || !aiProvider.trim() || !aiModel.trim()) {
      showToast("error", "제목 / AI Provider / AI Model을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("title", title.trim());
    formData.append("ai_provider", aiProvider.trim());
    formData.append("ai_model", aiModel.trim());
    if (description.trim()) formData.append("description", description.trim());
    if (genre.trim()) formData.append("genre", genre.trim());
    if (tags.trim()) formData.append("tags", tags.trim());
    // 커버 파일이 준비되어 있으면 전송 (사용자 선택 또는 내장 추출)
    if (coverFile && ALLOWED_COVER_TYPES.includes(normalizeCoverMime(coverFile.type))) {
      formData.append("cover_file", coverFile);
    }

    const headers: Record<string, string> = {};
    if (devUserId) headers["X-User-Id"] = devUserId;

    setIsSubmitting(true);
    try {
      const res = await createTrack(formData, { headers });
      showToast("success", "업로드가 완료되었습니다.");
      const newId = (res as any)?.data?.id ?? (res as any)?.id;
      navigate(newId ? `/tracks/${newId}` : "/library");
    } catch (err: any) {
      const detail = err?.response?.data?.message ?? "업로드 중 문제가 발생했습니다.";
      showToast("error", detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">AI Upload</p>
        <h1 className="text-3xl font-black text-gray-900">AI 트랙 업로드</h1>
        <p className="text-gray-600">필수 입력: file, title, ai_provider, ai_model (+ 선택: description, genre, tags)</p>
      </header>

      {toast && (
        <div
          className={`rounded-xl px-4 py-3 text-sm text-white ${toast.type === "error" ? "bg-red-500" : toast.type === "success" ? "bg-amber-500" : "bg-gray-800"
            }`}
        >
          {toast.message}
        </div>
      )}

      <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          {/* 음원 업로드 */}
          <div
            className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed ${isAudioDrag ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-gray-50"
              } p-4 text-gray-700`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsAudioDrag(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsAudioDrag(false);
            }}
            onDrop={onDropAudio}
            onClick={() => audioInputRef.current?.click()}
          >
            <p className="font-semibold">여기에 드롭하거나 클릭하여 음원을 선택</p>
            <p className="text-sm text-gray-500">MP3 / WAV / FLAC · 최대 {MAX_AUDIO_MB}MB</p>
            {audioName && <p className="mt-2 text-sm text-gray-700">선택됨: {audioName}</p>}
            <input
              ref={audioInputRef}
              type="file"
              accept=".mp3,.wav,.flac,audio/*"
              className="hidden"
              onChange={onAudioInputChange}
            />
          </div>

          {/* 커버 업로드 */}
          <div
            className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed ${isCoverDrag ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-gray-50"
              } p-4 text-gray-700`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsCoverDrag(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsCoverDrag(false);
            }}
            onDrop={onDropCover}
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <div className="relative flex w-full flex-col items-center">
                <img src={coverPreview} alt="커버 미리보기" className="aspect-square w-full max-w-[260px] rounded-lg object-cover" />
                <span className="mt-2 text-xs text-gray-600">{coverName || "embedded cover"}</span>
              </div>
            ) : (
              <>
                <p className="font-semibold">커버 이미지 (선택)</p>
                <p className="text-sm text-gray-500">이미지를 드롭하거나 클릭하여 선택</p>
                <p className="text-sm text-gray-500">지원 형식: JPG / PNG / WEBP · 최대 {MAX_COVER_MB}MB</p>
                {coverName && <p className="mt-2 text-sm text-gray-700">{coverName}</p>}
              </>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/*"
              className="hidden"
              onChange={onCoverInputChange}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4">
            <label className="text-sm font-semibold text-gray-800">제목 *</label>
            <input
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              placeholder="예: Electric Dreams"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-semibold text-gray-800">AI Provider</label>
            <input
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-semibold text-gray-800">AI Model</label>
            <input
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-semibold text-gray-800">장르 (선택)</label>
            <input
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              placeholder="예: Synthwave, Ambient"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-semibold text-gray-800">태그 (선택)</label>
            <input
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              placeholder="쉼표로 구분"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-semibold text-gray-800">설명 (선택)</label>
            <textarea
              className="min-h-[120px] rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              placeholder="트랙 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-amber-600 disabled:opacity-60"
            >
              {isSubmitting ? "업로드 중..." : "업로드"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
