### 1. Next.js 및 CSS 렌더링 최적화 (가독성 및 레이아웃)

**문제점 분석:** 폰트가 흐릿하게 보이고 요소 간 여백이 커서 페이지가 잘리는 현상은 웹 뷰를 PDF로 렌더링할 때 `@media print` 제어가 누락되었거나, 브라우저의 기본 인쇄 여백과 웹의 픽셀(px) 기반 여백이 충돌하기 때문입니다.

**해결 가이드라인:**

- **해상도 및 흐림 현상 해결:** 텍스트에 `opacity`, `backdrop-filter`, `mix-blend-mode`와 같은 CSS 속성이 적용되어 있으면 렌더링 엔진에 따라 래스터화(이미지화)되어 흐릿해질 수 있습니다. 인쇄용 CSS에서는 이러한 속성을 모두 비활성화해야 합니다.
- **A4 세로 사이즈 고정 및 여백 제어:** CSS의 `@page` 규칙과 `mm` 단위의 고정 치수를 사용하여 브라우저 독립적인 레이아웃을 구성해야 합니다.
- **페이지 잘림 방지:** 요소가 페이지 중간에서 잘리는 것을 막기 위해 `break-inside: avoid`를 적극 활용합니다.

```css
/* app/globals.css 또는 별도의 print.css */

@media print {
  @page {
    size: A4 portrait; /* A4 세로 고정 */
    margin: 15mm; /* 브라우저 기본 여백을 덮어쓰고 균일한 여백 적용 */
  }

  body {
    width: 210mm;
    /* 웹용 배경색 제거 및 텍스트 대비 극대화 */
    background-color: white !important;
    color: #111111 !important; 
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* 텍스트 흐림 방지: 투명도 및 필터 제거 */
  * {
    opacity: 1 !important;
    filter: none !important;
    text-shadow: none !important;
  }

  /* 컨텐츠 잘림 방지 설정 */
  .section, .project-card, pre, blockquote {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* 불필요한 스크롤바나 웹용 네비게이션 숨김 */
  nav, header, .no-print {
    display: none !important;
  }
}
```

---

### 2. 타이포그래피 및 디자인 시스템 가이드

**문제점 분석:** 현재 여러 폰트 크기와 굵기가 혼용되어 정보의 위계(Hierarchy)가 명확하지 않습니다. 포트폴리오는 제목, 부제목, 본문, 강조 텍스트의 4~5단계로만 폰트 시스템을 제한해야 합니다.

**해결 가이드라인:**
- **폰트 선택:** 높은 가독성을 위해 **Pretendard**를 시스템 폰트로 사용하는 것을 권장합니다.
- **단위:** 반응형 `rem` 대신 인쇄에 일관된 `pt` 또는 고정 `px`를 혼용하여 크기를 통제합니다.
    

**Typography Scale (추천):**

- **H1 (이름/문서 제목):** 24pt / Bold (Font-weight: 700) / Line-height: 1.4
- **H2 (섹션 제목 - Experience, Projects 등):** 18pt / Semi-Bold (600) / Line-height: 1.4 / Margin-bottom: 12px
- **H3 (프로젝트명, 직무명):** 14pt / Bold (700) / Line-height: 1.5
- **Body (일반 본문):** 10.5pt 또는 11pt / Regular (400) / Line-height: 1.6 (가독성을 위한 핵심 라인하이트)
- **Caption (기간, 기술 스택 태그):** 9pt / Medium (500) / 색상: #555555
    

---

### 3. 프로젝트 섹션 재구성 가이드 (깊이 있는 문제 해결 강조)

**문제점 분석:** 현재 Aho-Corasick 라이브러리 프로젝트를 보면 '문제 발생 -> 해결 방식 -> 코드 -> 결과 '가 각각 다른 페이지로 분할되어 있습니다. 이는 발표용으로는 좋으나, 지원자의 사고 과정과 문제 해결 능력을 한눈에 파악하려는 면접관에게는 컨텍스트가 끊기는 느낌을 줍니다.

