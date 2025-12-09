# 프로젝트 폴더 구조

```
src/
├── api/                    # API 관련 파일
│   ├── axios.js           # Axios 설정 및 인터셉터
│   ├── imageAPI.js        # 이미지 API 함수들
│   ├── likeAPI.js         # 좋아요 API 함수들
│   └── tournamentAPI.js   # 토너먼트 API 함수들
│
├── components/            # 재사용 가능한 컴포넌트
│   ├── ImageCard.jsx      # 이미지 카드 컴포넌트
│   ├── LikeButton.jsx     # 좋아요 버튼 컴포넌트
│   ├── LoadingSpinner.jsx # 로딩 스피너
│   ├── Modal.jsx          # 모달 컴포넌트
│   ├── Button.jsx         # 공통 버튼
│   └── Pagination.jsx     # 페이지네이션 컴포넌트
│
├── pages/                 # 페이지 컴포넌트
│   ├── ImageListPage.jsx  # 이미지 목록 페이지
│   ├── ImageDetailPage.jsx # 이미지 상세 페이지
│   ├── UploadPage.jsx     # 이미지 업로드 페이지
│   ├── RandomFeedPage.jsx # 랜덤 피드 페이지
│   ├── TopImagesPage.jsx  # 인기 이미지 페이지
│   ├── TournamentBattlePage.jsx # 토너먼트 참여 페이지
│   └── TournamentRankingPage.jsx # 토너먼트 랭킹 페이지
│
├── contexts/              # Context API 상태 관리
│   └── AuthContext.jsx    # 인증 상태 관리
│
├── hooks/                 # 커스텀 훅
│   └── useAuth.js         # 인증 관련 훅
│
├── utils/                 # 유틸리티 함수
│   └── helpers.js         # 도우미 함수들
│
├── assets/               # 정적 파일 (이미지, 아이콘 등)
│
├── App.jsx               # 메인 앱 컴포넌트
├── main.jsx              # 엔트리 포인트
└── index.css             # 글로벌 스타일
```

## 각 폴더 설명

### `/api`
- 백엔드 API와 통신하는 함수들을 모아둔 폴더
- `axios.js`: API 요청을 위한 기본 설정
- 각 API 파일: 이미지, 좋아요, 토너먼트 관련 함수들

### `/components`
- 여러 페이지에서 재사용되는 컴포넌트들
- 예: 버튼, 카드, 모달 등

### `/pages`
- 각 URL 경로에 매칭되는 페이지 컴포넌트들
- 예: `/images` → ImageListPage.jsx

### `/contexts`
- Context API를 사용한 전역 상태 관리
- 로그인 상태, 사용자 정보 등

### `/hooks`
- 재사용 가능한 React 커스텀 훅
- 예: useAuth (로그인 상태 확인)

### `/utils`
- 공통으로 사용되는 유틸리티 함수들
- 예: 날짜 포맷팅, 문자열 처리 등
