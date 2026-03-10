'use client';

import React, { useState } from 'react';
import { projects } from "@/src/data/projects";
import CodeBlock from "@/src/components/CodeBlock";
import Link from "next/link";
import Markdown from "@/src/components/Markdown";
import Image from "next/image";
import ImageModal from "@/src/components/ImageModal";
import CopyMarkdownButton from "@/src/components/CopyMarkdownButton";
import { generateProjectMarkdown } from "@/src/lib/markdownGenerator";

export default function AiCodeReviewSection({ isPrintMode = false }: { isPrintMode?: boolean }) {
  const project = projects.find((p) => p.id === 'ai-code-review');
  const [modalState, setModalState] = useState<{ isOpen: boolean; src: string; alt: string }>({
    isOpen: false,
    src: '',
    alt: '',
  });

  if (!project) return <div>Project not found</div>;

  const markdownContent = generateProjectMarkdown(project);

  const openModal = (src: string, alt: string) => {
    setModalState({ isOpen: true, src, alt });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <section className={`p-10 md:p-16 print:p-[8mm] print:min-h-0 flex flex-col bg-zinc-950 ${isPrintMode ? 'print-break-before-page print-section-divider' : 'min-h-[297mm]'}`}>
      <CopyMarkdownButton markdown={markdownContent} />

      {/* Back Link */}
      <Link href="/" className="text-zinc-500 hover:text-white mb-12 inline-block transition-colors font-mono text-[8pt] font-bold group no-print">
        <span className="group-hover:-translate-x-1 inline-block transition-transform mr-2">←</span>
        BACK TO RESUME
      </Link>

      {/* Header */}
      <header className="mb-12 border-b-2 border-white pb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-h1 tracking-tighter text-white">
              {project.title}
            </h1>
            <a
              href="https://github.com/Jwhyee/code-review-server"
              target="_blank"
              rel="noopener noreferrer"
              className="no-print bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-2.5 py-1 rounded text-[8pt] font-mono border border-zinc-700 transition-colors flex items-center gap-2 mt-1"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              GITHUB
            </a>
          </div>
          <div className="text-right no-print">
            <p className="text-[10pt] font-mono text-emerald-500 font-bold">{project.overview.duration}</p>
            <p className="text-[8pt] text-zinc-500 uppercase tracking-widest">1인 개발 (기여도 100%)</p>
          </div>
        </div>
        <p className="text-[12pt] text-zinc-400 font-medium tracking-wide max-w-3xl leading-relaxed">
          <Markdown content="예산 0원, 개인 시간만으로 사내 AI 코드 리뷰 시스템을 설계·구축하여 팀 리뷰 병목을 해소하고 성과 인정을 받아 **연봉 5% 상승**이라는 결과를 달성했습니다. 나아가 퇴사 후에도 시스템의 구조적 한계를 **직접 개선한 과정**까지 기술합니다." />
        </p>
        <div className="flex flex-wrap gap-1.5 mt-8">
          {project.overview.techStack.map((tech) => (
            <span key={tech.name} className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded text-[8pt] font-mono border border-zinc-700 uppercase tracking-wider">
              {tech.name}
            </span>
          ))}
        </div>
      </header>

      {/* Technical Insights & Blog Links */}
      <section className="mb-12 px-1 no-print">
        <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest mb-4">Technical Insights & Record</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-[10.5pt] text-emerald-500 font-medium hover:text-emerald-400 transition-colors">
            <span className="text-zinc-700 text-[8pt]">▶</span>
            <Markdown content="[GitLab AI 코드 리뷰 봇 구축기 (LM Studio & n8n)](https://jwhy-study.tistory.com/131)" />
          </li>
          <li className="flex items-center gap-2 text-[10.5pt] text-emerald-500 font-medium hover:text-emerald-400 transition-colors">
            <span className="text-zinc-700 text-[8pt]">▶</span>
            <Markdown content="[GitHub AI 코드 리뷰 봇 구축기 (Kotlin & Google AI)](https://jwhy-study.tistory.com/134)" />
          </li>
        </ul>
      </section>

      {/* 1. Context & Motivation (Phase 1) */}
      <section className="mb-16 space-y-8">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          1. Zero-Budget Automation (Phase 1: 2025.08 - 2025.09)
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <h3 className="text-[10pt] font-black text-zinc-500 uppercase tracking-widest">The Challenge (Situation)</h3>
              <div className="text-zinc-300 text-[10.5pt] leading-relaxed">
                <Markdown content="차세대 의약품 배송 서비스 개발의 임시 팀장으로서 실무와 매니징을 병행하며 **리뷰 리소스 부족과 병목 현상**을 겪었습니다. 신입 팀원과의 코드 품질 편차를 줄이기 위한 교육적 리뷰가 절실했으나, 유료 도구 도입은 경영진의 회의적인 스탠스로 인해 **예산 지원이 불가능**한 상황이었습니다." />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-[10pt] font-black text-zinc-500 uppercase tracking-widest">The Strategy (Action)</h3>
              <div className="text-zinc-300 text-[10.5pt] leading-relaxed">
                <Markdown content="업무 외 개인 시간을 활용하여 사내 오픈소스 인프라를 조합한 파이프라인을 설계했습니다. **GitLab Webhook + n8n + LM Studio(로컬 LLM)**를 연동하여 외부망 노출 없이 동작하는 경제적 자동화 환경을 구축했습니다." />
              </div>
            </div>
          </div>

          {/* Architecture Image - Block Layout (Clickable) */}
          <div
            className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mt-4 cursor-zoom-in"
            onClick={() => openModal("/images/ai-code-review/gitlab-request-flow.png", "GitLab Pipeline Workflow")}
          >
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[7pt] font-black text-zinc-500 uppercase tracking-[0.2em]">GitLab Pipeline Workflow (Phase 1)</span>
                <span className="text-[6pt] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-colors uppercase">Click to Enlarge</span>
              </div>
            </div>
            <div className="relative aspect-[21/9] w-full bg-zinc-950 print:aspect-auto print:h-[50mm]">
              <Image
                src="/images/ai-code-review/gitlab-request-flow.png"
                alt="GitLab Request Flow"
                fill
                className="object-contain p-8 opacity-90 group-hover:opacity-100 transition-opacity print-img-constrain"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10pt] font-black text-zinc-500 uppercase tracking-widest">Prompt Engineering Rigor</h3>
            <div className="bg-zinc-900/40 p-6 rounded border border-zinc-800/50 space-y-4">
              <p className="text-zinc-300 text-[10.5pt] leading-relaxed">
                <Markdown content="프롬프트 하나를 완성하기 위해 Google AI Studio에서 **100회 이상 반복 검증**했습니다. 모델이 일관되게 틀리는 패턴을 직접 분류하고, 각 케이스마다 프롬프트를 수정하며 최적안을 도출하는 과정은 코드 작성보다 오래 걸렸습니다." />
              </p>
              <p className="text-emerald-500 font-bold text-[9.5pt] italic">
                &quot;AI는 프롬프트 설계가 구현보다 어렵다&quot;는 확신이 엔지니어링의 집요함으로 이어진 지점입니다.
              </p>
            </div>
          </div>

          <ul className="list-disc list-inside space-y-2 text-zinc-400 text-[10.5pt] ml-2">
            <li><Markdown content="**데이터 정제:** Git Diff 포맷을 분석하여 Hunk 단위로 분해하고 Import 구문 등 추론에 불필요한 메타데이터를 필터링하여 **컨텍스트 품질을 최적화**" /></li>
            <li><Markdown content="**아키텍처 판단:** n8n의 한계를 인식하고 추후 Kotlin 서버로의 확장을 고려한 데이터 구조 설계" /></li>
            <li><Markdown content="**보안성 확보:** 사내 가이드라인을 준수하기 위해 모든 추론 로직을 내부 인프라(LM Studio) 내에서 완결" /></li>
          </ul>
        </div>
      </section>

      {/* 2. Technical Evolution (Phase 2) */}
      <section className="mb-16 space-y-10 print:break-inside-avoid">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          2. Personal Refactoring (Phase 2: 2025.10 - 2025.11)
        </h2>

        <div className="text-zinc-300 text-[10.5pt] leading-relaxed px-1">
          <p className="mb-4">
            <Markdown content="초기 n8n 기반 파이프라인의 낮은 확장성과 데이터 가공의 한계를 극복하기 위해, **Kotlin & Spring Boot 3 기반의 전용 서버**로 시스템을 전면 리팩터링했습니다." />
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
          {[
            { title: "Facade Pattern", desc: "PR 요약 및 코드 리뷰에 대한 **이벤트 유형**에 따른 명확한 라우팅 및 단일 진입점 관리" },
            { title: "Producer-Consumer", desc: "**Coroutine Channel** 기반 큐로 GitHub/Gemini API 속도 제한(Rate Limit) 안정적 관리" }
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900/20 border border-zinc-800 p-5 rounded-lg">
              <h4 className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest mb-2">{item.title}</h4>
              <div className="text-zinc-400 text-[9.5pt] leading-snug">
                <Markdown content={item.desc} />
              </div>
            </div>
          ))}
        </div>

        <div
          className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mx-1 cursor-zoom-in mt-4"
          onClick={() => openModal("/images/ai-code-review/github-pipeline-architecture.png", "Refactored System Architecture")}
        >
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-[7pt] font-black text-zinc-500 uppercase tracking-[0.2em]">Refactored System Architecture (Phase 2)</span>
              <span className="text-[6pt] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-colors uppercase">Click to Enlarge</span>
            </div>
          </div>
          <div className="relative aspect-[16/7] w-full bg-zinc-950 print:aspect-auto print:h-[50mm]">
            <Image
              src="/images/ai-code-review/github-pipeline-architecture.png"
              alt="AI Code Review System Architecture"
              fill
              className="object-contain p-8 opacity-90 group-hover:opacity-100 transition-opacity print-img-constrain"
            />
          </div>
        </div>
      </section>

      {/* 3. Engineering Highlights */}
      <section className="mb-16 space-y-12">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          3. Engineering Highlights
        </h2>

        <div className="space-y-16 px-1">
          {/* Feature 1: Lightweight Async Event Processing */}
          <div className="space-y-4 print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-zinc-500 font-mono text-[10pt]">01.</span>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">
                <Markdown content="경량 비동기 이벤트 처리 (Coroutine Channel Queue)" />
              </h3>
            </div>

            <div className="ml-8 space-y-3">
              <div className="text-[10pt] text-zinc-400 leading-relaxed border-l-2 border-emerald-400/30 pl-4">
                <Markdown content="별도의 메시지 브로커 없이 `Coroutine Channel` 기반의 인메모리 큐를 설계하여 Webhook 이벤트를 비동기로 처리합니다. 단일 인스턴스 환경에서 경량성과 Kotlin 친화적 구조를 최우선으로 고려한 판단이었습니다." />
              </div>
            </div>

            <div className="ml-8 mt-4">
              <CodeBlock
                language="kotlin"
                code={`// Webhook 이벤트 비동기 처리를 위한 Channel 기반 큐
private val channel = Channel<ReviewJob>(capacity = Channel.BUFFERED)

@PostConstruct
fun startWorkers() {
    repeat(workerCount) { idx ->
        scope.launch {
            for (job in channel) {
                runCatching { 
                    codeReviewService.review(job) 
                }.onFailure { logger.error("Review failed", it) }
            }
        }
    }
}`}
              />
            </div>
          </div>

          {/* Feature 2: Rate-Limited Scatter-Gather */}
          <div className="space-y-4 print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-zinc-500 font-mono text-[10pt]">02.</span>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">
                <Markdown content="전역 Rate-Limited Scatter-Gather 최적화" />
              </h3>
            </div>

            {/* AS-IS */}
            <div className="ml-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[8pt] font-black text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 uppercase tracking-widest">AS-IS</span>
                <span className="text-[9pt] text-zinc-500 font-medium">병렬 호출 동시성 미제어</span>
              </div>
              <div className="text-[10pt] text-zinc-400 leading-relaxed border-l-2 border-red-400/30 pl-4">
                <Markdown content="대규모 PR을 청크로 나누어 `async` 블록으로 병렬 호출 시, **동시 호출 수 제어가 누락**되어 10개 이상의 코루틴이 Gemini API를 동시에 호출하면서 **429 Too Many Requests** 에러가 빈번하게 발생했습니다. 또한 서비스(Summary, Review)별로 개별 제어기를 사용하여 **통합 속도 제한이 불가능**했습니다." />
              </div>
            </div>

            {/* TO-BE */}
            <div className="ml-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[8pt] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-widest">TO-BE</span>
                <span className="text-[9pt] text-zinc-500 font-medium">서비스 레벨 Semaphore 제어</span>
              </div>
              <div className="text-[10pt] text-zinc-400 leading-relaxed border-l-2 border-emerald-400/30 pl-4">
                <Markdown content="`CodeReviewService` 내부에 Semaphore를 직접 선언하여 Gemini API 호출 동시성을 서비스 레벨에서 통합 관리합니다. 아무리 많은 청크가 병렬로 생성되어도 **API 한도를 물리적으로 초과할 수 없도록** 보장했습니다." />
              </div>
            </div>

            <div className="ml-8 mt-4">
              <CodeBlock
                language="kotlin"
                code={`// CodeReviewService 내 동시성 제어
class CodeReviewService {
    companion object {
        private const val MAX_CONCURRENCY = 3
    }
    private val semaphore = Semaphore(MAX_CONCURRENCY)

    suspend fun review() {
        ..
        tasks.mapIndexed { index, task ->
            async {
                semaphore.withPermit {
                    processOne(task, model, index + 1, tasks.size)
                }
            }
        }.awaitAll()
    }
}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Outcomes & Impact */}
      <section className="mb-16 space-y-10 print:break-inside-avoid">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          4. Outcomes & Impact
        </h2>
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-10 mx-1">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: "Infra Cost", value: "₩0", sub: "Zero-Budget", color: "text-emerald-500" },
              { label: "429 Error Rate", value: "0건", sub: "Rate Limit 완전 제어", color: "text-blue-500" },
              { label: "Prompt Iterations", value: "100+", sub: "AI Studio 반복 검증", color: "text-emerald-500" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-[7pt] text-zinc-100 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className={`text-[14pt] font-black ${stat.color}`}>
                  <Markdown content={stat.value} />
                </p>
                <p className="text-[7pt] text-zinc-300 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-zinc-800 pt-6">
            <ul className="text-zinc-400 text-[9.5pt] leading-relaxed space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">▸</span>
                <Markdown content="**비차단 워커 기반의 예외 격리:** Coroutine Channel과 SupervisorJob을 활용하여 특정 작업의 실패가 전체 시스템으로 전파되지 않도록 설계하고, 상세한 에러 로깅을 통해 트러블슈팅 효율화" />
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">▸</span>
                <Markdown content="**호출 제어:** 세마포어(Semaphore)를 이용한 동시성 제한과 호출 간 강제 쿨다운(Mandatory Cooldown) 메커니즘을 통해 Gemini API의 Rate Limit(429) 발생 가능성을 차단" />
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">▸</span>
                <Markdown content="Phase 1에서 구축한 Zero-Budget 자동화 시스템을 통해 연봉 협상에서 실질적인 성과로 인정받았습니다." />
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Lessons Learned */}
      <section className="mb-16 space-y-6 print:break-inside-avoid">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          5. Lessons Learned
        </h2>
        <div className="bg-zinc-900/20 p-8 rounded-lg border border-zinc-800/50 space-y-8">
          <div className="space-y-3">
            <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
              <span className="text-emerald-500">●</span> 기술적 취향은 생산성에서 시작된다
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
              <Markdown content="단순히 트렌디한 기술을 쫓는 것이 아니라, 팀의 병목을 해결하기 위해 n8n에서 Kotlin 서버로 전환하는 과정에서 **&quot;왜 이 기술이 필요한가&quot;**에 대한 명확한 기준을 세울 수 있었습니다." />
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
              <span className="text-emerald-500">●</span> 공식 권한 없이 팀을 움직이는 방법
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
              <Markdown content="제안서가 아니라 PR에 달린 실제 리뷰 코멘트가 경영진을 설득했습니다. 공식 권한 없이 팀의 문제를 해결하려면, **&quot;작동하는 결과물&quot;이 가장 강력한 언어**임을 배웠습니다." />
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

      {/* Image Modal */}
      {modalState.isOpen && (
        <ImageModal
          isOpen={modalState.isOpen}
          src={modalState.src}
          alt={modalState.alt}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
