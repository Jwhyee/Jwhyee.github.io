export interface TechStackBadge {
    name: string;
}

export interface TechnicalPoint {
    problemTitle: string; // Added: "~ 문제 발생" format
    solutionTitle: string; // Added: "~ 방식으로 해결" format
    title: string; // Keep for legacy if needed, but we will use the new ones
    problem: string;
    symptoms?: string[];
    solution: string;
    keyLogic?: string[];
    tags?: string[];
    codeSnippet: string;
    language: string;
    diagram?: {
        type: 'pipeline' | 'fallback' | 'sequence';
        steps: { label: string; description: string }[];
    };
}

export interface DeepDive {
    subSectionName: string;
    point: TechnicalPoint; // One point per page
}

export interface Project {
    id: string;
    title: string;
    overview: {
        description: string;
        intro: string;
        techStack: TechStackBadge[];
        visualPlaceholder: string;
        teamSize: string;
        duration: string;
        contribution: string;
    };
    deepDives: DeepDive[]; // Exactly 2 items for Page 2 & 3
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
        'Kotlin & Spring 기반의 서버 백엔드 개발자로, 스타트업 환경에서 레거시 시스템을 개선하고 신규 서비스를 구축하는 일을 중심으로 경험을 쌓아왔습니다.',
        '단순히 기존 기능을 이전하는 데 그치지 않고, 복잡하게 얽힌 로직을 구조적으로 단순화하여 유지보수성과 가독성을 높이는 것에 집중했습니다.',
        '서비스의 도메인이 코드로 자연스럽게 드러날 수 있도록 설계하는 것을 중요하게 생각하며, 팀 내 공유를 통해 함께 성장하는 개발 문화를 지향합니다.'
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
                    description: '• AI 코드 리뷰 시스템 구축: GitLab/n8n/LM Studio 연동으로 Zero-Budget AI 리뷰 환경을 구축하여 리뷰 병목 해결 및 코드 품질 상향 평준화 달성.'
                },
                {
                    title: '사원 / 글로벌 도메인 설계 및 프레임워크 트러블슈팅', period: '2024.05 - 2025.04',
                    description: '• B2B 해외 배송 SOP 엔진 개발: JSON 스냅샷 기반 데이터 모델링과 동적 상태 추론 로직을 도입하여 글로벌 배송 추적의 데이터 무결성과 유연성 확보.'
                },
                {
                    title: '인턴 / 레거시 성능 최적화 및 비동기 전환',
                    period: '2023.11 - 2024.04',
                    description: '• 비동기 메일 발송 리팩터링: Coroutine async/awaitAll 기반 병렬 처리를 도입하여 동기식 SMTP I/O 병목을 제거하고 API 응답 속도 80% 이상 개선.'
                }
            ]
        }
    ]
};

