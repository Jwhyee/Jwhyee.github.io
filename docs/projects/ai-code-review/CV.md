## AI 코드 리뷰 시스템 도입

### 프로젝트 정보

- **역할** : 전체 서비스 개발
- **기간** : 2025.08 - 2025.09
- **기술** : GitLab, LM Studio, n8n
- **한 줄 요약** : 개인 스터디 시간을 활용해 사내 인프라 기반의 Zero-Budget AI 코드 리뷰 시스템을 구축하여, 리뷰 병목 해결 및 팀 코드 품질 상향 평준화 달성.

### STAR

#### 1. Situation (기존 시스템의 한계 및 배경)

- **리소스 부족과 리뷰 병목:** 차세대 국내 의약품 배송 서비스 개발의 임시 팀장으로서 실무와 매니징을 병행. 팀원들이 개발한 도메인 맥락을 파악하고 코드를 리뷰하는 데 과도한 시간과 인지적 피로 발생.
- **코드 품질 편차 우려:** 신입/인턴과 기존 팀원 간의 코드 품질 편차가 커 코드 리뷰 문화를 포기할 수 없는 상황.
- **도입 예산 제약:** 상용 AI 리뷰 SaaS(CodeRabbit 등) 도입을 고려했으나, 코드 리뷰 문화에 회의적인 경영진의 스탠스로 인해 예산 지원 불가.

#### 2. Task (직면한 과제 및 목표)

- **Zero-Budget 자동화 파이프라인 구축:** 비용 발생 없이 사내 오픈소스 인프라(GitLab, n8n, LM Studio)만으로 동작하는 AI 코드 리뷰 시스템 직접 기획 및 구현.
- **리뷰어 피로도 감소 및 품질 상향 평준화:** AI가 기본적인 로직 오류와 컨벤션을 1차 필터링하여, 휴먼 리뷰어가 핵심 비즈니스 로직과 아키텍처에만 집중할 수 있는 환경 조성.

#### 3. Action (기술적 의사결정 및 행동)

- **개인 시간을 활용한 파이프라인 구축:** 업무 외 개인 스터디 시간을 적극 할애하여, GitLab MR(Merge Request) 이벤트를 Webhook으로 수신하고 n8n 기반의 워크플로우가 즉시 트리거되도록 리뷰 프로세스 자동화 파이프라인을 직접 개발.
- **LLM 컨텍스트 최적화 (Noise Filtering):** 거대한 MR Diff 전체 전달 시 발생하는 토큰 낭비 및 환각(Hallucination) 방지. 변경 사항을 Hunk 단위로 분해하고, Import 문이나 주석 등 로직과 무관한 노이즈를 필터링하여 프롬프트 페이로드 정제.
- **추론 환경 안정화 및 부하 분산:** 로컬 추론 환경에 코드 분석 특화 모델(`gpt-oss-20b`) 적용. 다수 MR 동시 발생 시 병목 해결을 위해 라운드 로빈(Round-Robin) 방식으로 AI 요청을 분산 처리하여 응답 안정성과 전체 처리량 개선.

#### 4. Result (정량적/정성적 성과)

- **개발 생산성 및 코드 품질 향상:** 1차 AI 리뷰의 즉각적인 피드백으로 신입 팀원의 코드 품질 상향 평준화 달성. 리뷰 소요 시간 단축 및 피로도 감소로 전체 기능 배포 속도 향상.
- **경영진 설득 및 성과 인정:** 개인 시간을 투자해 주도적으로 팀의 생산성 병목을 해결하고 코드 품질을 개선한 지표(에러 리포트)를 증명하여, 실제 성과 평가 및 연봉 인상에 긍정적으로 반영됨.

---

나아가 사내 도입 후, 개인적으로 사용하기 위해 Kotlin, Spring Boot 기반으로 개선했음.

---

# 🤖 AI Code Reviewer — 포트폴리오

