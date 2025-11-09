---
name: ui-ux-design-architect
description: 요구사항 기반 사용자 시나리오 도출, 화면 Flow 설계, 레이아웃 설계, 디자인 시스템 수립을 지원합니다. 디자인 기준, 컬러 팔레트, 타이포그래피, 컴포넌트 사용 기준, 인터랙션 패턴(다이얼로그 vs 스크린), 포인트 디자인 적용 시점, Visual Hierarchy, 사용자 여정 매핑, 화면 플로우, UI/UX 설계, 레이아웃 디자인, 디자인 시스템 정립 등을 다룹니다.
---

# UI/UX Design Architect

## Purpose

요구사항을 기반으로 사용자 중심의 화면 설계 및 일관된 디자인 시스템을 수립합니다.

## When to Use

다음 상황에서 이 스킬을 활성화하세요:

- 새로운 기능 또는 화면 설계 시작 전
- 디자인 시스템 또는 디자인 기준이 필요할 때
- 사용자 여정(User Journey) 매핑이 필요할 때
- 화면 플로우 또는 레이아웃 설계가 필요할 때
- Dialog vs Screen 선택 기준이 필요할 때
- 컴포넌트 사용 기준을 정립하고 싶을 때

---

## Design Process Overview

### Step 1: 요구사항 분석

**목표**: 요구사항 문서에서 핵심 가치와 사용자 목표를 추출합니다.

**체크리스트**:
- [ ] `docs/REQUIREMENTS.md` 파일 확인
- [ ] 핵심 가치 및 비즈니스 목표 파악
- [ ] 타겟 사용자 특성 이해
- [ ] 기능적 요구사항 우선순위 확인 (P0, P1, P2)
- [ ] UI/UX 가이드라인 섹션 검토

**질문 목록**:
1. 이 프로젝트의 핵심 가치는 무엇인가? (예: 익명성, 간결함, 공감)
2. 타겟 사용자는 누구인가?
3. 사용자가 해결하려는 주요 문제는 무엇인가?
4. 비기능적 요구사항 (접근성, 성능 등)은 무엇인가?

---

### Step 2: 사용자 시나리오 도출

**목표**: 실제 사용자의 행동 패턴과 목표를 기반으로 시나리오를 작성합니다.

**템플릿**:

```
**사용자 시나리오 #{번호}**

**사용자**: [사용자 유형]
**목표**: [달성하려는 목표]
**맥락**: [사용 상황]

**단계**:
1. [첫 번째 행동]
2. [두 번째 행동]
3. [목표 달성]

**감정 변화**:
- 시작: [감정 상태]
- 중간: [감정 상태]
- 종료: [감정 상태]

**주요 touchpoint**:
- [화면 1]
- [화면 2]
- [화면 3]
```

**예시** (Hang On 프로젝트):

```
**사용자 시나리오 #1: 감정 털어놓기**

**사용자**: 힘든 감정을 느끼는 20대 여성
**목표**: 자신의 감정을 기록하고 공유하여 위로받기
**맥락**: 밤 11시, 침대에서 혼자 있을 때

**단계**:
1. 앱 실행 → 메인 화면
2. "털어놓기" 버튼 탭
3. 감정 날씨 선택 (예: 비 🌧️)
4. 글 작성 (최대 500자)
5. "다 썼어요! 💙" 버튼 탭
6. 공유 옵션 선택 ("지금 나누기")
7. 작성 완료 확인 메시지

**감정 변화**:
- 시작: 우울함, 외로움
- 중간: 표현을 통한 카타르시스
- 종료: 약간의 위안, 기대감

**주요 touchpoint**:
- 메인 화면
- 감정 선택 화면
- 글쓰기 화면
- 공유 옵션 바텀시트
```

**참고**: 더 자세한 예시는 [USER_JOURNEY_EXAMPLES.md](USER_JOURNEY_EXAMPLES.md) 참조

---

### Step 3: 화면 Flow 설계

**목표**: 사용자 시나리오를 기반으로 화면 간 이동 흐름을 정의합니다.

**Flow 다이어그램 작성 방법**:

1. **시작점 정의**: 앱 실행, 특정 기능 진입점
2. **핵심 경로(Happy Path)** 먼저 설계
3. **대체 경로(Alternative Path)** 추가 (에러, 취소 등)
4. **종료점 정의**: 목표 달성, 이탈