export const projects: Project[] = [
    {
        id: 'will-done',
        title: 'Will Done',
        overview: {
            description: '업무 시간을 커리어로 연결하는 타임 트래커',
            intro: '코드 한 줄 직접 작성하지 않고, 오직 AI 에이전트 오케스트레이션(Vibe Coding)만으로 구축한 풀스택 데스크톱 생산성 도구입니다. 흩어진 내 업무 시간을 커리어로 연결하는 타임 트래커 역할을 하며, 특히 백엔드 관점에서의 동시성 제어와 폴백 엔진 구현에 집중했습니다.',
            techStack: [
                { name: 'React 19' }, { name: 'Rust' }, { name: 'Tauri v2' },
                { name: 'SQLite' }, { name: 'shadcn/ui' }, { name: 'Framer Motion' }
            ],
            visualPlaceholder: '/images/wil_done_app_image.png',
            duration: '2026.02 - 2026.03',
            teamSize: '1인 개발',
            contribution: '100%'
        },
        deepDives: [
            {
                subSectionName: 'Harness: AI Agent Control Protocol',
                point: {
                    problemTitle: '하네스 이슈 발생',
                    solutionTitle: '하네스 프로토콜 도입 방식으로 해결',
                    title: 'AI 에이전트 제어 불능 문제 발생',
                    problem: 'AI 에이전트가 여러 태스크를 한꺼번에 처리하려다 일부를 누락하거나, 빌드 실패를 무시하고 진행하는 "하네스 문제"가 발생하여 개발 안정성이 저해되었습니다.',
                    symptoms: [
                        '배치 처리 경향: 여러 태스크를 한꺼번에 처리하다 일부만 진행',
                        '검증 없는 진행: 빌드가 깨진 상태로 다음 작업 진행',
                        '문서-코드 불일치: 변경 후 레퍼런스 문서 업데이트 누락',
                        '불완전한 커밋: 커밋 단위가 섞이고 논리성이 깨짐'
                    ],
                    solution: 'GEMINI.md를 통해 에이전트의 행동을 강제하는 "하네스 프로토콜"을 설계했습니다. STRUCTURE.md를 단일 진실 공급원(SSOT)으로 설정하여 문서-코드 동기화 강제하고, PLANNING.md 기반의 3-State Tracking 루프를 도입했습니다.',
                    keyLogic: [
                        'STRUCTURE.md: 현재 구현 상태의 단일 기준(SSOT) 정의',
                        'PLANNING.md: 3-State Tracking으로 단일 작업 강제',
                        'Verification Gate: pnpm build 통과 전 단계 진행 금지',
                        'Atomic Commit Protocol: 레이어/목적별 원자적 커밋 강제'
                    ],
                    tags: ['Pattern: Harness Protocol', 'Impact: 100% Stability'],
                    codeSnippet: `## 2. Planning & Tracking (Strict Single-Tasking)

* **The Workflow Loop (Crucial)**: 
  For every single task, you MUST follow 
  this exact sequence:

  1. Open PLANNING.md and change task
     from - [ ] to - [~].
  2. Write code for ONLY that specific task.
  3. Run verification (pnpm build).
  4. Change - [~] to - [x].`,
                    language: 'markdown'
                }
            },
            {
                subSectionName: 'Reliability: AI Fallback Strategy',
                point: {
                    problemTitle: 'API Rate Limit 제약 문제 발생',
                    solutionTitle: '다중 모델 폴백 엔진 방식으로 해결',
                    title: 'API Rate Limit(429) 제약 문제 발생',
                    problem: '무료 티어 API 특성상 빈번하게 발생하는 Rate Limit(429) 제약과 일시적 서버 불안정으로 인해, 핵심 기능인 "AI 회고 생성" 프로세스가 중단되는 병목이 존재했습니다.',
                    symptoms: [
                        'API Rate Limit (429) 빈번한 발생',
                        '특정 모델의 일시적 응답 지연 및 타임아웃',
                        '보고서 생성 도중 중단으로 인한 데이터 유실 위험'
                    ],
                    solution: '에러 발생 시 캐싱된 마지막 성공 모델을 우선 시도한 후, flash-lite > flash > pro 순서로 시도하는 폴백 엔진을 구축했습니다.',
                    keyLogic: [
                        'Local Cache: DB 캐싱을 통한 마지막 성공 모델 우선 시도',
                        'Model Tiering: Flash-Lite → Flash → Pro 단계적 폴백',
                        'Exponential Backoff: 실패 시 재시도 간격 동적 조정'
                    ],
                    tags: ['Pattern: Fallback Engine', 'Impact: 99% Reliability'],
                    codeSnippet: `// 1. 가용 모델 동적 조회 및 우선순위 정렬
let mut available = fetch_models(&api_key).await?;
available.sort_by_key(|m| match m.name.as_str() {
    n if n.contains("flash-lite") => 1,
    n if n.contains("pro") => 3,
    _ => 2,
});

// 2. 순차적 Failover 실행 및 성공 시 캐시 갱신
for model in available {
    if let Ok(text) = try_generate(&client, &model).await {
        save_last_model(&pool, &model.name).await?;
        return Ok(text);
    }
}`,
                    language: 'rust'
                }
            }
        ],
        conclusion: {
            outcomes: [
                '하네스 프로토콜 도입으로 AI 에이전트 빌드 성공률 100% 유지',
                'Tauri v2를 활용하여 macOS/Windows 크로스 플랫폼 배포 지원',
                '다중 모델 폴백 엔진 도입 후 AI 생성 성공률 99% 달성'
            ],
            retrospective: '도구의 성능보다 "협업 규칙의 엄격성"이 AI 개발의 생산성을 결정짓는 핵심임을 깨달았습니다.'
        }
    },
    {
        id: 'profanity-filter-library',
        title: 'Profanity Filter Library',
        overview: {
            description: 'Aho-Corasick 기반 고성능 비속어 필터 라이브러리',
            intro: '정규식 기반 탐지의 성능 병목을 해결하고, 변칙 우회 패턴을 O(N) 시간 복잡도로 처리하는 Kotlin/Java 라이브러리입니다. 수천 개의 금칙어를 단 한 번의 순회로 필터링하는 고성능 엔진을 구축하여, 복합 정규식 대비 약 27배 빠른 성능을 달성했습니다.',
            techStack: [
                { name: 'Kotlin' }, { name: 'Aho-Corasick' }, { name: 'Trie' },
                { name: 'Jitpack' }, { name: 'Gradle' }, { name: 'OpenJDK 21' }
            ],
            visualPlaceholder: '/images/profanity_benchmark.png',
            duration: '2026.01',
            teamSize: '1인 개발',
            contribution: '100%'
        },
        deepDives: [
            {
                subSectionName: 'Efficiency: Aho-Corasick Engine',
                point: {
                    problemTitle: '변칙 패턴 탐지 성능 저하 문제 발생',
                    solutionTitle: 'Aho-Corasick 알고리즘 방식으로 해결',
                    title: '변칙 패턴 탐지 성능 저하 문제 발생',
                    problem: '금칙어 사전의 크기가 커질수록 모든 패턴을 개별적으로 검사해야 하는 정규식 방식은 시간 복잡도가 선형적으로 증가하여 심각한 CPU 병목을 유발했습니다.',
                    symptoms: [
                        '수천 개의 패턴 개별 검사로 인한 O(N*K) 지연',
                        '10만 자 기준 복합 정규식 탐지 시 85ms 이상 소요',
                        '실시간 트래픽 환경에서의 API 응답 지연 발생'
                    ],
                    solution: 'Trie에 실패 함수(Failure Function) 개념을 결합한 아호코라식 알고리즘을 도입하여, 입력 문자열을 단 한 번만 순회하면서 모든 금칙어를 동시 탐색하도록 최적화했습니다.',
                    keyLogic: [
                        'Normalization: 숫자/공백 제거로 변칙 우회 탐지 가능',
                        'Aho-Corasick: 입력 길이에만 비례하는 O(N) 속도 달성',
                        'Failure Function: 매칭 실패 시 최장 접미사 노드로 즉시 점프'
                    ],
                    tags: ['Algorithm: O(N)', 'Impact: 27x Faster'],
                    codeSnippet: `fun validate(sentence: String) {
    // 1. 정책 기반 전처리 (공백, 숫자 제거)
    val filtered = applyPolicies(sentence)

    // 2. 아호코라식 일차 탐지 (O(N))
    val detectedBans = trie.parseText(filtered)
    
    // 3. 화이트리스트 구간 중첩 제외 처리
    val remains = filterByWhiteList(detectedBans)

    if (remains.isNotEmpty()) {
        throw ProfanityDetectedException(remains)
    }
}`,
                    language: 'kotlin'
                }
            },
            {
                subSectionName: 'Precision: False Positive Prevention',
                point: {
                    problemTitle: '정상 단어 비속어 오탐지 문제 발생',
                    solutionTitle: '구간 중첩 판별 로직 방식으로 해결',
                    title: '정상 단어 비속어 오탐지 문제 발생',
                    problem: "'시발점'과 같이 정상적인 단어 안에 금칙어가 포함된 경우를 구분하지 못해 발생하는 오탐지(False Positive) 문제가 사용자 경험을 저해했습니다.",
                    symptoms: [
                        '정상 단어 내 비속어 포함 시 무조건적 차단',
                        '사용자 경험(UX) 저해 및 운영 리소스 낭비',
                        '변칙 우회 패턴 탐지 시 오탐율 증가'
                    ],
                    solution: '금칙어 탐지 구간과 화이트리스트(White-list) 단어 구간의 중첩 여부를 수학적으로 판별하여 예외 처리 로직을 설계했습니다.',
                    keyLogic: [
                        'Interval Overlap: 두 구간의 시작/끝 인덱스 비교 판단',
                        'White-list Trie: 예외 단어 전용 고속 탐색 트리 구축',
                        'Atomic Precision: 정확한 금칙어 구간만 선별적 차단'
                    ],
                    tags: ['Precision: High', 'Logic: Interval Check'],
                    codeSnippet: `// 구간 중첩 판별: 탐지 구간과 허용 구간이 겹치면 true
private fun overlaps(s1: Int, e1: Int, s2: Int, e2: Int) =
    s1 <= e2 && s2 <= e1

// 탐지된 비속어 중 화이트리스트에 포함된 항목 제거
val realBans = detectedBans.filterNot { ban ->
    detectedAllows.any { allow ->
        overlaps(ban.start, ban.end, allow.start, allow.end)
    }
}`,
                    language: 'kotlin'
                }
            }
        ],
        conclusion: {
            outcomes: [
                '복합 정규식 대비 처리 속도 약 27배 향상 (10만 자 기준 3.15ms)',
                '금칙어 수와 관계없이 일정한 O(N) 응답 속도 보장',
                '구간 중첩 기반 로직으로 오탐율(False Positive) 혁신적 감소'
            ],
            retrospective: '단순한 라이브러리 사용을 넘어, 알고리즘의 동작 원리를 이해하고 비즈니스 요구사항에 맞춰 최적화하는 과정의 중요성을 배웠습니다.'
        }
    },
    {
        id: 'ai-code-review',
        title: 'AI Code Review System',
        overview: {
            description: '사내 인프라 기반 Zero-Budget AI 리뷰 시스템',
            intro: '개인 스터디 시간을 활용해 사내 인프라 기반의 Zero-Budget AI 코드 리뷰 시스템을 구축하여, 리뷰 병목 해결 및 팀 코드 품질 상향 평준화 달성.',
            techStack: [
                { name: 'GitLab' }, { name: 'n8n' }, { name: 'LM Studio' }, { name: 'Webhooks' }
            ],
            visualPlaceholder: '[PLACEHOLDER: AI Code Review Architecture]',
            duration: '2025.08 - 2025.09',
            teamSize: '1인 개발',
            contribution: '100%'
        },
        deepDives: [
            {
                subSectionName: 'Architecture: Zero-Budget Automation',
                point: {
                    problemTitle: '리소스 부족과 리뷰 병목 문제 발생',
                    solutionTitle: 'n8n 기반 자동화 파이프라인 방식으로 해결',
                    title: '리소스 부족과 리뷰 병목 문제 발생',
                    problem: '매니징과 실무를 병행하며 팀원들의 모든 코드를 리뷰하는 데 과도한 피로가 발생했으며, 상용 도구 도입 예산도 전무한 상태였습니다.',
                    symptoms: [
                        'MR 대기 시간 증가로 인한 배포 속도 저하',
                        '신입/인턴 간의 코드 품질 편차 심화',
                        '휴먼 리뷰어의 단순 컨벤션 체크로 인한 집중도 분산'
                    ],
                    solution: 'GitLab Webhook과 n8n 워크플로우를 연동하고, 로컬 LM Studio 서버를 활용해 비용 없이 동작하는 자동 리뷰 시스템을 구축했습니다.',
                    keyLogic: [
                        'Event-Driven: GitLab MR 생성 시 즉시 트리거',
                        'Local LLM: LM Studio를 활용한 보안 및 비용 이슈 해결',
                        'Asynchronous: 리뷰 완료 시 GitLab Comment API 호출'
                    ],
                    tags: ['Cost: Zero', 'Workflow: Automated'],
                    codeSnippet: `// n8n 워크플로우 주요 로직 (JavaScript node)
const mr_diff = items[0].json.diff;
const prompt = \`당신은 시니어 개발자입니다. 
다음 코드의 로직 오류와 컨벤션을 리뷰하세요:
\${mr_diff}\`;

return {
  model: "gpt-oss-20b",
  prompt: prompt,
  max_tokens: 1024
};`,
                    language: 'javascript'
                }
            },
            {
                subSectionName: 'Optimization: Context Filtering',
                point: {
                    problemTitle: 'LLM 컨텍스트 노이즈 문제 발생',
                    solutionTitle: 'Hunk 단위 노이즈 필터링 방식으로 해결',
                    title: 'LLM 컨텍스트 노이즈 및 환각 문제 발생',
                    problem: '거대한 MR Diff 전체를 전달할 경우 토큰 낭비와 환각 현상이 발생하여 리뷰의 정확도가 떨어지는 문제가 있었습니다.',
                    symptoms: [
                        '불필요한 Import/주석 변경에 대한 과도한 피드백',
                        '토큰 제한 초과로 인한 분석 실패',
                        '도메인 맥락과 무관한 일반적인 가이드 반복'
                    ],
                    solution: '변경 사항을 Hunk 단위로 분해하고, 정규식을 통해 로직과 무관한 노이즈(Import, 공백 등)를 제거하여 핵심 코드만 전달하도록 최적화했습니다.',
                    keyLogic: [
                        'Hunk Splitting: 변경된 코드 블록 단위 분석',
                        'Payload Trimming: 프롬프트 페이로드 60% 이상 절감',
                        'Round-Robin: 다수 요청 시 로컬 리소스 부하 분산'
                    ],
                    tags: ['Efficiency: High', 'Context: Optimized'],
                    codeSnippet: `// 핵심 변경사항 추출 (Noise Filtering)
function cleanDiff(diff) {
  return diff.split('\\n')
    .filter(line => 
      (line.startsWith('+') || line.startsWith('-')) &&
      !line.match(/^(\\+|\\-)\\s*(import|package|\\/\\/|\\/\\*)/)
    )
    .join('\\n');
}`,
                    language: 'javascript'
                }
            }
        ],
        conclusion: {
            outcomes: [
                '리뷰 소요 시간 대폭 단축 및 팀 내 코드 품질 상향 평준화',
                '상용 SaaS 대비 연간 수백만 원의 도입 비용 절감',
                '성과 인정 및 개인 주도적 문제 해결 역량 증명'
            ],
            retrospective: '기술적 해결책이 반드시 높은 예산을 필요로 하지 않으며, 오픈소스 도구들의 조합으로도 충분한 비즈니스 가치를 창출할 수 있음을 배웠습니다.'
        }
    }
];
