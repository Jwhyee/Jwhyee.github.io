export interface TechStackBadge {
  name: string;
}

export interface TechnicalPoint {
  title: string;
  problem: string;
  solution: string;
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
            description: '100% AI 에이전트로 구축한 타임 트래커 & 성과 리포트 자동화 데스크탑 앱',
            intro: '코드 한 줄 직접 작성하지 않고, 오직 AI 에이전트 오케스트레이션(Vibe Coding)만으로 구축한 풀스택 데스크톱 생산성 도구입니다. 흩어진 내 업무 시간을 커리어로 연결하는 타임 트래커 역할을 하며, 특히 백엔드 관점에서의 동시성 제어와 폴백 엔진 구현에 집중했습니다.',
            techStack: [
                {
                    name: 'React 19'
                },
                {
                    name: 'TypeScript'
                },
                {
                    name: 'Tauri v2 (Rust)'
                },
                {
                    name: 'SQLite (sqlx)'
                },
                {
                    name: 'Tailwind CSS'
                },
                {
                    name: 'Gemini CLI'
                },
                {
                    name: 'Google Antigravity'
                },
                {
                    name: 'oh-my-opencode'
                }
            ],
            visualPlaceholder: '/images/wil_done_app_image.png'
        },
        deepDives: [
            {
                subSectionName: 'Core Logic: Time-Shift Engine',
                point: {
                    title: '긴급 업무 대응을 위한 수학적 타임라인 시프트 및 자동 분할 로직',
                    problem: '기존 TODO 앱은 고정된 일정 기반이라 긴급 업무 발생 시 이후 모든 일정을 사용자가 수동으로 조정해야 하는 불편함이 있었습니다. 또한 점심시간이나 회의 등 \'언플러그드 타임\'을 고려하지 못해 일정이 겹치는 문제가 발생했습니다.',
                    solution: 'Rust 백엔드에서 모든 태스크를 타임 블록으로 관리하고, 특정 지점의 시간 변화가 발생하면 이후 모든 블록을 재귀적으로 밀어내거나 당기는(Shift) 엔진을 구현했습니다. 특히 고정된 금지 시간대를 만날 경우 태스크를 자동으로 분할(Split)하여 유연한 스케줄링을 보장합니다.',
                    codeSnippet: `#[tauri: :command]
pub async fn shift_timeline(
    state: State<'_, AppState>,
    start_from: i64,
    delta_minutes: i64
) -> Result<(), String> {
    let mut tasks = state.db
        .get_tasks_after(start_from)
        .await?;
    
    for task in tasks.iter_mut() {
        let new_start = task.planned_start + delta_minutes;
        
        // 언플러그드 타임(식사, 회의) 확인
        if let Some(conflict) = 
            check_unplugged_conflict(new_start, task.duration) 
        {
            // 충돌 시 태스크 분할 및 시프트
            split_and_reschedule(task, conflict).await?;
        } else {
            // 단순 시간 이동
            task.planned_start = new_start;
            state.db.update_task(task).await?;
        }
    }
    Ok(())
}`,
                    language: 'rust'
                }
            },
            {
                subSectionName: 'Reliability: AI Fallback Strategy',
                point: {
                    title: 'API 제약(429) 극복을 위한 다중 모델 폴백 및 자동 재시도 시스템',
                    problem: 'Gemini API의 무료 티어 사용 시 빈번한 Rate Limit(429 에러)과 일시적 서버 불안정으로 인해 AI 성과 보고서 생성 기능이 중단되는 사용자 경험 저하 문제가 있었습니다.',
                    solution: '에러 발생 시 캐싱된 마지막 성공 모델을 우선 시도한 후, API에서 사용 가능한 모델 목록을 가져와 flash-lite > flash > pro 순서로 시도하는 폴백 엔진을 구축했습니다. 성공한 모델명을 캐싱하여 다음 요청 시 우선 시도함으로써 생성 성공률을 90%까지 끌어올렸습니다.',
                    diagram: {
                        type: 'fallback',
                        steps: [
                            {
                                label: 'Last Successful Model', description: 'DB에 캐싱된 마지막 성공 모델 우선 시도'
                            },
                            {
                                label: 'Flash-Lite (동적)', description: 'API에서 가져온 모델 중 flash-lite 계열 우선'
                            },
                            {
                                label: 'Flash (동적)', description: '표준 성능 flash 계열 모델로 재시도'
                            },
                            {
                                label: 'Pro (동적)', description: '최종 고성능 pro 계열 모델로 재시도'
                            }
                        ]
                    },
                    codeSnippet: `// Rust 백엔드: 동적 모델 폴백 엔진 (retrospective.rs)
let mut models_to_try = Vec::new();

// 1. 마지막 성공 모델 캐시 우선 시도
if let Some(ref cached_model) = user.last_successful_model {
    models_to_try.push(cached_model.clone());
}

// 2. API에서 사용 가능한 모델 동적 조회 및 우선순위 정렬
let available = internal_fetch_available_models(&api_key).await?;
available.sort_by(|a, b| {
    // flash-lite(3) > flash(2) > pro(1) 우선순위
    let score = |name: &str| match () {
        _ if name.contains("flash-lite") => 3,
        _ if name.contains("flash") => 2,
        _ if name.contains("pro") => 1,
        _ => 0,
    };
    score(&b.name).cmp(&score(&a.name))
});

for model in models_to_try {
    match try_generate_content(&client, &model, &prompt).await {
        Ok(text) => {
            // 성공 모델 DB 캐싱
            database::user::save_last_model(&pool, &model.name).await?;
            return Ok(text);
        }
        Err(e) => { eprintln!("Model {} failed: {}", model.name, e); continue; }
    }
}
Err("All Gemini models failed".into())`,
                    language: 'rust'
                }
            }
        ],
        conclusion: {
            outcomes: [
                'Tauri v2를 활용하여 단일 코드베이스로 macOS(ARM/Intel) 및 Windows 크로스 플랫폼 배포 지원',
                '다중 모델 폴백 엔진 도입 후 AI 생성 기능 성공률 99% 달성',
                'GitHub Actions를 통한 바이너리 서명 및 자동 업데이트 파이프라인 구축'
            ],
            retrospective: 'AI가 코드를 작성하는 시대에 개발자의 역할이 \'구현자\'에서 \'오케스트레이터\'로 변화하고 있음을 체감했습니다. 특히 하네스(Harness) 문제 해결을 위한 Planning Loop와 구조화된 레퍼런스 문서 시스템 설계는 AI 협업의 핵심임을 깨달았습니다. 향후에는 사용자 패턴을 학습하여 일정을 최적화하는 온디바이스 학습 기능을 추가해보고 싶습니다.'
        }
    },
  {
        id: 'profanity-filter-library',
        title: 'Profanity Filter Library',
        overview: {
            description: 'Aho-Corasick 알고리즘 기반의 고성능 비속어 필터링 라이브러리',
            intro: '정규식(Regex) 기반 탐지의 성능 병목을 해결하고, 숫자나 공백을 섞은 변칙 우회 패턴을 O(N) 시간 복잡도로 처리하는 Kotlin/Java 라이브러리입니다. 우아한형제들 기술 블로그의 금칙어 관리 전략을 참고하여 설계했으며, 실시간 트래픽 환경에서도 안정적으로 동작하도록 최적화했습니다.',
            techStack: [
                { name: 'Kotlin 1.9' },
                { name: 'Java 21' },
                { name: 'Aho-Corasick (PayloadTrie)' },
                { name: 'Gradle (Version Catalog)' },
                { name: 'Kotest 5' }
            ],
            visualPlaceholder: '/images/profanity_benchmark.png'
        },
        deepDives: [
            {
                subSectionName: 'Efficiency: Aho-Corasick & Normalization Pipeline',
                point: {
                    title: '정책 기반 정규화와 O(N) 다중 패턴 탐색 파이프라인',
                    problem: "'시 1발'과 같이 숫자나 공백을 섞은 변칙 패턴을 정규식으로 탐지하려면, 모든 문자 사이에 선택적 패턴을 삽입해야 하므로 정규식 복잡도가 기하급수적으로 증가합니다. 10만 자 기준으로 Complex Regex는 85.89ms가 소요되어 실시간 서비스에 적용이 어렵습니다.",
                    solution: 'ProfanityFilterRegex 정책에 따라 입력 문자열을 정규화한 뒤, ahocorasick 라이브러리의 PayloadTrie를 활용해 단 한 번의 스캔(O(N))으로 모든 금칙어를 탐색합니다. 정규화 + Trie 탐색 + 허용 단어 검증까지 포함하고도 3.15ms로 처리되어, Complex Regex 대비 약 27배 빠른 성능을 확보했습니다.',
                    diagram: {
                        type: 'pipeline',
                        steps: [
                            { label: 'applyPolicies', description: '정책 기반 정규화 (숫자/공백 제거)' },
                            { label: 'trie.parseText', description: 'PayloadTrie 기반 Aho-Corasick 탐색' },
                            { label: 'Overlap Filtering', description: '허용 단어 구간과의 중첩 판별' }
                        ]
                    },
                    codeSnippet: `fun validate(sentence: String) {
    if (sentence.isBlank()) return

    // 1. 정책 기반 전처리 (공백, 숫자 제거 등)
    val filtered = applyPolicies(sentence, defaultPolicies)

    // 2. 일차 탐지
    val detectedBans = trie.parseText(filtered)
    if (detectedBans.isEmpty()) return

    // 3. 허용 단어(WhiteList) 제외 처리
    val allowTrie = getAllowTrie(defaultPolicies)
    val detectedAllows = allowTrie.parseText(filtered)

    val remains = detectedBans.asSequence()
        .filterNot { ban ->
            detectedAllows.any { allow ->
                overlaps(ban.start, ban.end, allow.start, allow.end)
            }
        }
        .map { it.payload.word }
        .distinct()
        .toList()

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
                    title: '구간 중첩(Overlaps) 알고리즘을 활용한 지능형 오탐지 방지',
                    problem: "'시발점'과 같이 정상적인 단어 안에 금칙어가 포함된 경우, 단순 매칭 방식은 이를 비속어로 오판하여 서비스 경험을 해치는 문제가 발생합니다.",
                    solution: "동일한 정규화 정책이 적용된 '허용 단어 PayloadTrie'를 ConcurrentHashMap으로 캐싱하여 별도로 구축합니다. 금칙어 탐지 구간이 허용 단어 구간과 겹치는지(overlaps) 판단하는 구간 중첩 로직을 통해 오탐지를 필터링합니다.",
                    diagram: {
                        type: 'pipeline',
                        steps: [
                            { label: 'detectedBans', description: '금칙어 탐지 구간 추출' },
                            { label: 'getAllowTrie', description: '정책별 허용 단어 Trie 캐시 조회' },
                            { label: 'overlaps Check', description: '구간 중첩 여부 판별 후 필터링' }
                        ]
                    },
                    codeSnippet: `// 구간 중첩 판별: 두 구간이 겹치면 true
private fun overlaps(s1: Int, e1: Int, s2: Int, e2: Int) =
    s1 <= e2 && s2 <= e1

// 허용 단어 Trie를 정책 조합별로 캐싱
private fun getAllowTrie(
    policies: Set<ProfanityFilterRegex>
): PayloadTrie<String> {
    return allowTrieCache.computeIfAbsent(policies) { key ->
        val builder = PayloadTrie.builder<String>()
        allowWords.forEach { word ->
            val normalized = applyPolicies(word, key)
            if (normalized.isNotBlank())
                builder.addKeyword(normalized, normalized)
        }
        builder.build()
    }
}`,
                    language: 'kotlin'
                }
            }
        ],
        conclusion: {
            outcomes: [
                'Complex Regex 대비 약 27배 빠른 처리 속도 달성 (10만 자 기준 3.15ms vs 85.89ms)',
                'O(N) 시간 복잡도를 유지하여 금칙어 수 증가와 무관한 안정적 성능 보장',
                '숫자/공백 혼용 등 다양한 변칙 우회 패턴 방어 및 구간 중첩 기반 오탐지 방지',
            ],
            retrospective: '알고리즘의 효율성이 실제 서비스의 사용자 경험과 비용에 얼마나 큰 영향을 미치는지 체감한 프로젝트였습니다. 특히 외부 라이브러리(org.ahocorasick)의 PayloadTrie를 활용하되, 정규화 정책과 허용 단어 캐싱 시스템을 직접 설계하여 단순한 라이브러리 래핑이 아닌 문제 해결 중심의 아키텍처를 구현했습니다. 향후에는 한글 자모 분리 탐지(ㅅㅂ → 씨발) 정책을 추가하여 더욱 강력한 변칙 방어 체계를 구축하고 싶습니다.'
        }
    }
];
