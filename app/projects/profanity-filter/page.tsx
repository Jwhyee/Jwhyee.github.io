import { projects } from "@/src/data/projects";
import CodeBlock from "@/src/components/CodeBlock";
import Link from "next/link";
import Markdown from "@/src/components/Markdown";
import Image from "next/image";

export default function ProfanityFilterProjectPage() {
  const project = projects.find((p) => p.id === 'profanity-filter-library');

  if (!project) return <div>Project not found</div>;

  return (
    <main className="bg-zinc-950 min-h-screen py-12 px-4 print:py-0 print:px-0">
      <div className="max-w-[210mm] mx-auto bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0 print:max-w-none print:w-full p-10 md:p-16 print:p-16">
        {/* Back Link */}
        <Link href="/" className="text-zinc-500 hover:text-white mb-12 inline-block transition-colors font-mono text-[8pt] font-bold group no-print">
          <span className="group-hover:-translate-x-1 inline-block transition-transform mr-2">←</span> 
          BACK TO RESUME
        </Link>

        {/* Header */}
        <header className="mb-12 border-b-2 border-white pb-8">
          <h1 className="text-h1 mb-2 tracking-tighter text-white">
            {project.title}
          </h1>
          <p className="text-[12pt] text-zinc-400 font-medium tracking-wide max-w-2xl leading-relaxed">
            <Markdown content={project.overview.description} />
          </p>
          <div className="flex flex-wrap gap-1.5 mt-8">
            {project.overview.techStack.map((tech) => (
              <span key={tech.name} className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded text-[8pt] font-mono border border-zinc-700 uppercase tracking-wider">
                {tech.name}
              </span>
            ))}
          </div>
        </header>

        {/* 1. Why this project? (Motivation) */}
        <section className="mb-16 space-y-6">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            1. Why this project? (Motivation)
          </h2>
          <div className="text-zinc-300 space-y-4 leading-relaxed text-[10.5pt]">
            <p>
              대규모 트래픽이 발생하는 실시간 서비스에서 비속어 필터링은 단순한 기능 그 이상의 의미를 가집니다. 
              기존의 `String.contains` 반복 루프나 복합 정규식(`Regex`) 기반 탐지 방식은 두 가지 치명적인 한계를 가지고 있었습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
              <li><Markdown content="**성능의 선형 저하:** 금칙어 사전의 크기가 커질수록 모든 패턴을 개별적으로 검사해야 하므로 시간 복잡도가 `O(N*K)`로 증가합니다." /></li>
              <li><Markdown content="**변칙 우회의 취약성:** 숫자나 공백을 섞은 변칙 표현(예: &quot;시1발&quot;)을 정규식으로 처리하려면 패턴이 기하급수적으로 복잡해져 성능이 더욱 악화됩니다." /></li>
            </ul>
            <p>
              <Markdown content="이러한 성능 병목을 근본적으로 해결하고, 알고리즘 이론인 **아호코라식(Aho-Corasick)**을 실제 비즈니스 문제에 적용하여 고성능 필터링 엔진을 직접 구축하고자 본 라이브러리를 기획하게 되었습니다." />
            </p>
          </div>
        </section>

        {/* 2. Architecture & Deployment */}
        <section className="mb-16 space-y-8 print:break-inside-avoid">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            2. Architecture & Deployment
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1">
            <div className="space-y-3">
              <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest">Core Architecture</h3>
              <p className="text-zinc-400 text-[10pt] leading-relaxed">
                <Markdown content="Trie 자료구조를 기반으로 **Failure Function**을 결합한 아호코라식 알고리즘을 핵심 엔진으로 채택했습니다. 매칭 실패 시 루트로 돌아가지 않고 최장 공통 접미사 노드로 즉시 이동하여 입력 문자열을 단 한 번만 순회(**O(N)**)하도록 설계했습니다." />
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest">Deployment Process</h3>
              <p className="text-zinc-400 text-[10pt] leading-relaxed">
                <Markdown content="오픈소스 라이브러리로서의 범용성을 위해 **Jitpack**을 배포 저장소로 선택했습니다. GitHub 리포지토리의 태그 릴리즈를 통해 버전 관리를 수행하며, `Gradle` 및 `Maven` 환경에서 별도의 복잡한 설정 없이 의존성을 추가하여 즉시 사용 가능하도록 배포 체계를 구축했습니다." />
              </p>
            </div>
          </div>

          {/* Algorithm Diagram */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mx-1">
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <span className="text-[7pt] font-black text-zinc-500 uppercase tracking-[0.2em]">Aho-Corasick Algorithm & Trie Diagram</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
              </div>
            </div>
            <div className="relative aspect-[16/9] w-full bg-white">
              <Image 
                src="/images/profanity-filter/aho-corasick-tree.png"
                alt="Aho-Corasick Algorithm Structure"
                fill
                className="object-contain p-8 opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </section>

        {/* 3. Problems & Technical Solutions */}
        <section className="mb-16 space-y-10">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            3. Problems & Technical Solutions
          </h2>

          <div className="space-y-12 px-1">
            {/* Problem 1 */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
                Problem 01: Performance Bottleneck
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">정규식 기반 탐지의 극심한 지연</h3>
              <p className="text-[10pt] text-zinc-400 leading-relaxed">
                10만 자 이상의 텍스트에서 수천 개의 금칙어를 탐지할 때, 정규식 엔진은 역추적(Backtracking)과 패턴 수만큼의 반복 검사로 인해 심각한 CPU 점유와 응답 지연을 초래했습니다.
              </p>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution Implementation:</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="모든 금칙어를 Trie 자료구조로 구축하고, 매칭 실패 시 이동할 지점을 미리 계산하는 **Failure Function**을 연결했습니다. 이를 통해 텍스트를 단 한 번만 순회하며 수천 개의 패턴을 동시에 찾아내는 **O(N) 복합 탐색**을 구현하여, 기존 정규식 대비 약 **27배의 성능 향상**을 달성했습니다." />
                  </div>
                </div>
                <CodeBlock 
                  language="kotlin"
                  code={`// Aho-Corasick PayloadTrie를 활용한 O(N) 고속 탐색
// 금칙어 개수가 늘어나도 입력 문자열 순회 횟수는 단 1회로 고정
val detectedBans = trie.parseText(normalizedSentence)
  .map { it.payload.word }
  .distinct()`}
                />
              </div>
            </div>

            {/* Problem 2 */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
                Problem 02: Obfuscation Evasion
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">숫자와 공백을 혼용한 우회 패턴</h3>
              <p className="text-[10pt] text-zinc-400 leading-relaxed">
                사용자들은 금칙어 사이에 숫자나 특수문자를 삽입하여 필터링을 교묘하게 회피합니다. 이를 패턴으로 모두 정의하는 것은 비효율적이었습니다.
              </p>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution Implementation:</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="탐색 수행 전, 설정된 정책(`NUMBERS`, `WHITESPACES`)에 따라 입력 텍스트에서 숫자와 공백을 제거하는 **전처리 정규화(Normalization) 파이프라인**을 도입했습니다. 원본을 훼손하지 않고 내부적으로 정제된 텍스트 스트림에 대해 탐색을 수행함으로써, 변칙적으로 삽입된 방해 요소를 무력화합니다." />
                  </div>
                </div>
                <CodeBlock 
                  language="kotlin"
                  code={`// 정책 기반 정규화(Normalization) 전처리
// NUMBERS, WHITESPACES 정책에 따라 탐색 전 텍스트 정제
private fun applyPolicies(text: String, policies: Set<ProfanityFilterRegex>): String {
    val combinedRegex = policies.joinToString("|") { "(\${it.regex})" }.toRegex()
    return text.replace(combinedRegex, "")
}`}
                />
              </div>
            </div>

            {/* Problem 3 */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
                Problem 03: False Positives
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">정상 단어 내 금칙어 포함 이슈 (&quot;시발점&quot;)</h3>
              <p className="text-[10pt] text-zinc-400 leading-relaxed">
                단순 문자열 제거 방식을 사용하면 의미 있는 정상 단어까지 훼손되는 문제가 발생했습니다. 비속어와 화이트리스트 간의 정교한 구분법이 필요했습니다.
              </p>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution Implementation:</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="탐지된 금칙어의 인덱스 구간과 미리 정의된 **허용 단어(White-list)**의 구간을 비교하는 **Interval Overlap** 로직을 구현했습니다. 금칙어 구간이 허용 단어 구간에 완전히 포함될 경우(예: '시발' ⊂ '시발점') 이를 정상어로 판단하여 제외함으로써 필터링의 정확도를 극대화했습니다." />
                  </div>
                </div>
                <CodeBlock 
                  language="kotlin"
                  code={`// Interval Overlap 검증 로직
// 탐지된 비속어 구간이 허용 단어(WhiteList) 구간 내에 포함되면 무시
val remains = detectedBans.filterNot { ban ->
    detectedAllows.any { allow -> 
        overlaps(ban.start, ban.end, allow.start, allow.end)
    }
}

private fun overlaps(s1: Int, e1: Int, s2: Int, e2: Int) = s1 <= e2 && s2 <= e1`}
                />
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mx-1 print:break-inside-avoid">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 text-center">
              <h4 className="text-white font-black uppercase tracking-widest text-[9pt]">Performance Benchmark Results</h4>
            </div>
            <div className="p-8 space-y-8">
              <div className="relative aspect-[21/9] w-full bg-zinc-950 rounded border border-zinc-800/50 overflow-hidden">
                <Image 
                  src="/images/profanity-filter/benchmark.png"
                  alt="Regex vs Aho-Corasick Performance Comparison"
                  fill
                  className="object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                  <p className="text-[7pt] text-zinc-500 uppercase mb-1">Library (O(N))</p>
                  <p className="text-[12pt] font-black text-emerald-500">3.15 ms</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                  <p className="text-[7pt] text-zinc-500 uppercase mb-1">Complex Regex</p>
                  <p className="text-[12pt] font-black text-red-900">85.89 ms</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                  <p className="text-[7pt] text-zinc-500 uppercase mb-1">Performance Gain</p>
                  <p className="text-[12pt] font-black text-emerald-400">27x</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                  <p className="text-[7pt] text-zinc-500 uppercase mb-1">Time Complexity</p>
                  <p className="text-[12pt] font-black text-blue-500">O(N)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Lessons Learned */}
        <section className="mb-16 space-y-6 print:break-inside-avoid">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            4. Lessons Learned
          </h2>
          <div className="bg-zinc-900/20 p-8 rounded-lg border border-zinc-800/50 space-y-6">
            <div className="space-y-3">
              <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
                <span className="text-emerald-500">●</span> 이론의 실제적 가치 실증
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
                <Markdown content="교과서적인 알고리즘(`Aho-Corasick`, `Trie`)이 실제 비즈니스 환경에서 발생하는 극심한 성능 병목을 어떻게 효율적으로 해결할 수 있는지 체득했습니다. 기술적 선택이 단순한 취향의 문제를 넘어 서비스의 품질(응답 속도, 리소스 절감)과 직결됨을 깊이 이해했습니다." />
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
                <span className="text-emerald-500">●</span> 라이브러리 설계의 범용성 고려
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
                <Markdown content="단순히 기능을 구현하는 것을 넘어, 다른 개발자가 내 코드를 어떻게 사용할지 고민하며 **의존성 주입(DI)**과 **설정 커스텀(Policy)**이 용이한 API 구조를 설계하는 법을 배웠습니다. `Jitpack` 배포 과정을 통해 안정적인 버전 관리와 배포 파이프라인의 중요성을 경험했습니다." />
              </p>
            </div>
          </div>
        </section>

        {/* Footer Link */}
        <footer className="mt-auto pt-12 border-t border-zinc-900 flex justify-between items-center text-[7.5pt] text-zinc-700 font-mono no-print">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-800">
            Return to Main Portfolio
          </Link>
          <span>DEEP DIVE / {project.title.toUpperCase()}</span>
        </footer>
      </div>
    </main>
  );
}