**표기법**:
```
[화면명] → [화면명]
├─ [조건부 화면]
└─ [에러 화면]
```

**예시** (Hang On - 감정 털어놓기):

```
[메인 화면]
  └─ 탭: "털어놓기" 버튼
     └─ [감정 선택 화면]
        └─ 선택: 5단계 날씨 중 1개
           └─ [글쓰기 화면]
              ├─ 작성 완료: "다 썼어요! 💙" 버튼
              │  └─ [공유 옵션 바텀시트]
              │     ├─ 선택: "혼자 간직하기" → [메인 화면] (비공개 저장)
              │     ├─ 선택: "내일 나누기" → [메인 화면] (예약 공개)
              │     └─ 선택: "지금 나누기" → [메인 화면] (즉시 공개)
              └─ 뒤로가기: 임시 저장 확인 다이얼로그
                 ├─ "저장" → [메인 화면]
                 └─ "취소" → [글쓰기 화면]
```

**도구 추천**:
- Mermaid 다이어그램 (markdown 내 포함 가능)
- Excalidraw (간단한 스케치)
- Figma FigJam (협업 시)

---

### Step 4: 레이아웃 설계

**목표**: 각 화면의 구조와 컴포넌트 배치를 결정합니다.

**레이아웃 설계 원칙**:

1. **Visual Hierarchy (시각적 계층)**
   - 가장 중요한 요소가 가장 눈에 띄어야 함
   - 크기, 색상, 위치를 활용한 우선순위 표현

2. **F-Pattern / Z-Pattern**
   - F-Pattern: 텍스트 중심 화면 (왼쪽 → 오른쪽 → 아래)
   - Z-Pattern: 액션 중심 화면 (왼쪽 상단 → 오른쪽 상단 → 왼쪽 하단 → 오른쪽 하단)

3. **8pt Grid System**
   - 모든 요소는 8의 배수로 정렬 (8, 16, 24, 32, 40...)
   - 일관성 유지 및 픽셀 정렬 보장

4. **Safe Area (안전 영역)**
   - 노치, 상태바, 하단 제스처 영역 고려
   - React Native: `SafeAreaView` 사용

**레이아웃 템플릿**:

```
┌─────────────────────────────┐
│ Header (고정)               │ ← 상태바, 타이틀, 뒤로가기
├─────────────────────────────┤
│                             │
│ Content (스크롤 가능)        │ ← 주요 콘텐츠
│                             │
│                             │
├─────────────────────────────┤
│ Footer (고정, 선택)          │ ← CTA 버튼, 탭바
└─────────────────────────────┘
```

**예시** (Hang On - 글쓰기 화면):

```
┌─────────────────────────────┐
│ [← 뒤로] 털어놓기           │ ← Header: 뒤로가기 + 타이틀
├─────────────────────────────┤
│ ☁️ 흐림                     │ ← 선택한 감정 날씨 표시
├─────────────────────────────┤
│ [텍스트 입력 영역]          │
│                             │
│ 지금 느끼는 기분, 마음,     │ ← Placeholder
│ 감정을 자유롭게...          │
│                             │
│                   137/500   │ ← 글자 수 (우하단)
├─────────────────────────────┤
│ [다 썼어요! 💙]             │ ← CTA 버튼 (하단 고정)
└─────────────────────────────┘
```

---

### Step 5: 디자인 시스템 수립

**목표**: 일관된 디자인 기준을 문서화합니다.

디자인 시스템은 다음 섹션으로 구성됩니다:

1. **컬러 팔레트**
2. **타이포그래피**
3. **간격(Spacing) 시스템**
4. **컴포넌트 라이브러리**
5. **인터랙션 패턴**
6. **아이콘 시스템**

---

#### 5.1 컬러 팔레트

**구성**:
- **Primary Colors**: 브랜드 색상 (CTA, 강조)
- **Secondary Colors**: 보조 색상
- **Semantic Colors**: 감정/상태 표현 (성공, 경고, 에러)
- **Neutral Colors**: 배경, 텍스트, 구분선
- **Emotion Colors**: 프로젝트 특화 색상 (Hang On의 경우 날씨별 색상)

