# Artlion - AI 이미지 커뮤니티 프론트엔드

AI로 생성된 이미지를 공유하고, 토너먼트로 경쟁하는 커뮤니티 플랫폼입니다.

## 🚀 주요 기능

### 이미지 갤러리
- **이미지 목록**: AI 생성 이미지 갤러리
- **랜덤 피드**: 랜덤 이미지 탐색
- **인기 Top 10**: 좋아요 순위 기반 인기 이미지
- **이미지 상세**: 이미지 정보, 프롬프트, 메타데이터
- **이미지 업로드**: AI 이미지 공유

### 토너먼트
- **토너먼트 배틀**: 1대1 이미지 대결 투표
- **토너먼트 랭킹**: ELO 기반 랭킹 시스템

### 기타
- **좋아요 기능**: 이미지 좋아요/취소
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크 모드**: 라이트/다크 테마 지원

## 🛠️ 기술 스택

- **프레임워크**: React 18 + Vite
- **라우팅**: React Router v6
- **스타일링**: Tailwind CSS
- **상태 관리**: Context API
- **HTTP 클라이언트**: Axios
- **인증**: JWT (LocalStorage)

## 📁 프로젝트 구조

```
src/
├── api/              # API 연동 레이어
│   ├── axios.js      # Axios 인스턴스 설정
│   ├── imageAPI.js   # 이미지 API
│   ├── likeAPI.js    # 좋아요 API
│   └── tournamentAPI.js # 토너먼트 API
│
├── components/       # 공통 컴포넌트
│   ├── Button.jsx
│   ├── ImageCard.jsx
│   ├── LikeButton.jsx
│   ├── LoadingSpinner.jsx
│   ├── Pagination.jsx
│   └── ProtectedRoute.jsx
│
├── contexts/         # Context API
│   └── AuthContext.jsx
│
├── hooks/            # Custom Hooks
│   └── useAuth.js
│
├── pages/            # 페이지 컴포넌트
│   ├── ImageListPageDummy.jsx      # 이미지 목록
│   ├── ImageDetailPage.jsx         # 이미지 상세
│   ├── ImageUploadPage.jsx         # 이미지 업로드
│   ├── RandomFeedPage.jsx          # 랜덤 피드
│   ├── TopImagesPage.jsx           # 인기 Top 10
│   ├── TournamentBattlePage.jsx    # 토너먼트 배틀
│   ├── TournamentRankingPage.jsx   # 토너먼트 랭킹
│   └── NotFoundPage.jsx            # 404 페이지
│
├── App.jsx           # 메인 App 컴포넌트
├── main.jsx          # 엔트리 포인트
└── index.css         # 글로벌 스타일
```

## 🎨 라우팅 구조

```
/                         → 이미지 목록 페이지
/images/:id               → 이미지 상세 페이지
/upload                   → 이미지 업로드 페이지
/random                   → 랜덤 피드 페이지
/top                      → 인기 Top 10 페이지
/tournament/battle        → 토너먼트 배틀 페이지
/tournament/ranking       → 토너먼트 랭킹 페이지
*                         → 404 페이지
```

## 🔌 API 엔드포인트

### 이미지 API
- `GET /api/v1/images/` - 이미지 목록 조회
- `GET /api/v1/images/{id}/` - 이미지 상세 조회
- `POST /api/v1/images/` - 이미지 업로드
- `PUT /api/v1/images/{id}/` - 이미지 수정
- `DELETE /api/v1/images/{id}/` - 이미지 삭제
- `GET /api/v1/images/random/` - 랜덤 이미지 조회
- `GET /api/v1/images/top/` - 인기 이미지 조회

### 좋아요 API
- `POST /api/v1/images/{id}/like/` - 좋아요 추가
- `DELETE /api/v1/images/{id}/like/` - 좋아요 취소
- `GET /api/v1/images/{id}/like/status/` - 좋아요 상태 조회

### 토너먼트 API
- `GET /api/v1/tournaments/match/` - 매치 조회
- `POST /api/v1/tournaments/vote/` - 투표
- `GET /api/v1/tournaments/rankings/` - 랭킹 조회

## 🚦 시작하기

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 입력하세요:
```
VITE_API_BASE_URL=/api/v1
VITE_AUTH_API_URL=http://localhost:8001/api/auth
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어보세요.

### 4. 프로덕션 빌드
```bash
npm run build
```

## 🎯 현재 상태

**더미 데이터 모드**: 현재 백엔드 연결 없이 더미 데이터로 UI를 테스트할 수 있습니다.

백엔드가 준비되면 각 페이지의 더미 데이터를 실제 API 호출로 교체하면 됩니다.

## 🔄 백엔드 연결 방법

1. **Vite 프록시 설정** (`vite.config.js`)
   ```javascript
   server: {
     proxy: {
       '/api': {
         target: 'http://13.125.57.129:8000',
         changeOrigin: true,
       }
     }
   }
   ```

2. **더미 페이지 교체**
   - `ImageListPageDummy.jsx` → `ImageListPage.jsx`로 교체
   - API 호출 코드는 `src/api/` 폴더에 이미 준비되어 있음

## 🎨 디자인 시스템

### 색상 (Tailwind CSS)
- **Primary**: `#eead2b` (노란색)
- **Background Light**: `#fcfaf8`
- **Background Dark**: `#121212`
- **Text Light**: `#2c2c2c`
- **Text Dark**: `#e5e5e5`

### 폰트
- **기본**: Spline Sans
- **아이콘**: Material Symbols Outlined

## 📝 개발 노트

### 완성된 기능
- ✅ 프로젝트 초기 설정
- ✅ 공통 컴포넌트 개발
- ✅ API 연동 레이어 구축
- ✅ 인증 상태 관리
- ✅ 모든 페이지 개발 (8개)
- ✅ React Router 설정
- ✅ 404 페이지

### 추가 개발 가능 항목
- 이미지 검색 기능
- 필터링 고도화
- 무한 스크롤
- 이미지 수정/삭제 기능
- 사용자 프로필 페이지
- 알림 기능

## 👥 팀 구조

- **공통 영역**: 네비게이션, 푸터, 인증 (다른 팀원)
- **이미지/토너먼트 영역**: 이 프로젝트 담당

## 📄 라이선스

이 프로젝트는 팀 프로젝트의 일부입니다.
