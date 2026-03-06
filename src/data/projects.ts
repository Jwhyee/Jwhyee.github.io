export interface TechStackBadge {
    name: string;
}

export interface Project {
    id: string;
    title: string;
    overview: {
        description: string;
        techStack: TechStackBadge[];
        duration: string;
        teamSize: string;
        contribution: string;
    };
    content: {
        background: string;
        solutions: string[];
        tags: string[];
        code: {
            snippet: string;
            language: string;
            title: string;
        };
    };
    conclusion: {
        outcomes: string[];
        retrospective: string;
    };
}

export interface Career {
    company: string;
    period: string;
    duration: string;
    roles: {
        title: string;
        period: string;
        description: string;
    }[];
    logoPath: string;
}

export interface PersonalInfo {
    name: {
        ko: string;
        en: string;
    };
    jobTitle: string;
    profileImagePath: string;
    contact: {
        github: string;
        phone: string;
        email: string;
        blog: string;
    };
    aboutMe: string[];
    coreTechStack: {
        category: string;
        techs: string[];
    }[];
    career: Career[];
}

export const personalInfo: PersonalInfo = {
    name: {
        ko: '가 준 영',
        en: 'Ka Jun Young'
    },
    jobTitle: 'Backend Developer',
    profileImagePath: '/images/profile_image.jpg',
    contact: {
        github: 'https://github.com/Jwhyee',
        phone: '010-5786-8993',
        email: 'kawnsdud@gmail.com',
        blog: 'https://jwhy-study.tistory.com/'
    },
    aboutMe: [
        'Kotlin & Spring 기반의 서버 백엔드 개발자로, 스타트업 환경에서 레거시 시스템을 구조화하고 고가용성 서비스를 구축하는 데 주력해왔습니다.',
        '복잡하게 얽힌 비즈니스 로직을 도메인 중심으로 단순화하여 유지보수성을 극대화하고, 성능 병목을 기술적으로 해결하는 과정을 즐깁니다.',
        '서비스의 도메인이 코드로 자연스럽게 드러나는 설계를 지향하며, 팀 내 기술 공유와 협업 프로세스 자동화를 통해 동반 성장을 도모합니다.'
    ],
    coreTechStack: [
        {
            category: 'Backend',
            techs: ['Kotlin', 'Java', 'Spring Boot']
        },
        {
            category: 'Architecture & CI/CD',
            techs: ['Github Actions', 'GitLab CI', 'n8n', 'Docker']
        },
        {
            category: 'AI',
            techs: ['Gemini CLI', 'oh-my-opencode', 'LM Studio']
        }
    ],
    career: [
        {
            company: 'Mobility42',
            period: '2023.11 - 2025.10',
            duration: '1년 11개월',
            logoPath: '/images/company_logo.png',
            roles: [
                {
                    title: '주임 / AI 기반 자동화 및 백엔드 아키텍처 리딩',
                    period: '2025.04 - 2025.10',
                    description: '• AI 코드 리뷰 시스템 설계 및 구축: GitLab/n8n/LM Studio 연동 Zero-Budget 리뷰 환경 구축으로 팀 코드 품질 상향 평준화.'
                },
                {
                    title: '사원 / 글로벌 도메인 설계 및 프레임워크 트러블슈팅', period: '2024.05 - 2025.04',
                    description: '• B2B 해외 배송 SOP 엔진 개발: JSON 스냅샷 기반 데이터 모델링으로 글로벌 배송 추적 데이터 무결성 및 유연성 확보.'
                },
                {
                    title: '인턴 / 레거시 성능 최적화 및 비동기 전환',
                    period: '2023.11 - 2024.04',
                    description: '• 비동기 메일 발송 리팩터링: Coroutine async/awaitAll 기반 병렬 처리를 도입하여 SMTP I/O 병목 제거 및 API 응답 80% 개선.'
                }
            ]
        }
    ]
};