> **Kotlin · Spring Boot 3 · Google Gemini · GitHub App**
>
> GitHub Pull Request에 대해 **AI 기반 자동 코드 리뷰**를 수행하는 서버 사이드 애플리케이션

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [아키텍처 설계](#3-아키텍처-설계)
4. [핵심 기능 상세](#4-핵심-기능-상세)
5. [동작 흐름 (End-to-End)](#5-동작-흐름-end-to-end)
6. [기술적 하이라이트 — 잘 만든 포인트](#6-기술적-하이라이트--잘-만든-포인트)
7. [인증 · 보안](#7-인증--보안)
8. [CI/CD 및 배포 파이프라인](#8-cicd-및-배포-파이프라인)
9. [적용 방식 (설치 가이드)](#9-적용-방식-설치-가이드)
10. [프로젝트 구조](#10-프로젝트-구조)
11. [향후 발전 방향](#11-향후-발전-방향)

---

## 1. 프로젝트 개요

### 배경 및 목표

코드 리뷰는 소프트웨어 품질 보증의 핵심이지만, 리뷰어의 시간과 역량에 크게 의존합니다. 특히 주니어 개발자가 많은 팀에서는 시니어 개발자의 리뷰 병목이 발생하기 쉽습니다.

**AI Code Reviewer**는 이 문제를 해결하기 위해 개발되었습니다:

- **PR이 열리면** → 전체 변경 사항을 자동으로 **요약**(Summary)하여 리뷰어가 컨텍스트를 빠르게 파악
- **`review-bot` 라벨을 추가하면** → 파일별로 **상세 코드 리뷰**를 수행하여 AS-IS/TO-BE 형태의 구체적 개선안 제시

Google Gemini의 최신 AI 모델을 활용하여 **시니어 테크 리드 수준의 리뷰**를 자동으로 생성하고, GitHub PR에 직접 코멘트로 게시합니다.

### 한 줄 요약

> GitHub App으로 동작하는 Webhook 서버가 PR 이벤트를 수신하고, Gemini AI로 코드 리뷰를 생성하여 PR에 자동으로 코멘트를 남기는 시스템

---

## 2. 기술 스택

| 분류 | 기술 | 선택 이유 |
|------|------|-----------|
| **언어** | Kotlin 1.9 | Null Safety, Coroutine 네이티브 지원, Java 생태계 호환 |
| **프레임워크** | Spring Boot 3 (Web + WebFlux) | 엔터프라이즈 레벨의 안정성, WebFlux의 비동기 HTTP 클라이언트 |
| **비동기 처리** | Kotlin Coroutine + Channel | 경량 스레드 기반 동시성, Channel 기반 작업 큐 |
| **AI 모델** | Google Gemini (google-genai SDK 1.0.0) | Thinking 모드 지원, 코드 이해력이 뛰어난 최신 LLM |
| **인증** | JJWT (RS256) + GitHub App | JWT 기반 앱 인증, Installation Token 자동 발급 |
| **빌드** | Gradle (Kotlin DSL) | Kotlin 프로젝트와의 자연스러운 통합 |
| **런타임** | Java 21 (Eclipse Temurin) | LTS 버전, Virtual Thread 등 최신 기능 지원 |
| **컨테이너** | Docker (Buildx, 멀티 아키텍처) | linux/amd64 + linux/arm64 크로스 플랫폼 빌드 |
| **CI/CD** | GitHub Actions (Self-hosted Runner) | 코드 저장소와 통합된 자동 배포 |
| **배포** | AWS EC2 + Docker | SSH 기반 자동 배포 |

---

## 3. 아키텍처 설계

### 전체 아키텍처 다이어그램

```
┌─────────────┐     Webhook (POST)     ┌──────────────────────────────┐
│   GitHub    │ ───────────────────────▶│  CodeReviewController       │
│   (PR 이벤트) │                        │  - 서명 검증 (HMAC-SHA256)   │
└─────────────┘                        │  - 페이로드 역직렬화           │
       ▲                               └──────────┬───────────────────┘
       │                                          │
       │                                          ▼
       │                               ┌──────────────────────────────┐
       │                               │  CodeReviewFacade            │
       │                               │  - 이벤트 라우팅               │
       │                               │  - opened → 요약 생성         │
       │                               │  - labeled → 상세 리뷰 큐 등록 │
       │                               └──────┬───────────┬───────────┘
       │                                      │           │
       │                                      ▼           ▼
       │                          ┌─────────────────┐ ┌──────────────────┐
       │                          │ CodeSummaryService│ │ ReviewJobQueue   │
       │                          │ - 전체 diff 요약  │ │ - Channel 기반 큐│
       │                          └────────┬────────┘ │ - Worker 패턴    │
       │                                   │          └────────┬─────────┘
       │                                   │                   │
       │                                   ▼                   ▼
       │                          ┌────────────────────────────────────┐
       │                          │       GoogleGeminiClient           │
       │                          │  - Streaming 응답 처리              │
       │                          │  - Thinking 모드 지원               │
       │                          │  - 시스템 프롬프트 주입              │
       │                          └────────────────────────────────────┘
       │
       │           Review Comment (POST)
       │◀──────────────────────────────────────────────────────────────
       │                          ┌────────────────────────────────────┐
       └──────────────────────────│       GithubReviewClient           │
                                  │  - GitHub App Token 인증            │
                                  │  - PR 코멘트 / 파일 코멘트 게시      │
                                  └────────────────────────────────────┘
```

### 설계 원칙

1. **Facade 패턴**: `CodeReviewFacade`가 이벤트 유형에 따라 적절한 서비스로 라우팅 — 단일 진입점으로 복잡도 관리
2. **Producer-Consumer 패턴**: `ReviewJobQueue`가 Kotlin Channel로 작업 큐를 구현 — Rate Limit 준수를 위한 순차 처리
3. **Port & Adapter (헥사고날 아키텍처)**: `AiClient`, `GitHostClient` 인터페이스로 외부 의존성 추상화 — 테스트 용이성 및 확장성 확보
4. **Sealed Class 활용**: `ReviewType`이 `ByComment`, `ByFile`, `ByMultiline` 3가지 타입을 sealed class로 모델링 — 타입 안전한 분기 처리

---

## 4. 핵심 기능 상세

### 4.1. PR 변경점 자동 요약

PR이 `opened` 되면 전체 diff를 분석하여 **변경 사항을 한눈에 파악할 수 있는 요약문**을 자동 생성합니다.

| 항목 | 설명 |
|------|------|
| **트리거** | `pull_request` Webhook의 `opened` 액션 |
| **사용 모델** | `gemini-2.5-flash-lite` (빠른 응답, 높은 RPM 한도) |
| **프롬프트 역할** | "다재다능한 CTO" 페르소나, 주니어 개발자를 위한 친근한 말투 |
| **출력 위치** | PR에 일반 코멘트 (`COMMENT` 이벤트) |

```kotlin
// CodeSummaryService — diff를 파일별로 구조화하여 프롬프트 생성
private fun List<ReviewContext>.buildPrompt(): String = asSequence()
    .filter { it.type.path().isNotBlank() }
    .joinToString("\n") {
        """
## Info
> Path : ${it.type.path()}

### File diff
```diff
${it.body}
        """.trimIndent()
    }.trim()
```

### 4.2. 요청 기반 상세 코드 리뷰

PR에 `review-bot` 라벨을 추가하면, 파일별로 **AS-IS / TO-BE 형태의 상세 코드 리뷰**를 수행합니다.

| 항목 | 설명 |
|------|------|
| **트리거** | `pull_request` Webhook의 `labeled` 액션 + `review-bot` 라벨 확인 |
| **사용 모델** | `gemini-2.5-flash` (Thinking 모드 활성화, 깊이 있는 분석) |
| **동시 요청 제어** | `Semaphore`로 최대 3개 동시 요청 |
| **쿨다운** | 각 리뷰 후 60초 + 랜덤 Jitter(0~3초) 대기 |
| **출력 위치** | PR의 해당 파일에 코드 코멘트 |

**리뷰 품질 보장 전략:**
- 리뷰 불필요 시 `REJECT_REVIEW` 토큰을 반환하도록 프롬프트 설계 — 불필요한 노이즈 방지
- 최대 리뷰 파일 수 제한 (`MAX_FILES_TO_REVIEW = 10`, 실제 리뷰 `MAX_REVIEW_COUNT = 5`)
- 변경량이 큰 파일 우선 정렬 → 핵심 변경에 집중
- 너무 짧은 diff(`MIN_BODY_LENGTH = 30자 미만`) 필터링

### 4.3. 지능적 Diff 필터링

모든 diff를 리뷰하는 것이 아니라, **의미 있는 변경만 선별**합니다:

| 필터 대상 | 처리 방식 |
|-----------|-----------|
| **import 구문 변경** | 정규식(`^[+\- ]\s*import\b`)으로 감지 후 제외 |
| **파일 삭제** | `deleted file mode` 또는 `+++ /dev/null` 감지 시 스킵 |
| **삭제만 있는 파일** | import 제외 후 `+` 라인이 0개인 경우 스킵 |
| **빈 변경** | `+`/`-` 모두 0인 경우 (import만 변경된 파일) 스킵 |
| **공백 라인** | 빈 라인은 파싱에서 제외 |

### 4.4. 고품질 리뷰 프롬프트 엔지니어링

시니어 테크 리드 페르소나를 적용한 **정교한 시스템 프롬프트**를 설계하였습니다:

```
💡 프롬프트 핵심 설계 포인트:

1. 페르소나 설정: "시니어 테크 리드"로 역할 부여 → 일관된 리뷰 톤앤매너
2. 구조화된 출력 템플릿: "좋은 점 → 보완 사항(AS-IS/TO-BE) → 총평" 3단 구조
3. 실행 가능한 코드 제안: "Copy-Paste Ready" 원칙 — 의사 코드가 아닌 실제 컴파일 가능한 코드
4. 컨텍스트 인식: 사용 언어와 프레임워크의 Best Practice 적용
5. Import 포함: TO-BE 코드에 필수 Import 구문도 포함하여 바로 적용 가능
```

---

## 5. 동작 흐름 (End-to-End)

### 시나리오 1: PR 열기 → 자동 요약

```
1. 개발자가 GitHub에 PR을 생성 (opened)
2. GitHub이 Webhook으로 POST /api/code/review 호출
3. CodeReviewController가 X-Hub-Signature-256 검증
4. CodeReviewFacade가 OPENED 액션을 감지
5. GithubDiffClient가 GitHub API로 PR의 diff 데이터 조회
6. GithubDiffUtils가 diff를 파일 단위로 파싱 + import/삭제 파일 필터링
7. CodeSummaryService가 파일별 diff를 프롬프트로 조합
8. GoogleGeminiClient가 Gemini 2.5 Flash Lite로 요약 생성 (Streaming)
9. GithubReviewClient가 생성된 요약을 PR에 COMMENT로 게시
```

### 시나리오 2: `review-bot` 라벨 → 상세 리뷰

```
 1. 리뷰 요청자가 PR에 "review-bot" 라벨 추가 (labeled)
 2. GitHub이 Webhook으로 POST /api/code/review 호출
 3. CodeReviewController가 서명 검증
 4. CodeReviewFacade가 LABELED 액션 + review-bot 라벨 확인
 5. 기본 브랜치(main/master)로의 머지가 아닌지 검증
 6. GithubDiffClient가 diff 조회, GithubDiffUtils가 파싱 + 필터링
 7. ReviewJobQueue.enqueue()로 Channel에 작업 등록
 8. 백그라운드 워커가 Channel에서 작업을 꺼냄
 9. CodeReviewService가 파일을 변경량 기준 정렬 → 상위 5개 선택
10. Semaphore(3)로 동시 요청 제어하며 각 파일별 Gemini 호출
11. 각 호출 후 60s + jitter 쿨다운 (Rate Limit 준수)
12. REJECT_REVIEW 응답은 스킵, 유효한 리뷰만 GitHub에 파일 코멘트로 게시
```

### 안전장치 (Guard Clauses)

| 검증 항목 | 위치 | 실패 시 동작 |
|-----------|------|-------------|
| Webhook 서명 | `CodeReviewController` | `401 Unauthorized` 반환 |
| 유효한 GitHub 이벤트 | `CodeReviewController` | `401` 반환 |
| 페이로드 역직렬화 | `CodeReviewController` | `406 Not Acceptable` 반환 |
| 유효한 Action 타입 | `CodeReviewFacade` | `IllegalArgumentException` |
| 이벤트가 PR인지 | `CodeReviewFacade` | 무시 (조기 리턴) |
| `review-bot` 라벨 여부 | `CodeReviewFacade` | 무시 (로깅 후 리턴) |
| 기본 브랜치 머지 방지 | `CodeReviewFacade` | 무시 (로깅 후 리턴) |
| Gemini 응답 null/blank | `CodeReviewService` | 경고 로깅 후 스킵 |
| REJECT_REVIEW 응답 | `CodeReviewService` | 정보 로깅 후 스킵 |
| GitHub 코멘트 게시 실패 | `CodeReviewService` | 경고 로깅 후 계속 |

---

## 6. 기술적 하이라이트 — 잘 만든 포인트

### ⭐ 6.1. Kotlin Coroutine Channel 기반 비동기 작업 큐

> **가장 눈에 띄는 설계 포인트**

GitHub API와 Gemini API 모두 Rate Limit이 존재합니다. 이를 안정적으로 관리하기 위해 **Kotlin Channel 기반 Producer-Consumer 패턴**을 구현했습니다.

```kotlin
@Component
class ReviewJobQueue(private val codeReviewService: CodeReviewService) {
    // BUFFERED 채널 — 메모리 기반, 별도 인프라 불필요
    private val channel = Channel<ReviewJob>(capacity = Channel.BUFFERED)
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    @PostConstruct
    fun start() {
        repeat(workerCount) { idx ->
            scope.launch(CoroutineName("review-worker-$idx")) {
                for (job in channel) {
                    // runCatching으로 개별 작업 실패가 전체 큐를 중단시키지 않음
                    runCatching { codeReviewService.review(...) }
                        .onFailure { logger.error("...") }
                }
            }
        }
    }

    @PreDestroy
    fun stop() {
        channel.close()   // Graceful Shutdown
        scope.cancel()
    }
}
```

**잘 만든 이유:**
- 🏗️ **별도 인프라 불필요**: Redis, RabbitMQ 없이 인메모리 Channel로 구현 → 운영 복잡도 최소화
- 🛡️ **장애 격리**: `SupervisorJob` + `runCatching`으로 개별 작업 실패가 전체 워커에 영향 안 줌
- 🔌 **Graceful Shutdown**: `@PreDestroy`에서 Channel close + Scope cancel → 애플리케이션 종료 시 안전하게 정리
- 📏 **스케일링 대비**: `workerCount` 변수 하나로 워커 수 조절 가능

### ⭐ 6.2. Semaphore + Jitter 기반 Rate Limit 관리

단순 `delay`가 아닌, **Semaphore로 동시성 제어 + Jitter로 Thundering Herd 방지**까지 고려했습니다.

```kotlin
companion object {
    private const val MAX_CONCURRENCY = 3
    private const val ONE_MINUTE_MS = 60_000L
    private const val COOLDOWN_JITTER_MS = 3_000L
}

private val semaphore = Semaphore(MAX_CONCURRENCY)

// 동시에 최대 3개까지만 Gemini API 호출
tasks.mapIndexed { index, task ->
    async {
        semaphore.withPermit {
            processOne(task, model, index + 1, tasks.size)
        }
    }
}.awaitAll()

// 각 호출 후 랜덤 Jitter가 포함된 쿨다운
private suspend fun cooldownAfterCall() {
    val jitter = Random.nextLong(0, COOLDOWN_JITTER_MS + 1)
    delay(ONE_MINUTE_MS + jitter)
}
```

**잘 만든 이유:**
- 🎛️ **2중 제어**: Semaphore(동시성 상한) + delay(호출 간격) → 복합적 Rate Limit 대응
- 🎲 **Jitter 적용**: 동일 시점 요청 몰림 방지 → 실제 운영 환경에서의 안정성
- 📊 **로깅**: 각 파일의 진행 상황을 `(order / total)` 형태로 추적 가능

### ⭐ 6.3. 정교한 Diff 파서 (GithubDiffUtils)

**345줄에 달하는 정교한 Diff 파서**를 직접 구현하여, GitHub의 Unified Diff 포맷을 완전히 파싱합니다.

```
핵심 구현 포인트:

1. parseFileMetas() — 파일 단위 메타정보 수집
   - 삭제 파일 감지 (deleted file mode, /dev/null)
   - import 라인을 제외한 +/- 카운트
   - 의미 있는 변경 라인만 수집

2. buildRequests() — Hunk 단위 멀티라인 범위 추출
   - @@ 헤더에서 old/new 라인 번호 추적
   - + 라인의 연속 블록을 RIGHT 범위로 수집
   - - 라인만 있는 블록을 LEFT 범위로 수집
   - import 라인은 라인 번호만 진행 (스니펫에서 제외)

3. 두 가지 리뷰 모드 지원
   - buildReviewContextsByFile(): 파일 단위 리뷰 (요약용)
   - buildReviewContextsByMultiline(): 멀티라인 범위 리뷰 (코드 인라인 코멘트용)
```

**잘 만든 이유:**
- 🎯 **노이즈 제거**: import, 삭제, 공백만 변경된 파일을 자동 필터링 → AI가 핵심 로직에만 집중
- 📐 **정확한 라인 추적**: `oldLine`/`newLine` 카운터로 GitHub API가 요구하는 정확한 라인 번호 계산
- 🔀 **LEFT/RIGHT 사이드 분리**: 추가(RIGHT)와 삭제(LEFT) 변경을 분리하여 GitHub의 멀티라인 코멘트 API 요구사항 충족

### ⭐ 6.4. Timing Attack 방어 — Constant-Time 서명 검증

Webhook 서명 검증에서 **Timing Attack을 방어하는 상수 시간 비교**를 직접 구현했습니다.

```kotlin
object GithubSignature {
    private fun constantTimeEquals(a: String, b: String): Boolean {
        if (a.length != b.length) return false
        var r = 0
        for (i in a.indices) r = r or (a[i].code xor b[i].code)
        return r == 0  // 모든 문자를 비교한 후에야 결과 반환
    }
}
```

**잘 만든 이유:**
- 🔐 **보안 모범 사례**: 일반 `==` 비교는 첫 불일치 문자에서 즉시 반환 → 응답 시간 차이로 서명 유추 가능
- ⏱️ **상수 시간**: XOR 연산을 OR로 누적하여 모든 문자를 항상 비교 → 응답 시간이 일정
- 🏛️ **HMAC-SHA256**: 표준 알고리즘으로 서명 생성 후 상수 시간 비교 → 완전한 보안 체인

### ⭐ 6.5. GitHub App 인증 — JWT + Installation Token 캐싱

GitHub App의 복잡한 인증 플로우를 깔끔하게 구현하고, **토큰 캐싱으로 불필요한 API 호출을 최소화**했습니다.

```kotlin
@Component
class GithubAppTokenProvider(...) {
    @Volatile private var cachedToken: String? = null
    @Volatile private var expiresAt: Instant? = null

    fun getInstallationToken(installationId: String): String {
        val now = Instant.now()
        // 만료 30초 전까지 캐시된 토큰 재사용
        if (cachedToken != null && expiresAt?.isAfter(now.plusSeconds(30)) == true) {
            return cachedToken!!
        }
        // JWT 생성 → Installation Token 발급
        val jwt = generateJwt()  // RS256으로 서명, 9분 유효
        // ... API 호출로 토큰 교환
    }
}
```

**잘 만든 이유:**
- 💾 **토큰 캐싱**: 매 요청마다 토큰을 발급하지 않고, 만료 30초 전까지 재사용
- 🧵 **Thread-Safety**: `@Volatile` 어노테이션으로 멀티스레드 환경에서의 가시성 보장
- ⏰ **만료 여유**: 정확한 만료 시간 대신 30초 버퍼를 두어 토큰 만료 직전 요청 실패 방지
- 🔑 **JWT 설계**: GitHub 권장사항에 따라 유효기간을 9분으로 설정 (최대 10분)

### ⭐ 6.6. Sealed Class 기반 다형성 — ReviewType

리뷰 타입을 `sealed class`로 모델링하여 **컴파일 타임에 모든 타입을 강제 처리**합니다.

```kotlin
sealed class ReviewType {
    data class ByComment(...)   : ReviewType()  // PR 전체 코멘트
    data class ByFile(...)      : ReviewType()  // 파일 단위 코멘트
    data class ByMultiline(...) : ReviewType()  // 멀티라인 인라인 코멘트

    // 각 타입이 GitHub API 페이로드 형식을 스스로 알고 있음
    abstract fun toPayloadMap(body: String, commitId: String): Map<String, String>
}
```

**잘 만든 이유:**
- 🔒 **타입 안전성**: `when` 분기에서 `else`가 불필요 — 새 타입 추가 시 컴파일 에러로 누락 방지
- 🧩 **자기 서술적**: 각 ReviewType이 자신의 API 페이로드 형식을 직접 정의 → OCP(개방-폐쇄 원칙) 준수
- 📦 **캡슐화**: `path()` 함수로 타입별 경로 접근 통일

### ⭐ 6.7. Gemini Streaming 응답 + Thinking 모드 활용

```kotlin
client.models.generateContentStream(
    model.modelName,
    prompt,
    GenerateContentConfig.builder()
        .systemInstruction(systemInstruction(systemPrompt))
        .apply { if (model.thinkable) thinkingConfig(thinkingConfig) }  // 조건부 Thinking 모드
        .build()
).use { stream ->
    buildString {
        for (response in stream) append(response.text())  // Streaming 수집
    }
}
```

**잘 만든 이유:**
- 🧠 **Thinking 모드 조건부 활성화**: 모델별로 `thinkable` 플래그를 관리하여 지원하는 모델만 Thinking Budget(1024) 할당
- 📡 **Streaming 처리**: 대용량 응답도 메모리 효율적으로 처리
- 🔄 **모델 추상화**: `GeminiTextModel` enum으로 모델별 RPM/TPM/RPD 한도를 관리 — 모델 교체가 용이

---

## 7. 인증 · 보안

### 인증 흐름 다이어그램

```
┌───────────────────────────────────────────────────────────────────┐
│                    GitHub Webhook 수신 경로                        │
│                                                                   │
│  Webhook Secret ──▶ HMAC-SHA256 서명 ──▶ Constant-Time 검증      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                    GitHub API 호출 경로                            │
│                                                                   │
│  App Private Key ──▶ JWT(RS256) 생성                              │
│       │                                                           │
│       ▼                                                           │
│  POST /app/installations/{id}/access_tokens                       │
│       │                                                           │
│       ▼                                                           │
│  Installation Token 발급 ──▶ 캐싱 (만료 30초 전까지 재사용)        │
│       │                                                           │
│       ▼                                                           │
│  Bearer Token으로 GitHub API 호출                                  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### 보안 적용 사항

| 보안 항목 | 구현 방식 |
|-----------|-----------|
| Webhook 무결성 | HMAC-SHA256 + Constant-Time 비교 |
| GitHub 앱 인증 | RSA Private Key → JWT → Installation Token |
| 시크릿 관리 | 환경 변수 주입 (application.yaml에 직접 노출 없음) |
| Docker 보안 | 비루트 사용자(`appuser`) 생성 및 `USER appuser`로 실행 |
| Diff 읽기 | GitHub PAT로 분리 관리 |
| CI/CD 시크릿 | GitHub Secrets로 관리, 워크플로우에서 참조 |

---

## 8. CI/CD 및 배포 파이프라인

### 3-Stage 파이프라인

```
master push ──▶ [Build] ──▶ [Dockerize] ──▶ [Deploy]
```

#### Stage 1: Build (Self-hosted Runner)

```yaml
steps:
  - Checkout → JDK 21 설정 → Gradle 빌드 → JAR 아티팩트 업로드
```

- `./gradlew clean build`로 컴파일 + 테스트 수행
- 빌드 산출물(JAR)을 GitHub Artifacts로 업로드

#### Stage 2: Dockerize

```yaml
steps:
  - JAR 다운로드 → Docker Buildx 설정 → Docker Hub 로그인 → 멀티 아키텍처 빌드 및 푸시
```

- **멀티 아키텍처 지원**: `linux/amd64` + `linux/arm64`로 크로스 플랫폼 빌드
- Docker Buildx를 활용한 효율적 이미지 빌드

#### Stage 3: Deploy (EC2)

```yaml
steps:
  - SSH 키 설정 → ssh-keyscan으로 호스트 키 등록 → SSH로 배포 스크립트 실행
```

- EC2에 SSH 접속 후 환경 변수 전달 + `code-review-deploy.sh` 실행
- `ssh-keyscan`으로 호스트 키를 사전 등록하여 보안 강화

### Dockerfile 설계

```dockerfile
FROM eclipse-temurin:21-jdk

# 보안: 비루트 사용자 생성
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

ARG JAR_FILE=build/libs/*.jar
COPY --chown=appuser:appgroup ${JAR_FILE} app.jar

# 비루트 사용자로 실행
USER appuser

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 9. 적용 방식 (설치 가이드)

### Step 1: GitHub App 생성

1. GitHub → Settings → Developer Settings → **GitHub Apps** → New GitHub App
2. 필수 설정:
   - **Webhook URL**: `https://<YOUR_DOMAIN>/api/code/review`
   - **Webhook Secret**: 랜덤 문자열 생성
   - **Permissions**:
     - Pull Requests: `Read & Write`
     - Contents: `Read`
   - **Subscribe to events**: `Pull request`
3. Private Key 생성 후 `.pem` 파일 다운로드

### Step 2: 환경 변수 설정

```bash
# GitHub App 인증
APP_ID=<GitHub App ID>
APP_PEM=<Private Key 내용 (줄바꿈을 \n으로 치환)>

# Webhook 서명 검증
WEBHOOK_SECRET=<Webhook Secret>

# GitHub API 접근 (diff 조회용)
API_TOKEN_GITHUB=<Personal Access Token>

# Google Gemini AI
GEMINI_API_KEY=<Google AI Studio API Key>
```

### Step 3: 빌드 및 실행

```bash
# 로컬 실행
./gradlew clean build
./gradlew bootRun

# Docker 실행
docker build -t ai-code-reviewer .
docker run -d \
  -p 8080:8080 \
  -e APP_ID=$APP_ID \
  -e APP_PEM=$APP_PEM \
  -e WEBHOOK_SECRET=$WEBHOOK_SECRET \
  -e API_TOKEN_GITHUB=$API_TOKEN_GITHUB \
  -e GEMINI_API_KEY=$GEMINI_API_KEY \
  ai-code-reviewer
```

### Step 4: 리포지토리에 GitHub App 설치

1. GitHub App 설정 → Install App
2. 원하는 리포지토리 선택 후 설치
3. PR을 열면 자동 요약 생성, `review-bot` 라벨 추가 시 상세 리뷰 시작

---

## 10. 프로젝트 구조

```
code-review/
├── .github/
│   └── workflows/
│       └── deploy.yml               # 3-Stage CI/CD 파이프라인
├── src/
│   ├── main/
│   │   ├── kotlin/com/project/codereview/
│   │   │   ├── CodeReviewApplication.kt    # 엔트리포인트
│   │   │   ├── client/                     # 외부 시스템 통합 계층
│   │   │   │   ├── github/
│   │   │   │   │   ├── GithubAppTokenProvider.kt  # JWT → Installation Token
│   │   │   │   │   ├── GithubDiffClient.kt        # PR diff 조회
│   │   │   │   │   ├── GithubDiffUtils.kt         # diff 파싱/필터링 (345줄)
│   │   │   │   │   └── GithubReviewClient.kt      # 리뷰 코멘트 게시
│   │   │   │   ├── google/
│   │   │   │   │   └── GoogleGeminiClient.kt      # Gemini AI 연동 (Streaming)
│   │   │   │   └── util/
│   │   │   │       └── ReviewPrompts.kt           # 프롬프트 엔지니어링
│   │   │   ├── core/                       # 비즈니스 로직 계층
│   │   │   │   ├── controller/
│   │   │   │   │   └── CodeReviewController.kt    # Webhook 엔드포인트
│   │   │   │   ├── service/
│   │   │   │   │   ├── CodeReviewFacade.kt        # 이벤트 라우터 (Facade)
│   │   │   │   │   ├── CodeReviewService.kt       # 상세 리뷰 로직
│   │   │   │   │   ├── CodeSummaryService.kt      # 요약 생성 로직
│   │   │   │   │   └── ReviewJobQueue.kt          # Channel 기반 작업 큐
│   │   │   │   └── util/
│   │   │   │       └── GithubSignature.kt         # HMAC-SHA256 서명 검증
│   │   │   └── domain/                     # 도메인 모델 계층
│   │   │       ├── model/
│   │   │       │   ├── GeminiTextModel.kt         # AI 모델 정의 (RPM/TPM 관리)
│   │   │       │   ├── GithubActionType.kt        # PR 액션 타입 enum
│   │   │       │   ├── GithubEvent.kt             # Webhook 이벤트 타입 enum
│   │   │       │   ├── GithubPayloadDtos.kt       # Webhook 페이로드 DTO
│   │   │       │   ├── GithubReviewDtos.kt        # 리뷰 컨텍스트 + ReviewType (sealed)
│   │   │       │   └── ReviewModels.kt            # Gemini 모델 설정
│   │   │       └── port/
│   │   │           ├── AiClient.kt                # AI 클라이언트 인터페이스
│   │   │           └── GitHostClient.kt           # Git 호스트 인터페이스
│   │   └── resources/
│   │       └── application.yaml           # 환경 변수 기반 설정
│   └── test/
│       └── kotlin/com/project/codereview/
│           └── CodeReviewApplicationTests.kt
├── Dockerfile                             # 비루트 사용자, JDK 21
├── build.gradle.kts                       # Kotlin DSL 빌드 설정
└── settings.gradle.kts
```

---

## 11. 향후 발전 방향

| 방향 | 설명 |
|------|------|
| **리뷰 결과 피드백 루프** | 개발자가 리뷰를 수용/거부한 이력을 학습하여 프롬프트 개선 |
| **다국어 리뷰 지원** | 시스템 프롬프트를 언어별로 분리하여 영어/한국어 리뷰 선택 |
| **PR 코멘트 기반 대화형 리뷰** | `@review-bot` 멘션으로 특정 코드에 대한 추가 질문/답변 |
| **리뷰 대시보드** | 리뷰 이력, 통계, 가장 많이 지적된 패턴 등을 시각화 |
| **모델 A/B 테스트** | 여러 Gemini 모델의 리뷰 품질을 비교 평가 |
| **Observability 강화** | Prometheus + Grafana로 리뷰 소요 시간, 성공률 등 모니터링 |

---

> **이 프로젝트는 단순한 API 호출 래퍼가 아닌, 실제 운영 환경에서의 Rate Limit, 보안, 비동기 처리, 프롬프트 엔지니어링까지 고려한 프로덕션 레벨의 AI 통합 시스템입니다.**
