# Embedded Cover & Upload Preview Guide

이 문서는 다른 프로젝트에서도 동일하게 적용할 수 있도록, 우리가 구현한 “오디오 업로드 시 커버 자동 추출·프리뷰” 흐름을 정리한 것입니다. 코드 없이 단계만 정리했으니 복사해 두고 따라 하면 됩니다.

## Backend
1) 의존성  
- `mutagen` 설치 (오디오 메타/이미지 추출용). `requirements.txt`에 추가.

2) 환경 변수 (S3/로컬 공통)  
- DB, CORS 등 기본 값 외에 스토리지 키를 `MUSIC_` 접두사로 설정.  
- S3 사용 시:  
  - `MUSIC_S3_BUCKET` = 버킷 이름 (예: `test-gpt-music`)  
  - `MUSIC_AWS_REGION` = 예: `ap-northeast-2`  
  - `MUSIC_AWS_ACCESS_KEY_ID` / `MUSIC_AWS_SECRET_ACCESS_KEY` (또는 IAM Role)  
  - `MUSIC_PRESIGN_EXPIRATION` = 프리사인 URL 만료(초)  
- 로컬 사용 시:  
  - `MUSIC_LOCAL_STORAGE_PATH` = 업로드 파일 저장 폴더 (볼륨 마운트 필수)

3) 커버 처리 로직  
- 업로드 시 `cover_file`가 없으면 `mutagen`으로 오디오 내장 이미지를 읽어 커버로 저장.  
- 저장된 커버는 S3 사용 시 버킷에, 로컬 사용 시 `MUSIC_LOCAL_STORAGE_PATH`에 기록.  
- 트랙 조회용 커버 엔드포인트 추가/활용: `GET /api/tracks/{id}/cover`  
  - 로컬: 파일을 그대로 응답.  
  - S3: presigned URL(또는 Redirect)로 응답.

4) 업로드 엔드포인트  
- `POST /api/tracks/upload/direct`  
  - `file` (오디오, 필수), `title`, `ai_provider`, `ai_model` 필수  
  - 선택: `cover_file`, `description`, `genre`, `tags`

## Frontend
1) 의존성  
- `music-metadata-browser`, `buffer` 설치 (브라우저에서 오디오 메타/커버 추출).  
- Vite/TS 기준: `Buffer` 폴리필 import 필요 (`import { Buffer } from "buffer"; window.Buffer = Buffer;` 같은 형태).

2) 업로드 폼 (UploadForm 등)  
- 파일 선택 시:  
  - `music-metadata-browser`로 내장 커버를 추출해 즉시 프리뷰 이미지로 표시.  
  - 사용자가 직접 커버 이미지를 올리면 그 프리뷰로 교체.  
- 전송: `FormData`에 `cover_file`(내장 커버를 Blob으로 만든 것 또는 사용자가 올린 이미지)을 함께 append.  
- 필수 필드 검증: `title`, `ai_provider`, `ai_model`, 오디오 파일.

3) 커버 표시  
- 리스트/카드/플레이어 등에서 커버 URL을 `/api/tracks/{id}/cover`로 구성해서 사용 (데이터의 `cover_url` 직접 사용 지양).  
- 이미지 없을 때는 기본 placeholder를 노출.

4) 환경 변수 (프론트)  
- `VITE_API_BASE_URL` = 백엔드 API 루트 (예: `https://example.com/api`)  
- (선택) `VITE_MEDIA_BASE_URL` = 별도 미디어 호스트가 있다면 지정, 없으면 API 루트 기준으로 `/tracks/{id}/cover` 사용.

## 체크리스트
- Backend: `mutagen` 설치, env 접두사 `MUSIC_` 확인, `/api/tracks/{id}/cover` 동작 확인, S3/로컬 저장소 권한 및 볼륨 점검.  
- Frontend: `music-metadata-browser` + `buffer` 설치 후 빌드, 업로드 폼에서 프리뷰가 뜨는지 확인, 커버 표시 시 `/cover` 엔드포인트 사용.  
- 배포: `.env`에 S3 키를 채우면 자동으로 S3 모드, 비워두면 로컬 저장. 프론트는 API 경로만 맞추면 추가 설정 없음.