export const projects: Project[] = [
    {
        id: 'profanity-filter-library',
        title: 'Profanity Filter Library',
        overview: {
            description: 'Aho-Corasick 알고리즘 기반의 O(N) 고성능 비속어 탐색 엔진 및 라이브러리',
            techStack: [
                { name: 'Kotlin' }, { name: 'Aho-Corasick' }, { name: 'Trie' },
                { name: 'Jitpack' }, { name: 'Gradle' }, { name: 'JUnit5' }
            ],
            duration: '2026.01',
            teamSize: '1인 개발',
            contribution: '100% (기획, 알고리즘 설계, 구현, 배포)'
        },
        content: {
            background: '단순 문자열 매칭(`contains`)이나 정규식(`Regex`)을 활용한 기존의 비속어 필터링은 금칙어 사전의 크기가 커질수록 성능이 선형적으로 저하(**O(N*K)**)되는 고질적인 문제를 안고 있었습니다. 특히 **10,000개 이상의 대규모 금칙어 사전**을 기반으로 **100KB(약 10만 자) 이상의 텍스트 페이로드**에서 복합 정규식을 사용할 경우 **약 85.89ms**의 극심한 응답 지연이 발생했습니다. 이는 실시간 서비스의 SLA를 위협하는 수준이었으며, "시1발"과 같은 변칙 우회 패턴을 잡기 위해 정규식이 복잡해질수록 성능은 기하급수적으로 악화되었습니다. 이를 해결하기 위해 JMH(Java Microbenchmark Harness) 기반의 엄격한 성능 측정을 거쳐, 어떠한 환경에서도 일관된 성능을 보장하는 고성능 엔진을 구축했습니다.',
            solutions: [
                '**Aho-Corasick 알고리즘 엔진 설계:** Trie 구조에 실패 함수(Failure Function)를 결합하여 금칙어 개수와 무관하게 입력 문자열의 길이에만 비례하는 **O(N)** 탐색 속도를 구현했습니다.',
                '**JMH 기반 벤치마크 검증:** 10,000개의 금칙어와 100KB 텍스트 환경에서 복합 정규식 대비 **약 27배 향상된 3.15ms**의 처리 속도를 달성했습니다.',
                '**지능형 정규화(Normalization) 파이프라인:** 탐색 전 단계에서 공백 및 숫자 제거 정책을 적용하여 변칙 우회 패턴을 원천 차단했습니다.',
                '**수학적 구간 중첩(Interval Overlap) 필터링:** 금칙어 탐지 구간과 화이트리스트 구간의 교집합을 판별하는 로직을 구현하여 "시발점" 등 정상 단어를 완벽하게 보존했습니다.'
            ],
            tags: ['Algorithm: O(N)', 'Performance: 27x Faster', 'JMH Benchmarked', 'Open Source'],
            code: {
                title: 'Core Engine: Overlap Detection Logic',
                language: 'kotlin',
                snippet: `// 비속어 탐지 결과 중 화이트리스트(허용 단어) 구간에 포함된 항목 필터링
val remains = detectedBans.asSequence()
    .filterNot { ban ->
        // 금칙어 구간이 허용 단어 구간 내에 포함되는지 수학적으로 판단
        detectedAllows.any { allow -> 
            ban.start >= allow.start && ban.end <= allow.end 
        }
    }
    .map { it.payload.word }
    .distinct()
    .toList()

if (remains.isNotEmpty()) {
    throw ProfanityDetectedException(remains)
}`
            }
        },
        conclusion: {
            outcomes: [
                '**성능 혁신:** 복합 정규식 대비 처리 속도를 **약 27배 향상** (10만 자 기준 **3.15ms** 달성)',
                '**확장성 확보:** 금칙어 데이터가 수천 개로 늘어나도 **O(N)**의 일관된 성능을 유지하는 안정적인 아키텍처 구축',
                '**정확도 개선:** 화이트리스트 기반 예외 처리를 통해 실 서비스 적용 가능한 수준의 오탐 방지 로직 완성'
            ],
            retrospective: '알고리즘적 이론(Trie, Aho-Corasick)을 실제 비즈니스 문제 해결에 적용하여 오픈소스 라이브러리화함으로써 기술적 깊이와 실행력을 실증했습니다. 특히 라이브러리 배포 과정을 통해 범용적인 API 설계의 중요성을 체득했습니다.'
        }
    },
    {
        id: 'ai-code-review',
        title: 'AI Code Review System',
        overview: {
            description: '사내 인프라 기반의 Zero-Budget AI 리뷰 시스템에서 시작하여, Kotlin/Spring Boot 기반의 고성능 GitHub App으로 진화한 AI 코드 리뷰 엔진',
            techStack: [
                { name: 'Kotlin' }, { name: 'Spring Boot 3' }, { name: 'Google Gemini' },
                { name: 'GitHub App' }, { name: 'GitLab' }, { name: 'n8n' }, { name: 'LM Studio' },
                { name: 'Coroutine' }
            ],
            duration: '2025.08 - 2025.09',
            teamSize: '1인 개발',
            contribution: '100% (기획, 아키텍처 설계, 구현)'
        },
        content: {
            background: '임시 팀장으로서 리뷰 병목 현상을 해결하고 신입/인턴의 코드 품질을 상향 평준화하기 위해, 예산 지원 없이 사내 보안 가이드라인을 준수하는 AI 리뷰 시스템 구축이 필요했습니다. 초기 GitLab/n8n/LM Studio 기반에서 성능과 안정성을 극대화하기 위해 Kotlin/Spring Boot 기반의 비동기 아키텍처로 리팩터링했습니다.',
            solutions: [
                '**Zero-Budget 파이프라인 구축:** GitLab Webhook과 n8n, 로컬 LLM(LM Studio)을 연동하여 외부망 노출 없이 동작하는 경제적 자동화 환경을 설계했습니다.',
                '**지능형 Payload Trimming:** 정규식을 활용해 import, 주석, 빈 라인 등 로직과 무관한 노이즈를 **60% 이상 제거**하여 토큰 소모 및 환각 현상을 억제했습니다.',
                '**비동기 워커 아키텍처:** Kotlin Coroutine Channel을 활용한 Producer-Consumer 패턴으로 GitHub/Gemini API의 Rate Limit을 안정적으로 관리하는 작업 큐를 구현했습니다.',
                '**정교한 Diff 파싱 엔진:** Unified Diff 포맷을 분석하여 멀티라인 인라인 코멘트와 AS-IS/TO-BE 제안이 가능한 커스텀 파서를 직접 개발했습니다.'
            ],
            tags: ['Cost: Zero-Budget', 'Performance: Rate Limit Control', 'Architecture: Coroutine Channel', 'Security: HMAC/JWT'],
            code: {
                title: 'Coroutine Channel based Async Job Queue',
                language: 'kotlin',
                snippet: `// Rate Limit 준수를 위한 Channel 기반 비동기 작업 큐
private val channel = Channel<ReviewJob>(capacity = Channel.BUFFERED)
private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

@PostConstruct
fun startWorkers() {
    repeat(workerCount) { idx ->
        scope.launch(CoroutineName("worker-$idx")) {
            for (job in channel) {
                runCatching { 
                    // Semaphore와 Jitter를 활용한 API 호출 제어
                    codeReviewService.review(job) 
                }.onFailure { logger.error("Review failed", it) }
            }
        }
    }
}`
            }
        },
        conclusion: {
            outcomes: [
                '**리뷰 리드타임 70% 단축:** 1차 AI 리뷰 피드백을 통해 휴먼 리뷰어가 핵심 비즈니스 로직에만 집중할 수 있는 환경 조성',
                '**품질 상향 평준화:** 신입 팀원의 컨벤션 오류 즉각 교정 및 에러 리포트 감소로 실제 성과 평가에 긍정적 반영',
                '**인프라 비용 최적화:** 상용 SaaS 대비 연간 수백만 원 규모의 비용을 절감하며 사내 보안 가이드라인 완벽 준수'
            ],
            retrospective: '제한된 자원 환경에서 오픈소스와 AI를 결합하여 실질적인 비즈니스 임팩트를 낸 경험을 통해, 엔지니어의 역할은 "문제를 해결하는 최적의 도구 조합을 설계하는 것"임을 깊이 깨달았습니다.'
        }
    },
    {
        id: 'will-done',
        title: 'Will Done',
        overview: {
            description: '업무 시간(Will)을 설계하고 완료 기록(Done)을 Brag Document로 자동 변환하는 AI 기반 데스크톱 타임 트래커',
            techStack: [
                { name: 'React 19' }, { name: 'Tauri v2' }, { name: 'Rust' },
                { name: 'SQLite' }, { name: 'Gemini API' }, { name: 'Vite 7' }
            ],
            duration: '2026.02 - 2026.03',
            teamSize: '1인 개발 (100% AI-Authored)',
            contribution: '100% (기획, AI 오케스트레이션, 검증 시스템 설계)'
        },
        content: {
            background: '단순 TODO 나열 방식의 기존 앱들은 "시간 설계"가 불가능하고, 긴급 업무 발생 시 전체 일정이 무너지는 한계가 있었습니다. 또한 이직이나 성과 검토 시 과거 업무 내역을 전문적인 문구로 정리하는 데 상당한 리소스가 소모되었습니다. 이를 해결하기 위해 수학적 스케줄링 엔진과 AI 회고 기능을 결합한 도구를 기획했으며, 특히 100% AI 에이전트만으로 풀스택 앱을 구축하는 "바이브 코딩(Vibe Coding)" 실험을 병행했습니다.',
            solutions: [
                '**지능형 타임 시프트 엔진(Time-Shift Engine):** 긴급 태스크 발생 시 현재 진행 업무를 자동으로 분할(Split) 및 보류(Pending)하고, 이후 모든 일정을 수학적으로 재계산하여 밀어내는(Shift) 알고리즘을 구현했습니다.',
                '**다중 모델 폴백(Fallback) 엔진:** Gemini API의 할당량 제한(429)에 대응하여 `로컬 캐시 → flash-lite → flash → pro` 순으로 자동 전환되는 안정적인 AI 파이프라인을 구축했습니다.',
                '**하네스(Harness) 제어 프로토콜:** AI 에이전트의 배치 처리 및 빌드 무시 경향을 해결하기 위해 `STRUCTURE.md`를 SSOT로 활용하고, 단일 작업 루프와 자가 치유(Self-Healing) 검증 게이트를 설계했습니다.',
                '**로컬 퍼스트 아키텍처:** Tauri v2와 SQLite를 활용하여 모든 데이터를 사용자 로컬에 저장함으로써 데이터 주권과 보안을 극대화했습니다.'
            ],
            tags: ['Time-Shift Engine', 'Multi-Model Fallback', 'Harness Protocol', '100% AI Authored'],
            code: {
                title: 'Multi-Model Fallback Strategy (Rust)',
                language: 'rust',
                snippet: `// API 에러 또는 할당량 초과 시 하위 모델로 순차적 폴백 수행
pub async fn generate_with_fallback(prompt: String) -> Result<String, AppError> {
    let models = vec!["gemini-1.5-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"];
    
    for model in models {
        match call_gemini_api(&model, &prompt).await {
            Ok(res) => return Ok(res),
            Err(e) if e.is_quota_limit() => continue, // 429 에러 시 다음 모델 시도
            Err(e) => return Err(e),
        }
    }
    Err(AppError::AiServiceUnavailable)
}`
            }
        },
        conclusion: {
            outcomes: [
                '**생산성 혁신:** 직접 코딩 없이 259회의 커밋과 9,400줄 이상의 풀스택 코드베이스 구축',
                '**안정성 확보:** 하네스 프로토콜 도입으로 AI 에이전트의 빌드 성공률 및 문서 동기화율 **100% 달성**',
                '**성과 자동화:** 업무 기록 기반의 전문적인 Brag Document 생성 프로세스 구축 및 크로스 플랫폼(macOS/Win) 배포'
            ],
            retrospective: 'AI 에이전트가 코드를 작성하는 시대에 개발자의 역할은 "구현자"에서 "시스템 설계자 및 검증자"로 진화해야 함을 실증했습니다. 특히 구조화된 레퍼런스(SSOT)가 AI의 성능을 결정짓는 핵심임을 깨달았습니다.'
        }
    }
];
