# Design System Documentation Template

## 목차

1. [개요](#개요)
2. [컬러 팔레트](#컬러-팔레트)
3. [타이포그래피](#타이포그래피)
4. [간격 시스템](#간격-시스템)
5. [컴포넌트 라이브러리](#컴포넌트-라이브러리)
6. [인터랙션 패턴](#인터랙션-패턴)
7. [아이콘 시스템](#아이콘-시스템)
8. [접근성 가이드라인](#접근성-가이드라인)
9. [다크모드](#다크모드)

---

## 개요

### 목적

이 디자인 시스템은 [프로젝트명]의 일관된 UI/UX를 보장하기 위해 만들어졌습니다.

### 핵심 원칙

1. **일관성(Consistency)**: 모든 화면에서 동일한 패턴 사용
2. **접근성(Accessibility)**: WCAG 2.1 AA 준수
3. **확장성(Scalability)**: 새로운 기능 추가 시 쉽게 확장
4. **간결함(Simplicity)**: 복잡하지 않은 직관적인 디자인

### 브랜드 아이덴티티

- **브랜드 성격**: [예: 친근함, 전문성, 신뢰]
- **감성 키워드**: [예: 따뜻함, 안정감, 현대적]
- **타겟 사용자**: [예: 20-30대 직장인]

---

## 컬러 팔레트

### Primary Colors

브랜드의 주요 색상으로, CTA 버튼 및 강조 요소에 사용합니다.

```typescript
// src/theme/colors.ts

export const colors = {
  primary: '#4A90E2',       // Main Blue
  primaryLight: '#7AB8FF',  // Light variant (hover, disabled)
  primaryDark: '#2E5C8A',   // Dark variant (pressed)
};
```

**사용 예시**:
- Primary Button 배경: `primary`
- Primary Button Hover: `primaryLight`
- Primary Button Pressed: `primaryDark`

**시각적 예시**:

```
┌───────────┐ ┌───────────┐ ┌───────────┐
│  #4A90E2  │ │  #7AB8FF  │ │  #2E5C8A  │
│  Primary  │ │   Light   │ │   Dark    │
└───────────┘ └───────────┘ └───────────┘
```

---

### Secondary Colors

보조 색상으로, 덜 중요한 액션에 사용합니다.

```typescript
export const colors = {
  // ...
  secondary: '#FFA726',
  secondaryLight: '#FFB74D',
  secondaryDark: '#F57C00',
};
```

**사용 예시**:
- Secondary Button 배경: `secondary`
- 뱃지, 라벨

---

### Semantic Colors

상태를 나타내는 색상입니다.

```typescript
export const colors = {
  // ...
  success: '#4CAF50',   // 초록 (성공, 완료)
  warning: '#FF9800',   // 주황 (경고)
  error: '#F44336',     // 빨강 (에러)
  info: '#2196F3',      // 파랑 (정보)
};
```

**사용 예시**:
- 성공 메시지: `success`
- 에러 메시지: `error`
- 경고 배너: `warning`

---

### Neutral Colors

배경, 텍스트, 구분선 등에 사용하는 무채색입니다.

```typescript
export const colors = {
  // ...
  background: '#FFFFFF',   // 메인 배경
  surface: '#F5F5F5',      // 카드, 패널 배경
  border: '#E0E0E0',       // 구분선, 테두리

  text: {
    primary: '#212121',    // 주요 텍스트 (제목, 본문)
    secondary: '#757575',  // 보조 텍스트 (설명, 캡션)
    disabled: '#BDBDBD',   // 비활성 텍스트
    inverse: '#FFFFFF',    // 역전 텍스트 (어두운 배경 위)
  },
};
```

**색상 대비 (Contrast Ratio)**:
- `text.primary` / `background`: 16.5:1 (AAA ✅)
- `text.secondary` / `background`: 7.0:1 (AA ✅)

---

### Project-Specific Colors

프로젝트 특화 색상 (예: 감정 날씨 색상)

```typescript
export const colors = {
  // ...
  emotion: {
    sunny: '#FFD700',         // 맑음 (최상)
    partlyCloudy: '#87CEEB',  // 구름 조금 (상)
    cloudy: '#A9A9A9',        // 흐림 (중)
    rainy: '#708090',         // 비 (하)
    stormy: '#483D8B',        // 폭풍 (최하)
  },
};
```

**사용 예시**:
- 감정 선택 아이콘 배경
- 기록 카드 액센트 색상

---

## 타이포그래피

### Font Family

```typescript
// src/theme/typography.ts

export const fontFamily = {
  regular: 'Pretendard-Regular',  // 본문
  medium: 'Pretendard-Medium',    // 강조
  bold: 'Pretendard-Bold',        // 제목
};
```

**폰트 라이선스**: [SIL Open Font License 1.1](https://scripts.sil.org/OFL)

---

### Type Scale

```typescript
export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.5,
    fontFamily: fontFamily.bold,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
    fontFamily: fontFamily.bold,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: fontFamily.medium,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: fontFamily.regular,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    fontFamily: fontFamily.bold,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: fontFamily.regular,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: fontFamily.medium,
  },
};
```

### 사용 기준

| 요소 | 타입 스타일 | 예시 |
|------|-------------|------|
| 화면 타이틀 | `h1` | "털어놓기" |
| 섹션 제목 | `h2` | "오늘의 이야기" |
| 카드 제목 | `h3` | "감정 날씨 선택" |
| 본문 | `body` | 기록 내용 |
| 강조 본문 | `bodyBold` | "중요한 안내" |
| 보조 텍스트 | `caption` | "3분 전", "15/20" |
| 버튼 | `button` | "다 썼어요! 💙" |

---

## 간격 시스템

### 8pt Grid System

모든 간격은 8의 배수를 사용합니다.

```typescript
// src/theme/spacing.ts

export const spacing = {
  xs: 4,    // 0.5x
  sm: 8,    // 1x
  md: 16,   // 2x
  lg: 24,   // 3x
  xl: 32,   // 4x
  xxl: 40,  // 5x
  xxxl: 48, // 6x
};
```

### 사용 기준

| 요소 | 간격 | 값 |
|------|------|-----|
| 버튼 내부 패딩 (상하) | `sm` | 8pt |
| 버튼 내부 패딩 (좌우) | `md` | 16pt |
| 카드 내부 패딩 | `md` | 16pt |
| 카드 간 간격 | `md` | 16pt |
| 섹션 간 간격 | `xl` | 32pt |
| 화면 좌우 마진 | `md` | 16pt |
| 화면 상하 마진 | `lg` | 24pt |
| 텍스트 줄 간격 | `xs` ~ `sm` | 4-8pt |

### 간격 시각화

```
┌─────────────────────────────┐
│ ← 16pt (md) →               │ ← 화면 좌우 마진
│ ┌─────────────────────────┐ │
│ │ 카드 (패딩 16pt)        │ │
│ └─────────────────────────┘ │
│          ↕ 16pt (md)        │ ← 카드 간 간격
│ ┌─────────────────────────┐ │
│ │ 카드                    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 컴포넌트 라이브러리

### Button

**Primary Button**:
- 배경: `colors.primary`
- 텍스트: `colors.text.inverse`
- 패딩: `spacing.sm` (상하), `spacing.md` (좌우)
- Border Radius: 8pt
- 타이포: `typography.button`

**사용 시점**: 주요 액션 (제출, 저장, 다음)

```typescript
// src/components/Button/PrimaryButton.tsx

<PrimaryButton onPress={handleSubmit}>
  다 썼어요! 💙
</PrimaryButton>
```

**Secondary Button**:
- 배경: 투명
- 텍스트: `colors.primary`
- Border: 1pt solid `colors.primary`

**사용 시점**: 보조 액션 (취소, 뒤로가기)

**Text Button**:
- 배경: 투명
- 텍스트: `colors.primary`
- Border: 없음

**사용 시점**: 덜 중요한 액션 (건너뛰기, 더보기)

---

### Input

**Text Input**:
- 배경: `colors.surface`
- Border: 1pt solid `colors.border`
- Border Radius: 8pt
- 패딩: `spacing.sm` (상하), `spacing.md` (좌우)
- 타이포: `typography.body`

**상태별 스타일**:
- **Default**: Border `colors.border`
- **Focus**: Border `colors.primary`, 2pt
- **Error**: Border `colors.error`, 2pt
- **Disabled**: 배경 `colors.surface`, 텍스트 `colors.text.disabled`

**TextArea**:
- Text Input과 동일하지만 여러 줄 입력
- 최소 높이: 120pt

---

### Card

**기록 카드**:
- 배경: `colors.background`
- Border: 1pt solid `colors.border`
- Border Radius: 12pt
- Shadow: 0pt 2pt 8pt rgba(0, 0, 0, 0.1)
- 패딩: `spacing.md`

**구성 요소**:
1. 감정 아이콘 (좌상단)
2. 작성 시간 (우상단)
3. 글 내용 (2줄 미리보기)
4. 공감/메시지 수 (하단)

---

### Modal

**Dialog**:
- 배경: `colors.background`
- Border Radius: 16pt
- 패딩: `spacing.lg`
- 최대 너비: 300pt

**사용 시점**: 간단한 확인/선택

**Bottom Sheet**:
- 배경: `colors.background`
- Border Radius: 24pt (상단만)
- 패딩: `spacing.lg`

**사용 시점**: 3개 이상 옵션 선택

---

### Badge

**알림 뱃지**:
- 배경: `colors.error`
- 텍스트: `colors.text.inverse`
- Border Radius: 12pt (완전 원형)
- 크기: 20pt x 20pt
- 타이포: `typography.caption`

**사용 시점**: 새로운 알림 표시

---

## 인터랙션 패턴

### Navigation Patterns

**1. Stack Navigation** (화면 푸시)
- 사용: 계층적 화면 이동 (메인 → 상세)
- 애니메이션: 오른쪽에서 슬라이드
- 지속 시간: 300ms

**2. Tab Navigation** (탭 전환)
- 사용: 동등한 레벨의 화면 전환
- 애니메이션: 페이드 인/아웃
- 지속 시간: 200ms

**3. Modal Navigation** (모달 표시)
- 사용: 임시적인 작업 (선택, 확인)
- 애니메이션: 아래에서 슬라이드 업
- 지속 시간: 300ms

---

### Dialog vs Bottom Sheet vs Screen

| 패턴 | 사용 시점 | 예시 |
|------|-----------|------|
| **Dialog** | - 간단한 확인 (Yes/No)<br>- 2-3개 옵션<br>- 중요한 결정 | "정말 삭제할까요?" |
| **Bottom Sheet** | - 3개 이상 옵션<br>- 추가 설명 필요<br>- 비파괴적 선택 | 공유 옵션 선택 |
| **Screen** | - 복잡한 입력<br>- 여러 단계<br>- 많은 정보 표시 | 글쓰기 화면 |

---

### Loading States

**1. Skeleton UI**
- 사용: 콘텐츠 로딩 중
- 디자인: 회색 플레이스홀더 + 반짝이는 애니메이션
- 지속 시간: 콘텐츠 로드 완료까지

**2. Spinner**
- 사용: 짧은 로딩 (< 2초)
- 디자인: 원형 스피너 (primary 색상)
- 크기: 24pt x 24pt

**3. Progress Bar**
- 사용: 진행률 표시 (파일 업로드 등)
- 디자인: 수평 바 (primary 색상)
- 높이: 4pt

---

### Error States

**Inline Error** (입력 필드 옆):
- 텍스트: `colors.error`
- 아이콘: ⚠️
- 타이포: `typography.caption`

**Error Banner** (화면 상단):
- 배경: `colors.error`
- 텍스트: `colors.text.inverse`
- 높이: 48pt

**Empty State** (빈 목록):
- 일러스트 + 메시지
- 색상: `colors.text.secondary`
- 타이포: `typography.body`

---

### Feedback & Microinteractions

**1. Button Press**
- 배경 투명도: 80% (눌렀을 때)
- 지속 시간: 100ms
- Easing: `ease-out`

**2. Heart Animation** (공감):
- Scale: 1.0 → 1.3 → 1.0
- 지속 시간: 300ms
- Easing: `ease-in-out`

**3. Toast Message**
- 위치: 화면 하단 (Safe Area 위)
- 지속 시간: 3초
- 애니메이션: 아래에서 슬라이드 업

---

## 아이콘 시스템

### Icon Library

**추천 라이브러리**:
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
- Icon Set: Ionicons, Feather

### Icon Sizes

```typescript
// src/theme/icons.ts

export const iconSizes = {
  small: 20,    // 작은 아이콘 (리스트 아이템)
  medium: 24,   // 기본 아이콘 (버튼, 탭바)
  large: 32,    // 큰 아이콘 (감정 날씨)
  xlarge: 48,   // 매우 큰 아이콘 (Empty State)
};
```

### 사용 기준

| 요소 | 크기 | 색상 |
|------|------|------|
| 뒤로가기 버튼 | `medium` (24pt) | `text.primary` |
| 탭바 아이콘 | `medium` (24pt) | `primary` (active), `text.secondary` (inactive) |
| 감정 날씨 아이콘 | `large` (32pt) | `emotion.*` |
| Empty State 아이콘 | `xlarge` (48pt) | `text.secondary` |

### 터치 영역

아이콘의 터치 영역은 최소 **44pt x 44pt** (접근성)

```
┌───────────────┐
│               │
│   [아이콘 24pt]   │ ← 시각적 크기
│               │
└───────────────┘
  44pt x 44pt      ← 터치 영역
```

---

## 접근성 가이드라인

### WCAG 2.1 AA 준수

**1. 색상 대비 (Contrast Ratio)**
- 일반 텍스트: 최소 4.5:1
- 큰 텍스트 (18pt 이상): 최소 3:1

**확인 도구**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**2. 터치 타겟 크기**
- 최소 크기: 44pt x 44pt
- 간격: 최소 8pt

**3. 스크린 리더 지원**
- 모든 버튼: `accessibilityLabel` 제공
- 아이콘 버튼: 텍스트 대체

```typescript
<TouchableOpacity
  accessibilityLabel="뒤로가기"
  accessibilityRole="button"
>
  <Icon name="arrow-back" />
</TouchableOpacity>
```

**4. 포커스 인디케이터**
- 키보드 포커스 시 테두리 표시
- 색상: `colors.primary`
- Border Width: 2pt

---

## 다크모드

### 색상 반전

```typescript
// src/theme/colors.ts

export const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  border: '#2C2C2C',

  text: {
    primary: '#E0E0E0',
    secondary: '#B0B0B0',
    disabled: '#707070',
    inverse: '#121212',
  },

  // Primary, Secondary, Semantic은 동일
  primary: '#4A90E2',
  success: '#4CAF50',
  // ...
};
```

### 이미지 및 아이콘

- 아이콘: 자동 색상 반전 (`tintColor` 사용)
- 이미지: 별도 다크모드 버전 제공

---

**템플릿 버전**: 1.0.0
**최종 업데이트**: 2025-11-09

이 템플릿을 복사하여 `docs/DESIGN_SYSTEM.md` 파일을 작성하세요.
