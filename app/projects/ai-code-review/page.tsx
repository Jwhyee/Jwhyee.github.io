import { projects } from "@/src/data/projects";
import CodeBlock from "@/src/components/CodeBlock";
import Link from "next/link";
import Markdown from "@/src/components/Markdown";
import Image from "next/image";

export default function AiCodeReviewProjectPage() {
  const project = projects.find((p) => p.id === 'ai-code-review');

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
              성장하는 팀에서 코드 리뷰는 필수적이지만, 시니어 개발자의 리소스 부족으로 인해 MR(Merge Request)이 정체되는 현상이 빈번했습니다. 
              유료 AI 리뷰 도구 도입을 검토했으나, 엄격한 사내 보안 정책과 비용 문제로 인해 외부 클라우드 기반 솔루션은 사용이 불가능했습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
              <li><Markdown content="**리뷰 리소스의 병목:** 단순 코딩 컨벤션이나 오타 검증에 시니어의 시간이 소모되는 비효율 발생" /></li>
              <li><Markdown content="**보안 및 비용 제약:** 클라우드 LLM 사용 시 소스 코드 유출 리스크와 구독 비용 부담" /></li>
            </ul>
            <p>
              <Markdown content="이러한 페인 포인트를 해결하기 위해 **사내 유휴 서버와 로컬 LLM**을 활용하여, 보안 가이드라인을 준수하면서도 리뷰 리드타임을 획기적으로 단축할 수 있는 **Zero-Budget AI 리뷰 시스템**을 구축했습니다." />
            </p>
          </div>
        </section>

        {/* 2. Architecture & Pipeline Flow */}
        <section className="mb-16 space-y-8 print:break-inside-avoid">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            2. Architecture & Pipeline Flow
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1">
            <div className="space-y-3">
              <h3 className="text-[9pt] font-black text-emerald-500 uppercase tracking-widest">Event-Driven Automation</h3>
              <p className="text-zinc-400 text-[10pt] leading-relaxed">
                <Markdown content="**GitLab Webhook**과 노코드 자동화 툴인 **n8n**을 연동하여 MR 생성/수정 이벤트를 실시간으로 포착합니다. 중간 단계에서 비즈니스 로직과 무관한 파일(lock, asset 등)을 필터링하고 Diff 데이터를 정제하여 LLM에 전달하는 파이프라인을 설계했습니다." />
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-[9pt] font-black text-emerald-500 uppercase tracking-widest">Local LLM Integration</h3>
              <p className="text-zinc-400 text-[10pt] leading-relaxed">
                <Markdown content="**LM Studio**를 통해 사내 로컬 서버에 LLM(Llama-3, Qwen 등)을 서빙했습니다. 외부망 연결 없이 API를 호출함으로써 소스 코드 유출을 원천 차단하고, 서버 가동 비용 외의 추가 지출이 없는 경제적인 시스템을 완성했습니다." />
              </p>
            </div>
          </div>

          {/* Pipeline Diagrams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                <span className="text-[7pt] font-black text-zinc-500 uppercase tracking-[0.2em]">Pipeline Architecture</span>
              </div>
              <div className="relative aspect-square w-full bg-zinc-950">
                <Image 
                  src="/images/ai-code-review/github-pipeline-architecture.png"
                  alt="AI Code Review Pipeline Architecture"
                  fill
                  className="object-contain p-6 opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                <span className="text-[7pt] font-black text-zinc-500 uppercase tracking-[0.2em]">Request & Comment Flow</span>
              </div>
              <div className="relative aspect-square w-full bg-zinc-950">
                <Image 
                  src="/images/ai-code-review/gitlab-request-flow.png"
                  alt="GitLab Request Flow"
                  fill
                  className="object-contain p-6 opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
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
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-1 border border-red-500/20">
                Problem 01: Token Management
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">방대한 Diff 데이터로 인한 토큰 소모 및 환각</h3>
              <p className="text-[10pt] text-zinc-400 leading-relaxed">
                MR 전체 Diff를 그대로 전송할 경우 LLM의 컨텍스트 윈도우를 초과하거나, 로직과 무관한 코드들로 인해 분석 정확도가 떨어지는 문제가 발생했습니다.
              </p>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-3">
                <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution Implementation: Payload Trimming</p>
                <CodeBlock 
                  language="javascript"
                  code={`// import, package 선언, 주석 등 비논리적 변경사항 제거
function trimDiff(diff) {
  return diff.split('\\n')
    .filter(line => 
      (line.startsWith('+') || line.startsWith('-')) &&
      !line.match(/^(\\+|\\-)\\s*(import|package|\\/\\/|\\/\\*)/)
    )
    .join('\\n');
}`}
                />
                <p className="text-zinc-500 text-[8pt] font-mono"><Markdown content="이를 통해 토큰 소모량을 **약 60% 절감**하고 리뷰 응답의 품질을 향상시켰습니다." /></p>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-1 border border-red-500/20">
                Problem 02: Prompt Engineering
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">LLM의 지나친 칭찬 혹은 무의미한 조언</h3>
              <p className="text-[10pt] text-zinc-400 leading-relaxed">
                기본 설정에서는 AI가 &quot;좋은 코드입니다&quot;와 같은 원론적인 답변만 반복하거나, 언어의 특성을 무시한 조언을 하는 경우가 있었습니다.
              </p>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-3">
                <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution: Context-Aware Prompting</p>
                <ul className="list-disc list-inside space-y-1.5 text-zinc-300 text-[9.5pt]">
                  <li><Markdown content="**Role Identity:** &quot;당신은 Kotlin/Spring Boot 전문가입니다&quot;와 같이 페르소나를 명확히 부여" /></li>
                  <li><Markdown content="**Constraint:** 칭찬을 배제하고 오직 수정이 필요한 로직, 잠재적 버그, 성능 병목에 대해서만 불릿 포인트로 응답하도록 강제" /></li>
                  <li><Markdown content="**Language:** 답변 언어를 한국어로 고정하고 팀의 코딩 컨벤션을 프롬프트에 주입" /></li>
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
            <h4 className="text-zinc-500 font-black uppercase tracking-widest mb-8 text-[9pt]">Operational Impact</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mx-auto">
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                <p className="text-[7pt] text-zinc-500 uppercase mb-1">Cost Savings</p>
                <p className="text-[12pt] font-black text-emerald-500">₩0 / Year</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                <p className="text-[7pt] text-zinc-500 uppercase mb-1">Review Lead Time</p>
                <p className="text-[12pt] font-black text-emerald-500">-70%</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                <p className="text-[7pt] text-zinc-500 uppercase mb-1">Data Privacy</p>
                <p className="text-[12pt] font-black text-emerald-500">100% Local</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                <p className="text-[7pt] text-zinc-500 uppercase mb-1">Noise Reduction</p>
                <p className="text-[12pt] font-black text-blue-500">60%</p>
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
                <span className="text-emerald-500">●</span> 기술의 조합이 만드는 비즈니스 가치
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
                <Markdown content="고가의 SaaS를 도입하지 않더라도 `n8n`, `LM Studio`와 같은 오픈소스 도구들을 영리하게 조합하여 실제 팀의 생산성 문제를 해결할 수 있음을 경험했습니다. 엔지니어링의 본질은 화려한 기술의 나열이 아닌, 문제 해결을 위한 최적의 설계를 찾는 것임을 깨달았습니다." />
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
                <span className="text-emerald-500">●</span> LLM 실전 활용의 노하우 체득
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
                <Markdown content="LLM을 프로덕션 수준의 워크플로우에 통합할 때 가장 중요한 것은 모델의 크기보다 **&quot;전처리(Trimming)&quot;**와 **&quot;프롬프트 제어(Guardrails)&quot;**임을 이해하게 되었습니다. 데이터의 질이 결과물의 품질을 결정하는 `Garbage In, Garbage Out`의 원칙을 다시 한번 확인했습니다." />
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

