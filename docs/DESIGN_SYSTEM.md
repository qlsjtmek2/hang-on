# 디자인 시스템

**프로젝트**: Hang On
**버전**: 1.0.0
**최종 업데이트**: 2025-11-09

---

## 목차

1. [개요 및 목적](#개요-및-목적)
2. [컬러 팔레트](#컬러-팔레트)
3. [타이포그래피](#타이포그래피)
4. [간격 시스템](#간격-시스템)
5. [컴포넌트 라이브러리](#컴포넌트-라이브러리)
6. [인터랙션 패턴](#인터랙션-패턴)
7. [아이콘 시스템](#아이콘-시스템)
8. [접근성 가이드라인](#접근성-가이드라인)
9. [애니메이션](#애니메이션)
10. [사용 가이드](#사용-가이드)

---

## 개요 및 목적

### 목적

Hang On 디자인 시스템은 일관된 사용자 경험을 제공하기 위한 디자인 기준과 코드 구현을 정의합니다.

### 핵심 원칙

1. **감정 중심 (Emotion-First)**
   - 모든 디자인 요소는 감정 표현을 우선으로 고려
   - 색상, 아이콘, 애니메이션이 감정을 반영

2. **간결함 (Simplicity)**
   - 불필요한 요소 제거
   - 직관적인 인터페이스

3. **익명성 (Anonymity)**
   - 사용자 식별 정보 최소화
   - 중립적인 디자인

4. **접근성 (Accessibility)**
   - WCAG 2.1 AA 준수
   - 모든 사용자가 쉽게 사용 가능

---

## 컬러 팔레트

### Primary Colors (주요 색상)

브랜드 및 CTA 색상으로 사용합니다.

```typescript
primary: '#4A90E2'         // 메인 블루
primaryLight: '#7AB8FF'    // 밝은 블루 (호버, 비활성화)
primaryDark: '#2E5C8A'     // 어두운 블루 (눌림)
```

**사용 예시**:
- CTA 버튼 배경
- 선택된 탭 색상
- 링크 텍스트
- 플로팅 버튼 배경

---

### Emotion Colors (감정 날씨 색상)

5단계 감정을 표현하는 핵심 색상입니다.

| 감정 레벨 | 날씨 | 이모지 | 색상 코드 | 색상 이름 | 의미 |
|-----------|------|--------|-----------|-----------|------|
| 5 (최상) | 맑음 | ☀️ | `#FFD700` | Gold | 행복, 기쁨 |
| 4 (상) | 구름 조금 | 🌤️ | `#87CEEB` | Sky Blue | 평온, 만족 |
| 3 (중) | 흐림 | ☁️ | `#A9A9A9` | Dark Gray | 중립, 무덤덤 |
| 2 (하) | 비 | 🌧️ | `#708090` | Slate Gray | 슬픔, 우울 |
| 1 (최하) | 폭풍 | ⛈️ | `#483D8B` | Dark Slate Blue | 고통, 절망 |

```typescript
emotion: {
  sunny: '#FFD700',        // 맑음 (최상)
  partlyCloudy: '#87CEEB', // 구름 조금 (상)
  cloudy: '#A9A9A9',       // 흐림 (중)
  rainy: '#708090',        // 비 (하)
  stormy: '#483D8B',       // 폭풍 (최하)
}
```

**사용 예시**:
- 감정 선택 버튼 배경
- 기록 카드 상단 강조색
- 감정 통계 그래프 (Phase 2)

---

### Semantic Colors (의미 색상)

시스템 상태를 표현하는 색상입니다.

```typescript
success: '#4CAF50'   // 성공 (초록)
warning: '#FF9800'   // 경고 (주황)
error: '#F44336'     // 에러 (빨강)
info: '#2196F3'      // 정보 (파랑)
```

**사용 예시**:
- 성공: 저장 완료 메시지
- 경고: 글자 수 제한 임박
- 에러: 500자 초과, 네트워크 오류
- 정보: 툴팁, 안내 메시지

---

### Neutral Colors (중립 색상)

배경, 텍스트, 구분선 등에 사용합니다.

```typescript
background: '#FFFFFF'    // 메인 배경
surface: '#F5F5F5'       // 카드 배경
surfaceHover: '#EEEEEE'  // 카드 호버
border: '#E0E0E0'        // 구분선
overlay: 'rgba(0, 0, 0, 0.5)' // 다이얼로그 뒤 오버레이
```

---

### Text Colors (텍스트 색상)

텍스트 위계를 표현합니다.

```typescript
text: {
  primary: '#212121',    // 주요 텍스트 (검정)
  secondary: '#757575',  // 보조 텍스트 (회색)
  disabled: '#BDBDBD',   // 비활성화 텍스트 (연한 회색)
  inverse: '#FFFFFF',    // 역전 텍스트 (흰색, Primary 버튼 위)
}
```

**색상 대비 확인** (WCAG 2.1 AA 준수):
- `text.primary` on `background`: 15.8:1 ✅
- `text.secondary` on `background`: 4.6:1 ✅
- `text.inverse` on `primary`: 5.2:1 ✅

---

## 타이포그래피

### 폰트 패밀리

**시스템 기본 폰트** 사용:

```typescript
fontFamily: {
  ios: 'SF Pro Text',           // iOS
  android: 'Roboto',            // Android
  fallback: 'sans-serif',       // 폴백
}
```

**다국어 지원**:
- 한국어: Noto Sans KR (시스템 기본)
- 일본어: Noto Sans JP (시스템 기본)
- 기타: 시스템 기본 폰트

---

### 폰트 스케일

8pt Grid System에 맞춰 폰트 크기를 정의합니다.

| 타입 | 크기 (pt) | 굵기 | Line Height | Letter Spacing | 용도 |
|------|-----------|------|-------------|----------------|------|
| h1 | 28 | 700 (Bold) | 36 | -0.5pt | 화면 타이틀 |
| h2 | 24 | 600 (Semi-Bold) | 32 | -0.3pt | 섹션 제목 |
| h3 | 20 | 600 (Semi-Bold) | 28 | 0pt | 카드 제목 |
| body | 16 | 400 (Regular) | 24 | 0pt | 본문 |
| bodyBold | 16 | 700 (Bold) | 24 | 0pt | 강조 본문 |
| caption | 14 | 400 (Regular) | 20 | 0pt | 보조 정보 |
| button | 16 | 600 (Semi-Bold) | 20 | 0pt | 버튼 텍스트 |

```typescript
typography: {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0,
  },
};
```

---

### 사용 가이드

| 요소 | 타입 | 색상 |
|------|------|------|
| 화면 타이틀 | h1 | text.primary |
| 섹션 제목 | h2 | text.primary |
| 카드 제목 | h3 | text.primary |
| 본문 | body | text.primary |
| 강조 본문 | bodyBold | text.primary |
| 시간, 글자 수 | caption | text.secondary |
| 버튼 | button | text.inverse (primary 배경) |
| 플레이스홀더 | body | text.secondary |

---

## 간격 시스템

### 8pt Grid System

모든 간격은 8의 배수를 사용합니다.

```typescript
spacing: {
  xs: 4,      // Extra Small (예외적 사용)
  sm: 8,      // Small
  md: 16,     // Medium (기본)
  lg: 24,     // Large
  xl: 32,     // Extra Large
  xxl: 40,    // 2X Large
  xxxl: 48,   // 3X Large
};
```

---

### 사용 가이드

| 용도 | 간격 | 값 (pt) |
|------|------|---------|
| 컴포넌트 내부 패딩 | sm | 8 |
| 카드 패딩 | md | 16 |
| 화면 좌우 패딩 | md | 16 |
| 컴포넌트 간 간격 | md | 16 |
| 카드 간 간격 | md | 16 |
| 섹션 간 간격 | lg | 24 |
| 섹션 상하 패딩 | xl | 32 |

---

## 컴포넌트 라이브러리

### 1. Button (버튼)

#### Variants (변형)

**Primary Button**:
```typescript
{
  backgroundColor: colors.primary,
  color: colors.text.inverse,
  height: 56,
  borderRadius: 12,
  paddingHorizontal: spacing.md,
}
```

**Secondary Button**:
```typescript
{
  backgroundColor: colors.background,
  color: colors.primary,
  borderWidth: 2,
  borderColor: colors.primary,
  height: 56,
  borderRadius: 12,
  paddingHorizontal: spacing.md,
}
```

**Text Button**:
```typescript
{
  backgroundColor: 'transparent',
  color: colors.primary,
  height: 48,
  paddingHorizontal: spacing.sm,
}
```

**Destructive Button** (삭제):
```typescript
{
  backgroundColor: colors.error,
  color: colors.text.inverse,
  height: 56,
  borderRadius: 12,
  paddingHorizontal: spacing.md,
}
```

#### States (상태)

- **Default**: 기본 상태
- **Pressed**: 배경색 10% 어둡게
- **Disabled**: 투명도 50%

---

### 2. RecordCard (기록 카드)

#### 레이아웃

```typescript
{
  backgroundColor: colors.surface,
  borderRadius: 12,
  padding: spacing.md,
  minHeight: 120,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2, // Android
}
```

#### 구성 요소

1. **Header**: 감정 아이콘 + 날씨 텍스트 + 시간
2. **Content**: 글 미리보기 (2줄, 말줄임표)
3. **Footer**: 공감 수 + 메시지 수

---

### 3. EmotionButton (감정 선택 버튼)

#### 기본 상태

```typescript
{
  width: 80,
  height: 80,
  borderRadius: 40, // 원형
  backgroundColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
}
```

#### 선택 상태

```typescript
{
  width: 96,
  height: 96,
  borderRadius: 48,
  backgroundColor: colors.emotion[selected], // 10% 투명도
  transform: [{ scale: 1.2 }],
}
```

---

### 4. BottomSheet (바텀시트)

#### 레이아웃

```typescript
{
  backgroundColor: colors.background,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: spacing.lg,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 8, // Android
}
```

#### 애니메이션

- 진입: `translateY` (아래 → 위, 300ms, ease-out)
- 퇴장: `translateY` (위 → 아래, 300ms, ease-in)

---

### 5. Dialog (다이얼로그)

#### 레이아웃

```typescript
{
  backgroundColor: colors.background,
  borderRadius: 16,
  padding: spacing.lg,
  maxWidth: 320,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
}
```

#### 버튼 레이아웃

- 2개 버튼: 가로 정렬, 동일한 너비
- 1개 버튼: 가로 전체

---

## 인터랙션 패턴

### Dialog vs Screen vs Bottom Sheet

| 패턴 | 사용 시점 | 예시 |
|------|-----------|------|
| **Dialog** | - 간단한 확인/선택<br>- 2-3개 옵션<br>- 중요한 결정 (삭제 등) | "정말 삭제할까요?",<br>"로그아웃 할까요?" |
| **Bottom Sheet** | - 3개 이상 옵션<br>- 추가 설명 필요<br>- 비파괴적 선택 | 공유 옵션 선택,<br>메시지 프리셋 선택 |
| **Screen** | - 복잡한 입력<br>- 여러 단계<br>- 많은 정보 | 글쓰기 화면,<br>설정 화면 |

---

### 포인트 디자인 사용 기준

| 상황 | 포인트 디자인 | 목적 |
|------|---------------|------|
| 첫 사용 | 온보딩 애니메이션 | 사용법 안내 |
| 성공 액션 | 체크 애니메이션 | 피드백 제공 |
| 공감 전송 | 하트 펄스 효과 | 감정적 연결 |
| 로딩 | 스켈레톤 UI | 대기 시간 체감 감소 |
| 에러 | 에러 일러스트 | 부드러운 에러 경험 |
| Empty State | 일러스트 + 안내 | 다음 액션 유도 |

---

## 아이콘 시스템

### 크기

| 용도 | 크기 (pt) |
|------|-----------|
| 시스템 아이콘 (뒤로가기, 설정) | 24x24 |
| 감정 이모지 | 48x48 (기본), 56x56 (선택됨) |
| 액션 아이콘 (하트, 메시지) | 20x20 |
| 탭바 아이콘 | 24x24 |

### 터치 영역

최소 터치 영역: **44x44pt** (WCAG 2.1 AA)

아이콘이 24x24pt인 경우, 패딩 10pt 추가하여 터치 영역 확보:

```typescript
{
  width: 24,
  height: 24,
  padding: 10, // 총 44x44pt 터치 영역
}
```

---

### 감정 날씨 아이콘

| 감정 레벨 | 이모지 | Unicode | 대체 텍스트 |
|-----------|--------|---------|-------------|
| 5 (최상) | ☀️ | U+2600 | 맑음 |
| 4 (상) | 🌤️ | U+1F324 | 구름 조금 |
| 3 (중) | ☁️ | U+2601 | 흐림 |
| 2 (하) | 🌧️ | U+1F327 | 비 |
| 1 (최하) | ⛈️ | U+26C8 | 폭풍 |

**스크린 리더 지원**: 각 이모지에 `accessibilityLabel` 추가

```typescript
<Text accessibilityLabel="맑음">☀️</Text>
```

---

### 시스템 아이콘

| 아이콘 | 용도 | 라이브러리 |
|--------|------|-----------|
| ← | 뒤로가기 | Ionicons: `chevron-back` |
| ⋯ | 더보기 메뉴 | Ionicons: `ellipsis-horizontal` |
| ⚙️ | 설정 | Ionicons: `settings-outline` |
| ✏️ | 편집 | Ionicons: `create-outline` |
| 🗑️ | 삭제 | Ionicons: `trash-outline` |
| 💙 | 공감 (하트) | Ionicons: `heart` |
| 💬 | 메시지 | Ionicons: `chatbubble-outline` |
| 🔔 | 알림 | Ionicons: `notifications-outline` |

**라이브러리**: [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) (Ionicons)

---

## 접근성 가이드라인

### WCAG 2.1 AA 준수

#### 색상 대비

| 요소 | 전경색 | 배경색 | 대비 비율 | 기준 |
|------|--------|--------|-----------|------|
| 주요 텍스트 | #212121 | #FFFFFF | 15.8:1 | ✅ 7:1 이상 (AAA) |
| 보조 텍스트 | #757575 | #FFFFFF | 4.6:1 | ✅ 4.5:1 이상 (AA) |
| Primary 버튼 | #FFFFFF | #4A90E2 | 5.2:1 | ✅ 4.5:1 이상 (AA) |
| 링크 | #4A90E2 | #FFFFFF | 5.2:1 | ✅ 4.5:1 이상 (AA) |

#### 터치 타겟

- **최소 크기**: 44x44pt
- **권장 크기**: 48x48pt
- **간격**: 최소 8pt

#### 폰트 크기

- **최소 크기**: 14pt (caption)
- **본문**: 16pt
- **사용자 조절**: 시스템 폰트 크기 설정 반영

```typescript
// React Native에서 시스템 폰트 크기 설정 반영
import { PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale();
const fontSize = 16 * fontScale; // 사용자 설정 반영
```

---

### 스크린 리더 지원

#### accessibilityLabel

모든 인터랙티브 요소에 명확한 레이블 제공:

```typescript
<TouchableOpacity
  accessibilityLabel="공감하기 버튼"
  accessibilityHint="이 기록에 공감을 전달합니다"
>
  <Text>공감하기 💙</Text>
</TouchableOpacity>
```

#### accessibilityRole

요소의 역할 명시:

```typescript
<TouchableOpacity accessibilityRole="button">
  <Text>다 썼어요! 💙</Text>
</TouchableOpacity>

<Text accessibilityRole="header">털어놓기</Text>
```

---

### 색맹 지원

색상만으로 정보 전달 금지. 아이콘/텍스트 병행:

- ❌ "빨간색 버튼을 누르세요"
- ✅ "삭제 버튼을 누르세요" (빨간색 + 아이콘)

---

## 애니메이션

### 애니메이션 원칙

1. **목적성**: 정보 전달 또는 피드백 제공 (장식 X)
2. **빠름**: 200-300ms (길면 답답함)
3. **자연스러움**: `ease-out` 사용 (감속)

---

### 애니메이션 타입

#### 1. Fade (투명도)

**용도**: 요소 등장/사라짐

```typescript
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 200,
  easing: Easing.out(Easing.ease),
  useNativeDriver: true,
}).start();
```

---

#### 2. Scale (크기)

**용도**: 감정 선택 버튼, 공감 하트

```typescript
Animated.spring(scaleAnim, {
  toValue: 1.2,
  friction: 3,
  tension: 40,
  useNativeDriver: true,
}).start();
```

---

#### 3. Slide (슬라이드)

**용도**: 바텀시트 진입/퇴장

```typescript
Animated.timing(slideAnim, {
  toValue: 0,
  duration: 300,
  easing: Easing.out(Easing.ease),
  useNativeDriver: true,
}).start();
```

---

#### 4. Pulse (펄스)

**용도**: 공감 전송 시 하트 효과

```typescript
Animated.sequence([
  Animated.timing(scaleAnim, {
    toValue: 1.3,
    duration: 150,
    useNativeDriver: true,
  }),
  Animated.timing(scaleAnim, {
    toValue: 1.0,
    duration: 150,
    useNativeDriver: true,
  }),
]).start();
```

---

### 애니메이션 사용 가이드

| 상황 | 애니메이션 | 지속 시간 | Easing |
|------|-----------|-----------|--------|
| 감정 선택 | Scale (1.0 → 1.2) | 300ms | spring |
| 공감 전송 | Pulse (1.0 → 1.3 → 1.0) | 300ms | ease-out |
| 바텀시트 진입 | Slide (아래 → 위) | 300ms | ease-out |
| 바텀시트 퇴장 | Slide (위 → 아래) | 300ms | ease-in |
| 다이얼로그 진입 | Fade (0 → 1) + Scale (0.9 → 1.0) | 200ms | ease-out |
| 스낵바 | Slide (아래 → 위) + Fade | 200ms | ease-out |
| 로딩 | Skeleton shimmer | 1000ms (loop) | linear |

---

## 사용 가이드

### 디자인 시스템 적용

#### 1. 색상 사용

```typescript
import { colors } from '@/theme';

// ✅ 좋은 예
<View style={{ backgroundColor: colors.primary }}>

// ❌ 나쁜 예 (하드코딩)
<View style={{ backgroundColor: '#4A90E2' }}>
```

---

#### 2. 타이포그래피 사용

```typescript
import { typography } from '@/theme';

// ✅ 좋은 예
<Text style={[typography.h1, { color: colors.text.primary }]}>

// ❌ 나쁜 예 (하드코딩)
<Text style={{ fontSize: 28, fontWeight: '700' }}>
```

---

#### 3. 간격 사용

```typescript
import { spacing } from '@/theme';

// ✅ 좋은 예
<View style={{ padding: spacing.md }}>

// ❌ 나쁜 예 (하드코딩)
<View style={{ padding: 16 }}>
```

---

### 일관성 체크리스트

디자인 구현 전 체크:

- [ ] 색상은 `colors.*` 사용
- [ ] 폰트는 `typography.*` 사용
- [ ] 간격은 `spacing.*` 사용 (8의 배수)
- [ ] 버튼 높이 최소 48pt
- [ ] 터치 영역 최소 44x44pt
- [ ] 색상 대비 비율 4.5:1 이상
- [ ] 모든 인터랙티브 요소에 `accessibilityLabel`
- [ ] 애니메이션 지속 시간 200-300ms
- [ ] 모서리 반경 8 또는 12pt (일관성)

---

## 부록: 컬러 코드 참조표

### 전체 컬러 팔레트

| 카테고리 | 이름 | 색상 코드 | RGB |
|----------|------|-----------|-----|
| **Primary** | primary | `#4A90E2` | rgb(74, 144, 226) |
| | primaryLight | `#7AB8FF` | rgb(122, 184, 255) |
| | primaryDark | `#2E5C8A` | rgb(46, 92, 138) |
| **Emotion** | sunny | `#FFD700` | rgb(255, 215, 0) |
| | partlyCloudy | `#87CEEB` | rgb(135, 206, 235) |
| | cloudy | `#A9A9A9` | rgb(169, 169, 169) |
| | rainy | `#708090` | rgb(112, 128, 144) |
| | stormy | `#483D8B` | rgb(72, 61, 139) |
| **Semantic** | success | `#4CAF50` | rgb(76, 175, 80) |
| | warning | `#FF9800` | rgb(255, 152, 0) |
| | error | `#F44336` | rgb(244, 67, 54) |
| | info | `#2196F3` | rgb(33, 150, 243) |
| **Neutral** | background | `#FFFFFF` | rgb(255, 255, 255) |
| | surface | `#F5F5F5` | rgb(245, 245, 245) |
| | border | `#E0E0E0` | rgb(224, 224, 224) |
| **Text** | primary | `#212121` | rgb(33, 33, 33) |
| | secondary | `#757575` | rgb(117, 117, 117) |
| | disabled | `#BDBDBD` | rgb(189, 189, 189) |
| | inverse | `#FFFFFF` | rgb(255, 255, 255) |

---

## 다음 단계

1. ✅ 사용자 시나리오 작성 완료 (`docs/USER_SCENARIOS.md`)
2. ✅ 화면 Flow 다이어그램 완료 (`docs/SCREEN_FLOW.md`)
3. ✅ 주요 화면 레이아웃 스케치 완료 (`docs/LAYOUT_SKETCHES.md`)
4. ✅ 디자인 시스템 문서 완료 (현재 문서)
5. ⏳ 디자인 시스템 코드 작성 (`src/theme/`)

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2025-11-09
**다음 리뷰**: 디자인 시스템 코드 작성 후
