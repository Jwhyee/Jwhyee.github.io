export interface TechStackBadge {
  name: string;
}

export interface TechnicalPoint {
  title: string;
  problem: string;
  solution: string;
  codeSnippet: string;
  language: string;
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
          title: '주임 / 프로젝트 리딩 (PL) 및 AI 관련 프로젝트',
          period: '2025.04 - 2025.10',
          description: 'AI 기반 코드 리뷰 시스템 설계 및 프로젝트 관리'
        },
        {
          title: '사원 / 사내 배포 서비스 및 차세대 의약품 운송 프로젝트',
          period: '2024.05 - 2025.04',
          description: '신규 의약품 배송 플랫폼 구축 및 배포 자동화 시스템 개발'
        },
        {
          title: '인턴 / 레거시 의약품 운송 유지보수 및 리팩터링',
          period: '2023.11 - 2024.04',
          description: 'PHP 기반 레거시 시스템을 Kotlin/Spring Boot로 전환 준비 및 유지보수'
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
      intro: '코드 한 줄 직접 작성하지 않고, 오직 AI 에이전트 오케스트레이션(Vibe Coding)만으로 구축한 풀스택 데스크톱 생산성 도구입니다. 흩어진 내 업무 시간을 커리어로 연결하는 타임 트래커 역할을 하며, 타임 시프트 엔진과 AI 회고 기능 구현했습니다.',
      techStack: [
        { name: 'React 19' },
        { name: 'TypeScript' },
        { name: 'Tauri v2 (Rust)' },
        { name: 'SQLite (sqlx)' },
        { name: 'Tailwind CSS' },
        { name: 'Gemini CLI' },
        { name: 'Google Antigravity' },
        { name: 'oh-my-opencode' }
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
          codeSnippet: `#[tauri::command]
pub async fn shift_timeline(
    state: State<'_, AppState>,
    start_from: i64,
    delta_minutes: i64
) -> Result<(), String> {
    let mut tasks = state.db.get_tasks_after(start_from).await?;
    
    for task in tasks.iter_mut() {
        // 언플러그드 타임(식사, 회의) 확인
        if let Some(conflict) = check_unplugged_conflict(
            task.planned_start + delta_minutes,
            task.duration
        ) {
            // 충돌 시 태스크 분할 및 시프트
            split_and_reschedule(task, conflict).await?;
        } else {
            // 단순 시간 이동
            task.planned_start += delta_minutes;
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
          solution: '에러 발생 시 즉시 실패를 반환하지 않고, 로컬 캐시 확인 -> Gemini 2.0 Flash-Lite -> Flash -> Pro 순으로 모델의 사양을 조절하며 자동 전환되는 폴백 엔진을 구축했습니다. 각 단계별로 Exponential Backoff 재시도를 적용하여 생성 성공률을 99%까지 끌어올렸습니다.',
          codeSnippet: `async function generateWithFallback(prompt: string): Promise<string> {
  const models = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  
  for (const modelName of models) {
    try {
      return await callGeminiApi({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000 }
      });
    } catch (error) {
      if (isRateLimitError(error)) {
        console.warn(\`Switching to next model after \${modelName} failed\`);
        continue; // 폴백 수행
      }
      throw error;
    }
  }
  throw new Error('All models failed to respond');
}`,
          language: 'typescript'
        }
      }
    ],
    conclusion: {
      outcomes: [
        '100% AI 에이전트 기반 개발로 총 259회 커밋, 약 9,400줄의 코드베이스 구축 성공',
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
      intro: '정규식(Regex) 기반 탐지의 성능 병목을 해결하고, 숫자나 공백을 섞은 변칙 우회 패턴을 O(N) 시간 복잡도로 처리하는 라이브러리입니다. 우아한형제들 기술 블로그의 전략을 참고하여 설계되었으며, 실시간 트래픽 환경에 최적화되어 있습니다.',
      techStack: [
        { name: 'Kotlin 2.0' },
        { name: 'Java 21' },
        { name: 'Aho-Corasick' },
        { name: 'Gradle' },
        { name: 'JUnit 5' }
      ],
      visualPlaceholder: '[PLACEHOLDER: Library Pipeline & Trie Architecture Diagram]'
    },
    deepDives: [
      {
        subSectionName: 'Efficiency: Aho-Corasick & Normalization',
        point: {
          title: '변칙 우회 패턴 탐지를 위한 전처리 및 O(N) 탐색 파이프라인',
          problem: "'시 1발'과 같이 숫자나 공백을 섞은 변칙 패턴을 정규식으로 탐지하려면 패턴이 기하급수적으로 복잡해지며(O(N*M)), 대규모 텍스트 처리 시 성능이 급격히 저하됩니다.",
          solution: '입력 문자열을 정책에 따라 정규화(Normalization)한 후, Aho-Corasick 알고리즘을 사용하여 단 한 번의 스캔(O(N))으로 모든 금칙어를 찾아냅니다. 이를 통해 복합 정규식 대비 약 27배 빠른 성능을 확보했습니다.',
          codeSnippet: `fun findMatches(text: String): List<Match> {
  // 1. 정책 기반 정규화 (O(N))
  val normalized = normalize(text)
  
  // 2. Aho-Corasick Trie 스캔 (O(N))
  val matches = mutableListOf<Match>()
  var currentNode = root
  
  normalized.forEachIndexed { index, char ->
    currentNode = findNextNode(currentNode, char)
    currentNode.outputs.forEach { word ->
      matches.add(Match(
          start = index - word.length + 1,
          end = index,
          value = word
      ))
    }
  }
  return matches
}`,
          language: 'kotlin'
        }
      },
      {
        subSectionName: 'Precision: False Positive Prevention',
        point: {
          title: '구간 중첩 알고리즘을 활용한 지능형 오탐지(False Positive) 방지',
          problem: "'시발점'과 같이 정상적인 단어 안에 금칙어가 포함된 경우, 단순 매칭 방식은 이를 비속어로 오판하여 서비스 경험을 해치는 문제가 발생합니다.",
          solution: "동일한 정규화 정책이 적용된 '허용 단어 Trie'를 별도로 구축했습니다. 금칙어 탐지 구간이 허용 단어 구간 내에 완전히 포함되는지 판단하는 구간 교집합 로직을 통해 정교한 예외 처리를 구현했습니다.",
          codeSnippet: `fun validate(
    profanities: List<Interval>,
    whitelists: List<Interval>
): List<Interval> {
    return profanities.filter { p ->
        // 금칙어가 허용 단어 구간에 
        // 완전히 포함되지 않는 경우만 필터링
        whitelists.none { w -> 
            w.start <= p.start && 
            w.end >= p.end 
        }
    }
}

data class Interval(
    val start: Int, 
    val end: Int
)`,
          language: 'kotlin'
        }
      }
    ],
    conclusion: {
      outcomes: [
        '복합 정규식 대비 약 27배 빠른 처리 속도 달성 (10만 자 기준 3.15ms)',
        'O(N) 시간 복잡도 유지를 통해 금칙어 개수 증가와 무관한 안정적 성능 보장',
        '숫자/공백 혼용 등 다양한 변칙 우회 패턴 완벽 방어',
        '오픈소스 라이브러리(Maven Central 예정) 형태로 재사용성 극대화'
      ],
      retrospective: '알고리즘의 효율성이 실제 서비스의 사용자 경험과 비용에 얼마나 큰 영향을 미치는지 체감한 프로젝트였습니다. 특히 Aho-Corasick의 Trie 구조를 활용해 메모리와 속도 사이의 트레이드오프를 최적화하는 과정이 인상 깊었습니다. 향후에는 한글 자모 분리 탐지 기능을 추가하여 더욱 강력한 변칙 방어 체계를 구축하고 싶습니다.'
    }
  }
];
