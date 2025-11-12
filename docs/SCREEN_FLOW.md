# 화면 Flow 다이어그램

**프로젝트**: Hang On
**버전**: 1.0.0
**최종 업데이트**: 2025-11-09

---

## 목차

1. [전체 앱 구조](#전체-앱-구조)
2. [인증 Flow](#인증-flow)
3. [털어놓기 Flow](#털어놓기-flow)
4. [누군가와 함께 Flow](#누군가와-함께-flow)
5. [내 기록 관리 Flow](#내-기록-관리-flow)
6. [설정 Flow](#설정-flow)
7. [화면 목록](#화면-목록)

---

## 전체 앱 구조

```mermaid
graph TD
    Start[앱 실행] --> CheckAuth{인증 상태?}
    CheckAuth -->|미인증| Onboarding[온보딩]
    CheckAuth -->|인증됨| MainScreen[메인 화면]

    Onboarding --> Auth[회원가입/로그인]
    Auth --> MainScreen

    MainScreen --> TabBar{탭 선택}
    TabBar -->|내 기록| MyRecords[내 기록 탭]
    TabBar -->|누군가와 함께| Feed[피드 탭]
    TabBar -->|설정| Settings[설정 탭]

    MainScreen --> CreateRecord[털어놓기 플로팅 버튼]

    style MainScreen fill:#4A90E2,color:#fff
    style CreateRecord fill:#FFD700,color:#000
```

---

## 인증 Flow

### 회원가입 및 로그인

```mermaid
graph TD
    Start[앱 첫 실행] --> Splash[스플래시 화면]
    Splash --> Onboarding[온보딩 슬라이드]

    Onboarding --> AuthSelect[인증 방식 선택]

    AuthSelect -->|이메일| EmailSignup[이메일 회원가입]
    AuthSelect -->|Google| GoogleAuth[Google 로그인]

    EmailSignup --> InputEmail[이메일 입력]
    InputEmail --> InputPassword[비밀번호 입력]
    InputPassword --> AgreeTerms[약관 동의]
    AgreeTerms --> CreateAccount[계정 생성]

    GoogleAuth --> GoogleFlow[Google OAuth 2.0]
    GoogleFlow --> CreateAccount

    CreateAccount --> Success{성공?}
    Success -->|성공| MainScreen[메인 화면]
    Success -->|실패| ErrorDialog[에러 다이얼로그]
    ErrorDialog --> AuthSelect

    AuthSelect -->|이미 가입| Login[로그인]
    Login --> InputEmailLogin[이메일 입력]
    InputEmailLogin --> InputPasswordLogin[비밀번호 입력]
    InputPasswordLogin --> Authenticate[인증]

    Authenticate --> AuthSuccess{성공?}
    AuthSuccess -->|성공| MainScreen
    AuthSuccess -->|실패| RetryLogin{재시도 횟수?}
    RetryLogin -->|< 5회| Login
    RetryLogin -->|>= 5회| LockAccount[15분 잠금]

    Login -->|비밀번호 찾기| ForgotPassword[비밀번호 찾기]
    ForgotPassword --> SendEmail[이메일 발송]
    SendEmail --> Login

    style MainScreen fill:#4A90E2,color:#fff
    style ErrorDialog fill:#F44336,color:#fff
```

---

## 털어놓기 Flow

### 감정 기록 작성

```mermaid
graph TD
    MainScreen[메인 화면] --> FloatingBtn[털어놓기 버튼 탭]
    FloatingBtn --> EmotionSelect[감정 선택 화면]

    EmotionSelect --> SelectWeather{날씨 선택}
    SelectWeather -->|맑음 ☀️| WriteScreen[글쓰기 화면]
    SelectWeather -->|구름조금 🌤️| WriteScreen
    SelectWeather -->|흐림 ☁️| WriteScreen
    SelectWeather -->|비 🌧️| WriteScreen
    SelectWeather -->|폭풍 ⛈️| WriteScreen

    WriteScreen --> InputText[텍스트 입력<br/>0-500자]
    InputText --> CharCount{글자 수 체크}
    CharCount -->|<= 500자| ValidInput[유효한 입력]
    CharCount -->|> 500자| ShowError[500자 초과 경고]
    ShowError --> InputText

    ValidInput --> DoneBtn[다 썼어요! 💙 버튼]
    DoneBtn --> ShareOptions[공유 옵션 바텀시트]

    ShareOptions --> SelectShare{공유 설정}
    SelectShare -->|혼자 간직하기| SavePrivate[비공개 저장]
    SelectShare -->|내일 나누기| SchedulePublic[예약 공개<br/>다음날 00:00]
    SelectShare -->|지금 나누기| PublishNow[즉시 공개]

    SavePrivate --> ConfirmSave[저장 완료 메시지]
    SchedulePublic --> ConfirmSchedule[예약 완료 메시지]
    PublishNow --> ConfirmPublish[공개 완료 메시지]

    ConfirmSave --> ReturnMain[메인 화면]
    ConfirmSchedule --> ReturnMain
    ConfirmPublish --> ReturnMain

    WriteScreen --> BackBtn[뒤로가기]
    BackBtn --> HasContent{내용 있음?}
    HasContent -->|있음| TempSaveDialog[임시 저장 확인]
    HasContent -->|없음| ReturnMain

    TempSaveDialog --> SaveTemp{사용자 선택}
    SaveTemp -->|저장| SaveDraft[임시 저장]
    SaveTemp -->|취소| ReturnMain
    SaveDraft --> ReturnMain

    style WriteScreen fill:#4A90E2,color:#fff
    style ShareOptions fill:#FFD700,color:#000
    style ShowError fill:#F44336,color:#fff
```

---

## 누군가와 함께 Flow

### 피드 조회 및 공감

```mermaid
graph TD
    MainScreen[메인 화면] --> FeedTab[누군가와 함께 탭]
    FeedTab --> LoadFeed[피드 로딩<br/>감정 유사도 매칭]

    LoadFeed --> CheckLimit{조회 제한?}
    CheckLimit -->|20개 남음| ShowFeed[피드 표시]
    CheckLimit -->|0개 남음| LimitReached[제한 도달 안내]

    LimitReached --> ShowMessage[오늘은 모두 읽었어요<br/>내일 다시 와주세요]
    ShowMessage --> ReturnMain[메인 화면]

    ShowFeed --> FeedList[기록 카드 목록]
    FeedList --> ScrollFeed{스크롤}
    ScrollFeed -->|카드 탭| RecordDetail[기록 상세 화면]
    ScrollFeed -->|계속 스크롤| LoadMore{더 불러오기}
    LoadMore -->|있음| ShowFeed
    LoadMore -->|없음| EndOfFeed[모두 읽었어요]

    RecordDetail --> DecreaseLimit[조회 수 -1]
    DecreaseLimit --> ShowContent[전체 내용 표시]

    ShowContent --> ActionButtons{사용자 액션}
    ActionButtons -->|공감하기 💙| SendEmpathy[공감 전송]
    ActionButtons -->|메시지 보내기| MessageSelect[메시지 프리셋 선택]
    ActionButtons -->|신고하기| ReportDialog[신고 사유 선택]
    ActionButtons -->|뒤로가기| FeedList

    SendEmpathy --> AlreadyEmpathy{이미 공감?}
    AlreadyEmpathy -->|예| ShowAlready[이미 공감한 기록]
    AlreadyEmpathy -->|아니오| AnimateHeart[하트 펄스 애니메이션]
    AnimateHeart --> UpdateCount[공감 수 +1]
    UpdateCount --> DisableBtn[버튼 비활성화]
    DisableBtn --> ShowContent

    MessageSelect --> PresetList[프리셋 목록<br/>힘내세요, 저도그래요,<br/>괜찮을거예요, 함께해요]
    PresetList --> SelectPreset{프리셋 선택}
    SelectPreset --> AlreadyMessage{이미 메시지 전송?}
    AlreadyMessage -->|예| ShowAlreadyMsg[이미 메시지 보냄]
    AlreadyMessage -->|아니오| SendMessage[메시지 전송]
    SendMessage --> ConfirmMsg[전송 완료]
    ConfirmMsg --> ShowContent

    ReportDialog --> SelectReason[욕설/혐오, 스팸/광고,<br/>자해/자살, 개인정보, 기타]
    SelectReason --> SubmitReport[신고 접수]
    SubmitReport --> HideRecord[신고자에게 숨김]
    HideRecord --> FeedList

    style ShowFeed fill:#4A90E2,color:#fff
    style AnimateHeart fill:#FFD700,color:#000
    style LimitReached fill:#FF9800,color:#fff
    style ReportDialog fill:#F44336,color:#fff
```

---

## 내 기록 관리 Flow

### 조회, 수정, 삭제

```mermaid
graph TD
    MainScreen[메인 화면<br/>내 기록 탭] --> RecordList[기록 목록<br/>시간순 정렬]

    RecordList --> Filter{필터 적용?}
    Filter -->|감정별| EmotionFilter[날씨별 필터]
    Filter -->|공개상태별| VisibilityFilter[공개/비공개 필터]
    Filter -->|없음| ShowAll[전체 표시]

    EmotionFilter --> RecordList
    VisibilityFilter --> RecordList
    ShowAll --> RecordList

    RecordList --> SelectRecord[기록 카드 탭]
    SelectRecord --> RecordDetail[기록 상세 화면]

    RecordDetail --> ShowFull[전체 내용 표시]
    ShowFull --> ShowStats[공감 수, 메시지 수]
    ShowStats --> ShowReceived[받은 공감/메시지 목록]

    RecordDetail --> MenuBtn[... 메뉴]
    MenuBtn --> MenuOptions{메뉴 선택}

    MenuOptions -->|수정하기| EditRecord[글쓰기 화면<br/>기존 내용 표시]
    MenuOptions -->|삭제하기| DeleteDialog[삭제 확인 다이얼로그]
    MenuOptions -->|공유 설정 변경| ChangeVisibility[공유 옵션 바텀시트]

    EditRecord --> UpdateContent[내용 수정]
    UpdateContent --> SaveEdit[저장]
    SaveEdit --> ConfirmEdit[수정 완료]
    ConfirmEdit --> RecordList

    DeleteDialog --> ConfirmDelete{정말 삭제?}
    ConfirmDelete -->|삭제| SoftDelete[Soft Delete<br/>30일 복구 가능]
    ConfirmDelete -->|취소| RecordDetail
    SoftDelete --> RemoveFromList[목록에서 제거]
    RemoveFromList --> ShowSnackbar[삭제되었어요 스낵바]
    ShowSnackbar --> RecordList

    ChangeVisibility --> SelectNewVisibility{새 공유 설정}
    SelectNewVisibility -->|혼자 간직하기| MakePrivate[비공개 전환]
    SelectNewVisibility -->|내일 나누기| ScheduleChange[예약 공개 전환]
    SelectNewVisibility -->|지금 나누기| MakePublic[즉시 공개 전환]

    MakePrivate --> ConfirmChange[변경 완료]
    ScheduleChange --> ConfirmChange
    MakePublic --> ConfirmChange
    ConfirmChange --> RecordDetail

    style RecordList fill:#4A90E2,color:#fff
    style DeleteDialog fill:#F44336,color:#fff
```

---

## 설정 Flow

### 계정 및 앱 설정

```mermaid
graph TD
    MainScreen[메인 화면] --> SettingsTab[설정 탭]

    SettingsTab --> SettingsList[설정 목록]

    SettingsList --> PushToggle[푸시 알림 토글]
    PushToggle --> UpdatePush[알림 설정 변경]
    UpdatePush --> SettingsList

    SettingsList --> LanguageSelect[언어 변경]
    LanguageSelect --> LanguageList[6개 언어 목록<br/>한국어, 영어, 일본어,<br/>스페인어, 포르투갈어, 프랑스어]
    LanguageList --> SelectLang[언어 선택]
    SelectLang --> ApplyLang[앱 재시작]
    ApplyLang --> SettingsList

    SettingsList --> Logout[로그아웃]
    Logout --> LogoutDialog[로그아웃 확인]
    LogoutDialog --> ConfirmLogout{정말 로그아웃?}
    ConfirmLogout -->|예| ClearSession[세션 삭제]
    ConfirmLogout -->|아니오| SettingsList
    ClearSession --> LoginScreen[로그인 화면]

    SettingsList --> DeleteAccount[계정 삭제]
    DeleteAccount --> DeleteDialog[계정 삭제 경고<br/>모든 데이터 영구 삭제]
    DeleteDialog --> ConfirmDelete{정말 삭제?}
    ConfirmDelete -->|삭제| DeleteUser[계정 및 데이터 삭제]
    ConfirmDelete -->|취소| SettingsList
    DeleteUser --> LoginScreen

    SettingsList --> Contact[개발자에게 문의]
    Contact --> OpenMail[mailto: 링크]

    SettingsList --> Privacy[개인정보 처리방침]
    Privacy --> WebView[웹뷰 표시]

    SettingsList --> Terms[이용약관]
    Terms --> WebView

    style SettingsList fill:#4A90E2,color:#fff
    style DeleteDialog fill:#F44336,color:#fff
    style LogoutDialog fill:#FF9800,color:#fff
```

---

## 화면 목록

### 인증 관련

| 화면명             | 타입   | 설명                 | 우선순위 |
| ------------------ | ------ | -------------------- | -------- |
| 스플래시 화면      | Screen | 앱 로딩 (< 3초)      | P0       |
| 온보딩 슬라이드    | Screen | 3-4개 슬라이드 소개  | P1       |
| 회원가입 화면      | Screen | 이메일/Google 선택   | P0       |
| 로그인 화면        | Screen | 이메일/비밀번호 입력 | P0       |
| 비밀번호 찾기 화면 | Screen | 이메일 발송          | P0       |

### 메인 기능

| 화면명              | 타입         | 설명                    | 우선순위 |
| ------------------- | ------------ | ----------------------- | -------- |
| 메인 화면 (내 기록) | Screen       | 탭바 + 기록 목록        | P0       |
| 누군가와 함께 탭    | Screen       | 피드 목록               | P0       |
| 설정 탭             | Screen       | 계정/앱 설정            | P0       |
| 감정 선택 화면      | Screen       | 5단계 날씨 선택         | P0       |
| 글쓰기 화면         | Screen       | 텍스트 입력 (500자)     | P0       |
| 공유 옵션 바텀시트  | Bottom Sheet | 3가지 옵션 선택         | P0       |
| 기록 상세 화면      | Screen       | 전체 내용 + 공감/메시지 | P0       |
| 메시지 프리셋 선택  | Bottom Sheet | 4개 프리셋              | P0       |

### 다이얼로그

| 화면명               | 타입   | 설명             | 우선순위 |
| -------------------- | ------ | ---------------- | -------- |
| 삭제 확인 다이얼로그 | Dialog | 기록 삭제 확인   | P0       |
| 신고 다이얼로그      | Dialog | 신고 사유 선택   | P0       |
| 임시 저장 확인       | Dialog | 뒤로가기 시      | P0       |
| 공유 설정 변경 확인  | Dialog | 공개/비공개 전환 | P0       |
| 로그아웃 확인        | Dialog | 로그아웃 확인    | P0       |
| 계정 삭제 경고       | Dialog | 데이터 삭제 경고 | P0       |

### Empty/Error 상태

| 화면명                | 타입  | 설명                     | 우선순위 |
| --------------------- | ----- | ------------------------ | -------- |
| Empty State (내 기록) | State | "아직 기록이 없어요"     | P0       |
| Empty State (피드)    | State | "도착한 이야기가 없어요" | P0       |
| 조회 제한 도달        | State | "오늘은 모두 읽었어요"   | P0       |
| 네트워크 에러         | State | 연결 실패 안내           | P0       |
| 서버 에러 (500)       | State | 일시적 오류 안내         | P0       |

---

## Flow 설계 원칙

### 1. Happy Path 우선

- 가장 일반적인 사용자 여정을 먼저 설계
- 대체 경로(에러, 취소)는 나중에 추가

### 2. 최소 클릭 수

- 주요 기능은 3클릭 이내 도달
- 예: 메인 → 털어놓기 → 감정 선택 → 글쓰기 → 공유 (3단계)

### 3. 명확한 피드백

- 모든 액션에 즉각적인 피드백 제공
- 예: 공감 전송 → 하트 애니메이션 → 버튼 비활성화

### 4. 되돌리기 가능

- 파괴적 액션(삭제)은 확인 다이얼로그 필수
- Soft Delete로 복구 가능 기간 제공 (30일)

### 5. 일관된 네비게이션

- 뒤로가기 버튼 위치 고정 (좌상단)
- 하단 탭바 위치 고정
- 플로팅 버튼 위치 고정 (우하단)

---

## 다음 단계

1. ✅ 사용자 시나리오 작성 완료 (`docs/USER_SCENARIOS.md`)
2. ✅ 화면 Flow 다이어그램 완료 (현재 문서)
3. ⏳ 주요 화면 레이아웃 스케치 (`docs/LAYOUT_SKETCHES.md`)
4. ⏳ 디자인 시스템 문서 작성 (`docs/DESIGN_SYSTEM.md`)
5. ⏳ 디자인 시스템 코드 작성 (`src/theme/`)

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2025-11-09
**다음 리뷰**: 레이아웃 스케치 완료 후
