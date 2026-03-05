import { projects } from "@/src/data/projects";
import CodeBlock from "@/src/components/CodeBlock";
import Link from "next/link";
import Markdown from "@/src/components/Markdown";
import Image from "next/image";

export default function WillDoneProjectPage() {
  const project = projects.find((p) => p.id === 'will-done');

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
              커리어 성장을 위해서는 꾸준한 기록이 필수적이지만, 바쁜 업무 속에서 &quot;오늘 무엇을 했는지&quot;를 매번 정리하는 것은 큰 심리적 부하를 줍니다. 
              기존의 TODO 앱들은 할 일을 나열하는 데 그칠 뿐, 실제 업무 시간의 유동성을 반영하지 못하고 성과 문서화 단계로 이어지지 못하는 한계가 있었습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
              <li><Markdown content="**일정의 경직성:** 긴급 회의나 업무가 발생하면 계획된 타임라인이 무너지고, 이를 수동으로 조정하는 데 시간이 낭비됩니다." /></li>
              <li><Markdown content="**기억의 휘발성:** 이직이나 연봉 협상 시점에 과거의 구체적인 성과와 트러블슈팅 내역을 복기하기 어렵습니다." /></li>
            </ul>
            <p>
              <Markdown content="이러한 문제를 해결하기 위해 **지능형 타임 시프트(Time-Shift)**와 **AI 기반 Brag Document 자동화**를 결합한 도구를 기획했습니다. 또한, 개발 방식에 있어서도 직접 코딩하지 않고 AI 에이전트만을 오케스트레이션하여 제품을 완성하는 **&quot;바이브 코딩(Vibe Coding)&quot;**을 실증하고자 했습니다." />
            </p>
          </div>
        </section>

        {/* 2. Architecture & Vibe Coding Strategy */}
        <section className="mb-16 space-y-8 print:break-inside-avoid">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            2. Architecture & Vibe Coding Strategy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1">
            <div className="space-y-3">
              <h3 className="text-[9pt] font-black text-emerald-500 uppercase tracking-widest">Core Engine Architecture</h3>
              <p className="text-zinc-400 text-[10pt] leading-relaxed">
                <Markdown content="**Tauri v2**와 **Rust**를 기반으로 한 로컬 퍼스트 아키텍처를 채택했습니다. 모든 데이터는 `SQLite`에 저장되어 보안과 속도를 동시에 확보했으며, Rust의 강력한 타입 시스템과 비동기(`Tokio`) 처리를 통해 복잡한 스케줄링 연산을 안정적으로 수행합니다." />
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-[9pt] font-black text-emerald-500 uppercase tracking-widest">AI Orchestration (Vibe Coding)</h3>
              <p className="text-zinc-400 text-[10pt] leading-relaxed">
                <Markdown content="직접 코드를 작성하는 대신, **Gemini CLI, Antigravity, oh-my-opencode** 등 다수의 AI 에이전트를 적재적소에 배치했습니다. 인간의 역할은 구현자가 아닌, 구조화된 레퍼런스(`STRUCTURE.md`, `GUIDE.md`)를 설계하고 AI의 작업물을 검증하는 **&quot;시스템 설계자&quot;**에 집중되었습니다." />
              </p>
            </div>
          </div>

          {/* App Preview Image */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mx-1">
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <span className="text-[7pt] font-black text-zinc-500 uppercase tracking-[0.2em]">Application Preview & System Architecture</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
              </div>
            </div>
            <div className="relative aspect-[16/9] w-full bg-zinc-950">
              <Image 
                src="/images/will-done/app-main-image.png"
                alt="Will Done App Main Interface"
                fill
                className="object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity"
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
                Problem 01: Schedule Resilience
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">동적인 업무 환경에서의 스케줄링 붕괴</h3>
              <p className="text-[10pt] text-zinc-400 leading-relaxed">
                일반적인 타임 트래커는 고정된 블록 방식을 사용하여 긴급 업무나 조기 종료 시 전체 타임라인을 수동으로 밀거나 당겨야 하는 번거로움이 있었습니다.
              </p>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution: Time-Shift Engine</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="실시간 일정 변화를 수학적으로 계산하여 자동 조정하는 **지능형 타임 시프트(Time-Shift) 엔진**을 구현했습니다. 긴급 업무 삽입 시 현재 작업을 즉시 분할(Split)하여 `PENDING`으로 전환하고 후속 일정을 밀어내며, 점심시간 등 고정 제외 시간을 인식하여 업무 블록을 최적으로 재배정합니다." />
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-[9pt] ml-1">
                  <li><Markdown content="**Urgent Task Injection:** 현재 업무 중단 및 소요 시간만큼 이후 모든 일정 자동 시프트" /></li>
                  <li><Markdown content="**Unplugged Time Avoidance:** 고정 시간대(점심, 회의)를 회피하여 업무 블록 자동 분할 배정" /></li>
                </ul>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
                Problem 02: AI Service Reliability
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">API 할당량 초과 및 서버 에러 대응</h3>
              <p className="text-[10pt] text-zinc-400 leading-relaxed">
                Gemini API의 Free Tier 사용 시 할당량 제한(429)으로 인해 성과 분석 기능이 중단되는 리스크가 있었습니다.
              </p>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution Implementation: Multi-Model Fallback</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="서비스 가용성을 극대화하기 위해 **다중 모델 폴백(Multi-Model Fallback) 엔진**을 설계했습니다. API 호출 실패 시 에러 코드를 분석하여 `로컬 캐시 → flash-lite → flash → pro` 순으로 자동 전환하며 재시도하는 복구 로직을 통해, 어떤 상황에서도 성과 분석 서비스가 유지되도록 구축했습니다." />
                  </div>
                </div>
                <CodeBlock 
                  language="rust"
                  code={`// Quota Exceeded 발생 시 하위 모델로 즉시 폴백하여 가용성 확보
let models = vec!["flash-lite", "flash", "pro"];
for model in models {
    match call_ai(model, prompt).await {
        Ok(res) => return Ok(res),
        Err(e) if e.is_quota_limit() => continue, // 429 에러 시 다음 모델 시도
        Err(e) => return Err(e),
    }
}`}
                />
              </div>
            </div>

            {/* Problem 3 */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
                Problem 03: The Harness Problem
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">AI 에이전트의 제어 불능 이슈</h3>
              <p className="text-[10pt] text-zinc-400 leading-relaxed">
                AI가 여러 작업을 동시에 처리하려다 맥락을 잃거나, 빌드 검증 없이 다음 작업을 진행하여 코드베이스가 오염되는 문제가 빈번했습니다.
              </p>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution: Strict Harness Protocol</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="AI 에이전트의 실행을 시스템적으로 통제하기 위한 **엄격한 하네스(Harness) 프로토콜**을 수립했습니다. `STRUCTURE.md`를 단일 진실 공급원(SSOT)으로 운영하고, `PLANNING.md`를 통해 물리적 단일 작업 루프를 강제하며, 빌드/테스트 통과 전에는 절대로 다음 단계로 진행할 수 없도록 **Verification Gate**를 구축했습니다." />
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-[9pt] ml-1">
                  <li><Markdown content="**SSOT (Single Source of Truth):** `STRUCTURE.md`를 통해 프로젝트 현재 상태 실시간 동기화" /></li>
                  <li><Markdown content="**Atomic Loop:** `PLANNING.md` 기반으로 한 번에 하나의 작업만 수행하도록 물리적 제약" /></li>
                  <li><Markdown content="**Verification Gate:** 빌드/테스트 성공 전에는 스테이징 및 다음 단계 진행 불가" /></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Project Highlights & Results */}
        <section className="mb-16 space-y-10 print:break-inside-avoid">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            4. Project Highlights & Results
          </h2>
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-10 text-center mx-1">
            <h4 className="text-zinc-500 font-black uppercase tracking-widest mb-8 text-[9pt]">Development Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mx-auto">
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                <p className="text-[7pt] text-zinc-500 uppercase mb-1">Total Commits</p>
                <p className="text-[12pt] font-black text-emerald-500">259+</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                <p className="text-[7pt] text-zinc-500 uppercase mb-1">Lines of Code</p>
                <p className="text-[12pt] font-black text-emerald-500">9,416</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                <p className="text-[7pt] text-zinc-500 uppercase mb-1">Build Success Rate</p>
                <p className="text-[12pt] font-black text-emerald-500">100%</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                <p className="text-[7pt] text-zinc-500 uppercase mb-1">Human Coding</p>
                <p className="text-[12pt] font-black text-blue-500">0%</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Lessons Learned */}
        <section className="mb-16 space-y-6 print:break-inside-avoid">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            5. Lessons Learned
          </h2>
          <div className="bg-zinc-900/20 p-8 rounded-lg border border-zinc-800/50 space-y-6">
            <div className="space-y-3">
              <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
                <span className="text-emerald-500">●</span> AI 시대, 개발자의 정의 재정립
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
                <Markdown content="코드를 직접 작성하지 않고도 대규모 풀스택 애플리케이션을 성공적으로 구축하며, 미래 개발자의 핵심 역량은 &quot;구현 기술&quot;에서 &quot;시스템 설계력과 AI 오케스트레이션 능력&quot;으로 이동할 것임을 확신하게 되었습니다." />
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
                <span className="text-emerald-500">●</span> 엄격한 프로토콜의 중요성
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
                <Markdown content="자율성이 높은 AI 에이전트를 제어하기 위해서는 단순한 지시(Prompt)가 아닌, 검증 가능한 시스템(`Harness Protocol`)이 필수적임을 깨달았습니다. 잘 설계된 제약 조건이 오히려 AI의 생산성을 극대화한다는 역설을 경험했습니다." />
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
