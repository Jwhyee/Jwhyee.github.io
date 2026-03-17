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
            <p className="text-[8pt] text-zinc-100 uppercase tracking-widest">1인 개발 (기여도 100%)</p>
          </div>
        </div>
        <p className="text-[12pt] text-zinc-400 font-medium tracking-wide max-w-3xl leading-relaxed">
          <Markdown content="예산 0원, 개인 시간만으로 사내 AI 코드 리뷰 시스템을 설계 및 구축하여 팀 리뷰 병목을 해소하고 **사내 공식 성과로 인정**받았습니다. 퇴사 후에도 시스템의 구조적 한계를 직접 개선한 과정까지 기술합니다." />
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
          <h3 className="text-[10pt] font-black text-zinc-500 uppercase tracking-widest">The Challenge (Situation)</h3>
          <div className="text-zinc-300 text-[10.5pt] leading-relaxed">
            <Markdown content="차세대 의약품 배송 서비스 개발에서 **임시 팀장**을 맡으며, 4인 팀의 유일한 머지 마스터가 되었습니다. 나머지 팀원 모두 저보다 직급이 낮아 모든 MR의 리뷰를 제가 직접 리뷰해야 했고, 실무와 매니징을 병행하는 상황에서 코드 리뷰에 쏟을 **리소스가 턱없이 부족**했습니다. 신입 팀원과의 코드 품질 편차를 줄이려면 교육적 리뷰가 필요했지만, 유료 도구 도입은 **예산 지원이 없어 불가능한 상황**이었습니다." />
          </div>
          <h3 className="text-[10pt] font-black text-zinc-500 uppercase tracking-widest">The Strategy (Action)</h3>
          <div className="text-zinc-300 text-[10.5pt] leading-relaxed">
            <Markdown content="업무 외 개인 시간을 써서 사내 인프라만으로 파이프라인을 직접 설계했습니다. **GitLab Webhook + n8n + LM Studio**를 연동해 외부망 노출 없이 동작하는 구조로 만들었습니다." />
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
                <Markdown content="프롬프트 최적화에는 **당시 최신 모델인 Gemini 2.5 Pro를 활용**했습니다. System Prompt를 작성한 뒤 LM Studio에서 실제 코드와 함께 실행해 결과를 직접 확인하고, 문제가 있는 응답과 그 원인을 Google AI Studio에 다시 제공해 다음 버전의 프롬프트를 만드는 사이클을 **100회 이상 반복**했습니다. 파이프라인을 구현하는 것보다 이 과정이 더 오래 걸렸습니다." />
              </p>
            </div>
          </div>

          <ul className="list-disc list-inside space-y-2 text-zinc-400 text-[10.5pt] ml-2">
            <li><Markdown content="Git Diff를 **Hunk 단위**로 분해하고 Import 구문 등 추론에 불필요한 노이즈를 제거해 프롬프트 토큰 사용량 **20% 절감**" /></li>
            <li><Markdown content="n8n의 한계를 인식하고 추후 **Kotlin 서버로 확장 가능한** 데이터 구조로 설계" /></li>
            <li><Markdown content="AI 모든 질의는 사내 인프라(LM Studio)에서 완결해 **외부망 노출 없이** 보안 가이드라인 준수" /></li>
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
            <Markdown content="초기 n8n 기반 파이프라인은 **데이터 가공이 불편하고 확장에 한계**가 있었습니다. 퇴사 후 개인 시간을 써서 **Kotlin + Spring Boot 3 기반 전용 서버**로 직접 다시 만들었습니다." />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
          {[
            { title: "Facade Pattern", desc: "PR 요약과 코드 리뷰 두 가지 이벤트 유형이 생기면서 단일 진입점에서 **명확하게 라우팅**할 필요가 생겼고, Facade로 이를 정리했습니다." },
            { title: "Producer-Consumer", desc: "GitHub/Gemini API의 **Rate Limit**을 안정적으로 관리하기 위해 **Coroutine Channel 기반 큐**로 요청 흐름을 제어했습니다." }
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
                <Markdown content="별도의 메시지 브로커 없이 **Coroutine Channel 기반 인메모리 큐**로 Webhook 이벤트를 비동기 처리합니다. 단일 인스턴스 환경에서 Kafka나 RabbitMQ 같은 외부 브로커는 오버스펙이라 판단했고, Kotlin 코루틴과 자연스럽게 맞아 이 구조를 택했습니다." />
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
                <Markdown content="PR을 청크로 나눠 `async`로 병렬 호출할 때 동시성 제어가 없었습니다. 10개 이상의 코루틴이 Gemini API를 동시에 호출하면서 **429 Too Many Requests 에러**가 반복됐습니다. 또한 PR 요약과 코드 리뷰가 각각 별도로 API를 호출하는 구조라, 두 서비스가 동시에 실행될 경우 호출량이 합산되어 Rate Limit을 초과하는 상황을 막을 방법이 없었습니다." />
              </div>
            </div>

            {/* TO-BE */}
            <div className="ml-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[8pt] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-widest">TO-BE</span>
                <span className="text-[9pt] text-zinc-500 font-medium">서비스 레벨 Semaphore 제어</span>
              </div>
              <div className="text-[10pt] text-zinc-400 leading-relaxed border-l-2 border-emerald-400/30 pl-4">
                <Markdown content="`CodeReviewService` 안에 `Semaphore`를 직접 선언해 Gemini API 호출을 서비스 레벨에서 통합 관리합니다. 청크가 아무리 많이 생성돼도 동시 호출 수를 `MAX_CONCURRENCY`로 고정해 Rate Limit을 넘지 않도록 했습니다." />
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
              { label: "429 Error Rate", value: "0건", sub: "Rate Limit 완전 제어", color: "text-emerald-500" },
              { label: "Prompt Iterations", value: "100+", sub: "Google AI Studio 반복 검증", color: "text-emerald-500" }
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
                <Markdown content="`Coroutine Channel`과 `SupervisorJob`을 활용해 특정 작업이 실패해도 전체 시스템으로 전파되지 않도록 격리하고, 상세 에러 로깅으로 트러블슈팅이 가능한 구조로 설계" />
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">▸</span>
                <Markdown content="Semaphore로 동시 호출 수를 제한하고 호출 간 강제 쿨다운을 추가해 **Gemini API 429 에러를 0건**으로 유지" />
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">▸</span>
                <Markdown content="Phase 1에서 구축한 Zero-Budget 자동화 시스템이 사내 공식 성과로 인정받았습니다" />
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
        <div className="bg-zinc-900/20 p-8 rounded-lg border border-zinc-800/50 space-y-6">
          <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
            <Markdown content="n8n을 처음 사용했음에도 **빠르게 워크플로우를 만들어 코드 리뷰 시스템을 구축**할 수 있었습니다. 하지만 오래 운영하고 개선해야 하는 경우, 처음부터 유지보수 가능한 환경으로 설계하는 게 결국 더 빠르다는 걸 직접 겪으면서 알았습니다." />
          </p>
          <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
            <Markdown content="코드 리뷰 과정에서 병목을 느껴서 상용 툴 도입을 먼저 물어봤습니다. 저희 팀만 쓰는 도구에 예산을 쓰기 어렵다는 답이 돌아왔고, 다른 팀까지 설득하기도 쉽지 않아 결국 직접 만들었습니다. 출근해서 커피 마시다 대표님께 만들고 있다고 말씀드렸더니, 프롬프트 설계에 대해 기술적인 조언을 받을 수 있었습니다. **공식 경로가 막혔을 때 직접 만들면 된다는 생각을 처음으로 행동으로 옮긴 프로젝트**였습니다. 이후로 불편한 게 생기면 **직접 만드는 방식**으로 이어가고 있습니다." />
          </p>
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