**예시** (Hang On 프로젝트):

```typescript
// src/theme/colors.ts

export const colors = {
  // Primary
  primary: '#4A90E2',         // 메인 블루 (CTA, 강조)
  primaryLight: '#7AB8FF',
  primaryDark: '#2E5C8A',

  // Emotion Weather Colors
  emotion: {
    sunny: '#FFD700',         // 맑음 (최상)
    partlyCloudy: '#87CEEB',  // 구름 조금 (상)
    cloudy: '#A9A9A9',        // 흐림 (중)
    rainy: '#708090',         // 비 (하)
    stormy: '#483D8B',        // 폭풍 (최하)
  },

  // Semantic
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Neutral
  background: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E0E0E0',

  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
};
```

**사용 기준**:
- CTA 버튼: `primary`
- 감정 표현: `emotion.*`
- 에러 메시지: `error`
- 본문 텍스트: `text.primary`
- 보조 텍스트: `text.secondary`

---

#### 5.2 타이포그래피

**구성**:
- **Heading**: 제목 (H1~H3)
- **Body**: 본문 (Regular, Bold)
- **Caption**: 보조 텍스트
- **Button**: 버튼 텍스트

**예시**:

```typescript
// src/theme/typography.ts

export const typography = {
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
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'none', // 대문자 변환 안 함
  },
};
```

**사용 기준**:
- 화면 타이틀: `h1`
- 섹션 제목: `h2`
- 카드 제목: `h3`
- 본문: `body`
- 강조 본문: `bodyBold`
- 보조 정보 (시간, 글자 수): `caption`
- 버튼: `button`

---

#### 5.3 간격(Spacing) 시스템

**8pt Grid System** 사용:

```typescript
// src/theme/spacing.ts

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};
```

**사용 기준**:
- 컴포넌트 내부 패딩: `sm` (8pt) 또는 `md` (16pt)
- 컴포넌트 간 간격: `md` (16pt) 또는 `lg` (24pt)
- 섹션 간 간격: `xl` (32pt)
- 화면 좌우 패딩: `md` (16pt)

---

#### 5.4 컴포넌트 라이브러리

**기본 컴포넌트**:
1. **Button**: Primary, Secondary, Text
2. **Input**: Text, TextArea
3. **Card**: 기록 카드, 프리셋 카드
4. **Modal**: 다이얼로그, 바텀시트
5. **Icon**: 감정 날씨 아이콘, 시스템 아이콘
6. **Badge**: 알림 뱃지, 상태 뱃지

**컴포넌트 사용 기준**:

| 상황 | 컴포넌트 | 이유 |
|------|----------|------|
| 주요 액션 (제출, 저장) | Primary Button | 시각적 강조 |
| 보조 액션 (취소) | Text Button | 덜 눈에 띄게 |
| 짧은 입력 (이메일) | Text Input | 한 줄 입력 |
| 긴 입력 (감정 글) | TextArea | 여러 줄 입력 |
| 간단한 확인 | Dialog | 빠른 응답 |
| 복잡한 선택 | Bottom Sheet | 여러 옵션 제공 |
| 목록 아이템 | Card | 정보 그룹화 |

---

#### 5.5 인터랙션 패턴

**Dialog vs Screen vs Bottom Sheet**

| 패턴 | 사용 시점 | 예시 |
|------|-----------|------|
| **Dialog** | - 간단한 확인/선택<br>- 2-3개 옵션<br>- 중요한 결정 | "정말 삭제할까요?" |
| **Bottom Sheet** | - 3개 이상 옵션<br>- 추가 설명 필요<br>- 비파괴적 선택 | 공유 옵션 선택 |
| **Screen** | - 복잡한 입력<br>- 여러 단계<br>- 많은 정보 | 글쓰기 화면 |

**포인트 디자인 사용 기준**:

| 상황 | 포인트 디자인 | 목적 |
|------|---------------|------|
| 첫 사용 | 온보딩 애니메이션 | 사용법 안내 |
| 성공 액션 | 체크 애니메이션 | 피드백 제공 |
| 공감 전송 | 하트 펄스 효과 | 감정적 연결 |
| 로딩 | 스켈레톤 UI | 대기 시간 체감 감소 |
| 에러 | 에러 일러스트 | 부드러운 에러 경험 |