**해결 가이드라인:**

하나의 프로젝트를 하나의 독립된 카드(컴포넌트)로 구성하여 A4 1~1.5장 내에 밀도 있게 담아냅니다. 특히 STAR 기법(Situation, Task, Action, Result)을 코드 레벨의 고민과 결합하여 서술해야 합니다.

**[추천 섹션 구조]**

1. **Header (Introduction):** 이름 , 연락처 , 한 줄 소개.
    
2. **Core Competencies (핵심 역량):** 단순히 기술 스택(Kotlin, Spring)을 나열하는 것을 넘어, 해당 기술로 어떤 문제를 해결할 수 있는지 서술합니다. [cite_start](https://www.google.com/search?q=%EC%98%88:)
    
3. **Work Experience (업무 경험):** Mobility42 경험. 어떤 비즈니스 임팩트를 냈는지 정량적 수치와 함께 작성합니다.
    
4. **Projects (개인/팀 프로젝트):** (가장 중요한 부분)

- **프로젝트명 & 요약:** Profanity Filter Library - Aho-Corasick 기반 고성능 비속어 필터 라이브러리.
- **기간 및 기여도:**.
- **사용 기술:** Kotlin, Aho-Corasick, Trie 등.
- **Problem (기존의 문제점):** 정규식 방식의 시간 복잡도 선형 증가로 인한 API 응답 지연 (10만 자 기준 85ms 소요).
- **Action (기술적 해결책 & 깊이):** * Aho-Corasick 알고리즘을 도입하여 O(N) 속도 달성.
	- 구간 중첩 판별 로직(Interval Overlap)을 구현하여 정상 단어 오탐지(False Positive) 방지.
- **Result (성과):** 복합 정규식 대비 처리 속도 약 27배 향상 (3.15ms).
- _(선택 사항)_ 핵심 로직 코드 스니펫: 전체 코드가 아닌 `overlaps` 함수 같은 핵심 아이디어가 담긴 3~5줄만 포함합니다.

---

### 4. 포트폴리오 콘텐츠 작성 및 시스템 연동 가이드

# 프로젝트 데이터 파싱 및 렌더링 가이드

프로젝트 포트폴리오 내용 업데이트 시, `/docs/projects` 디렉토리에 위치한 각 프로젝트 폴더를 확인하고 
내부의 모든 마크다운(Markdown) 문서들을 읽어들여 렌더링 구조를 수정해야 합니다. 
Next.js의 `fs` 모듈과 `gray-matter`를 사용하여 빌드 타임에 이 문서들을 읽어와 정적 페이지로 생성하세요.

## 포트폴리오 작성 시 절대 사용해서는 안 되는 표현 체크리스트

포트폴리오 내용 작성 및 수정 시, 아래의 표현들은 신뢰도를 낮추거나 역할을 모호하게 하므로 철저히 배제하고 객관적인 지표와 행동 위주의 서술로 대체해야 합니다.

1. 근거 없는 과장/추상적 표현
- 최고/전문가 (증명 없이 스스로 칭하는 경우)
- 혁신적인/독창적인 (구체적 사례 결여)
- 다재다능한/열정적인/꼼꼼한 (객관적 지표 없는 성격 묘사)
- ~을 잘하는/매우 흥미로웠던 (주관적 감정 서술)

2. 수동적이거나 역할이 불분명한 표현
- ~을 도왔다 (Helped) / 참여했다 (Participated in)
- ~을 담당했다 (Responsible for) / ~을 관리했다 (Handled/Managed)
- ~을 배웠다 (Learned - 역량 증명에 부적합)

3. 모호한 수준 표현
- 기술 스택에 대한 상/중/하, 별점, 점수 표기 (구체적인 사용 사례로 대체할 것)

4. 진부하거나 불필요한 관용구 (클리셰)
- 책임감 있는 (Hard-working/Responsible)
- 상황에 맞춰 유연한 (Flexible/Able to work under pressure)
- 팀 플레이어 (Team player)
- 요구 시 제출 가능 (References available upon request)