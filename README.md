# Hang On - 감정 공유 플랫폼

![CI](https://github.com/[username]/hang-on/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

혼자가 아니라는 것을 느끼게 해주는 감정 공유 플랫폼

## 📱 프로젝트 소개

**Hang On**은 사용자들이 자신의 감정을 안전하게 표현하고, 다른 사람들과 공감을 나누며, 혼자가 아니라는 것을 느낄 수 있도록 돕는 모바일 애플리케이션입니다.

### 핵심 가치
- 🌈 **감정 날씨 시스템**: 5단계 감정을 날씨로 표현
- 💬 **익명 메시지**: 안전한 환경에서 감정 표현
- 🤝 **공감과 연결**: 비슷한 감정을 가진 사람들과 연결
- 📝 **감정 기록**: 나의 감정 변화 추적

## 🛠 기술 스택

### Frontend
- **React Native CLI** (0.82.1)
- **TypeScript** (5.8.3)
- **React Navigation** - 네비게이션
- **Zustand** - 상태 관리

### Backend
- **Supabase**
  - PostgreSQL 데이터베이스
  - 인증 시스템
  - 실시간 구독
  - Edge Functions
  - Storage

### 개발 도구
- **ESLint** - 코드 품질
- **Prettier** - 코드 포맷팅
- **Jest** - 유닛 테스트
- **React Native Testing Library** - 컴포넌트 테스트

## 🚀 시작하기

### 사전 요구사항

- Node.js 20.x 이상
- Android Studio (Android 개발)
- Xcode (iOS 개발, macOS 필요)

#### WSL2 사용자 (Windows + Linux)

WSL2 환경에서 Windows Android 에뮬레이터를 사용하는 경우:

📘 **[WSL2 + Android 완전 가이드](docs/WSL2_ANDROID_COMPLETE_GUIDE.md)** (5분 설정)

- Mirrored Mode 설정으로 네트워크 격리 해결
- 단계별 가이드 및 검증 스크립트 제공
- 실전 트러블슈팅 및 함정 설명

### 설치

1. 저장소 클론
```bash
git clone https://github.com/[username]/hang-on.git
cd hang-on
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일에 Supabase 자격 증명 입력
```

4. iOS 의존성 설치 (macOS에서만)
```bash
cd ios && pod install && cd ..
```

### 실행

#### Android
```bash
# 에뮬레이터 실행
npm run emulator:phone

# 앱 실행
npm run android
```

#### iOS (macOS에서만)
```bash
npm run ios
```

## 📋 스크립트

```bash
# 개발
npm start                # Metro 번들러 시작
npm run android         # Android 앱 실행
npm run ios            # iOS 앱 실행

# 테스트
npm test               # 유닛 테스트 실행
npm run test:coverage  # 커버리지와 함께 테스트
npm run test:watch     # 감시 모드로 테스트

# 코드 품질
npm run lint           # ESLint 실행
npm run lint:fix       # ESLint 자동 수정
npm run format         # Prettier 포맷팅
npm run format:check   # 포맷 체크
npm run typecheck      # TypeScript 타입 체크

# 에뮬레이터
npm run emulator:phone       # 휴대폰 에뮬레이터
npm run emulator:tablet-7    # 7인치 태블릿
npm run emulator:tablet-10   # 10인치 태블릿
```

## 🏗 프로젝트 구조

```
hang-on/
├── src/
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── screens/         # 화면 컴포넌트
│   ├── navigation/      # 네비게이션 설정
│   ├── hooks/           # 커스텀 훅
│   ├── utils/           # 유틸리티 함수
│   ├── services/        # API 서비스
│   ├── store/           # Zustand 상태 관리
│   ├── theme/           # 디자인 시스템
│   └── types/           # TypeScript 타입 정의
├── __tests__/           # 테스트 파일
├── android/             # Android 네이티브 코드
├── ios/                 # iOS 네이티브 코드
└── docs/                # 프로젝트 문서
```

## 🎨 디자인 시스템

### 감정 날씨 5단계
- ☀️ **맑음** - 긍정적이고 밝은 감정
- 🌤️ **구름 조금** - 대체로 괜찮은 상태
- ☁️ **흐림** - 보통이거나 애매한 감정
- 🌧️ **비** - 우울하거나 슬픈 감정
- ⛈️ **폭풍** - 매우 힘들거나 격한 감정

### 테마
- **색상 시스템**: Primary, Semantic, Neutral 색상
- **타이포그래피**: 7개 텍스트 스케일
- **간격 시스템**: 8pt Grid System

## 📦 주요 컴포넌트

- **Button**: 다양한 스타일 버튼
- **Input**: 글자 수 카운터가 있는 입력 필드
- **EmotionButton**: 감정 날씨 선택기
- **RecordCard**: 감정 기록 카드
- **BottomSheet**: 하단 슬라이드 모달

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 연락처

프로젝트 관련 문의사항이 있으시면 Issue를 생성해 주세요.

---

**Made with ❤️ for everyone who needs emotional support**