**애니메이션 원칙**:
- 지속 시간: 200-300ms (짧고 빠르게)
- Easing: `ease-out` (자연스러운 감속)
- 목적: 정보 전달, 피드백 제공 (장식 X)

---

#### 5.6 아이콘 시스템

**구성**:
- **시스템 아이콘**: 뒤로가기, 설정, 닫기 등
- **감정 아이콘**: 날씨 이모지
- **액션 아이콘**: 하트, 메시지, 공유 등

**사용 기준**:
- 아이콘 크기: 24x24pt (기본), 20x20pt (작게), 32x32pt (크게)
- 터치 영역: 최소 44x44pt (접근성)
- 색상: 단색 사용 (텍스트 색상과 동일)

---

## Design System Documentation Template

디자인 시스템을 문서화할 때는 다음 템플릿을 사용하세요:

**파일 위치**: `docs/DESIGN_SYSTEM.md`

**구조**:
1. 개요 및 목적
2. 컬러 팔레트 (코드 포함)
3. 타이포그래피 (코드 포함)
4. 간격 시스템 (코드 포함)
5. 컴포넌트 라이브러리 (스크린샷 포함)
6. 인터랙션 패턴 (플로우 다이어그램 포함)
7. 아이콘 시스템 (아이콘 목록 포함)
8. 접근성 가이드라인

**참고**: 상세 템플릿은 [DESIGN_SYSTEM_TEMPLATE.md](DESIGN_SYSTEM_TEMPLATE.md) 참조

---

## Output Deliverables

이 스킬을 완료하면 다음 산출물을 생성해야 합니다:

1. **사용자 시나리오 문서**
   - 파일: `docs/USER_SCENARIOS.md`
   - 3-5개 핵심 시나리오

2. **화면 Flow 다이어그램**
   - 파일: `docs/SCREEN_FLOW.md`
   - Mermaid 다이어그램 포함

3. **레이아웃 스케치**
   - 파일: `docs/LAYOUT_SKETCHES.md` (텍스트) 또는 Figma 링크
   - 주요 화면 3-5개

4. **디자인 시스템 문서**
   - 파일: `docs/DESIGN_SYSTEM.md`
   - 컬러, 타이포, 간격, 컴포넌트, 인터랙션 패턴

5. **디자인 시스템 코드**
   - 파일:
     - `src/theme/colors.ts`
     - `src/theme/typography.ts`
     - `src/theme/spacing.ts`
     - `src/theme/index.ts` (통합)

---

## Quick Checklist

디자인 설계 완료 전 체크리스트:

- [ ] 요구사항 문서 읽음 (`docs/REQUIREMENTS.md`)
- [ ] 3개 이상 사용자 시나리오 작성
- [ ] 화면 Flow 다이어그램 완성
- [ ] 주요 화면 레이아웃 스케치 완료
- [ ] 컬러 팔레트 정의 (코드 포함)
- [ ] 타이포그래피 정의 (코드 포함)
- [ ] 간격 시스템 정의 (8pt Grid)
- [ ] 컴포넌트 사용 기준 문서화
- [ ] Dialog vs Screen 선택 기준 명시
- [ ] 포인트 디자인 사용 기준 명시
- [ ] 접근성 가이드라인 확인 (WCAG 2.1 AA)
- [ ] 다크모드 지원 여부 결정 (선택)

---

## Related Files

**참조 문서**:
- [DESIGN_PROCESS.md](DESIGN_PROCESS.md) - 디자인 프로세스 상세 가이드
- [DESIGN_SYSTEM_TEMPLATE.md](DESIGN_SYSTEM_TEMPLATE.md) - 디자인 시스템 문서 템플릿
- [USER_JOURNEY_EXAMPLES.md](USER_JOURNEY_EXAMPLES.md) - 사용자 여정 예시 모음

**프로젝트 문서**:
- `docs/REQUIREMENTS.md` - 요구사항 명세서
- `docs/API_SPEC.md` - API 명세서

**테마 코드**:
- `src/theme/colors.ts`
- `src/theme/typography.ts`
- `src/theme/spacing.ts`

---

**Skill Status**: ACTIVE ✅
**Line Count**: < 500 ✅
**Progressive Disclosure**: Reference files available ✅
