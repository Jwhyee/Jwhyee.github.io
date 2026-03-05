'use client';

import React, { useState } from 'react';
import { projects } from "@/src/data/projects";
import CodeBlock from "@/src/components/CodeBlock";
import Link from "next/link";
import Markdown from "@/src/components/Markdown";
import Image from "next/image";
import ImageModal from "@/src/components/ImageModal";

export default function AiCodeReviewProjectPage() {
  const project = projects.find((p) => p.id === 'ai-code-review');
  const [modalState, setModalState] = useState<{ isOpen: boolean; src: string; alt: string }>({
    isOpen: false,
    src: '',
    alt: '',
  });

  if (!project) return <div>Project not found</div>;

  const openModal = (src: string, alt: string) => {
    setModalState({ isOpen: true, src, alt });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

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
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-h1 tracking-tighter text-white">
              {project.title}
            </h1>
            <div className="text-right no-print">
              <p className="text-[10pt] font-mono text-emerald-500 font-bold">2025.08 — 2025.09</p>
              <p className="text-[8pt] text-zinc-500 uppercase tracking-widest">Deep Dive Report</p>
            </div>
          </div>
          <p className="text-[12pt] text-zinc-400 font-medium tracking-wide max-w-3xl leading-relaxed">
            <Markdown content="개인 스터디 시간을 활용해 사내 인프라 기반의 **Zero-Budget AI 코드 리뷰 시스템**을 구축하여, 리뷰 병목 해결 및 팀 코드 품질 상향 평준화를 달성한 과정을 기술합니다." />
          </p>
          <div className="flex flex-wrap gap-1.5 mt-8">
            {project.overview.techStack.map((tech) => (
              <span key={tech.name} className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded text-[8pt] font-mono border border-zinc-700 uppercase tracking-wider">
                {tech.name}
              </span>
            ))}
          </div>
        </header>

        {/* 1. Context & Motivation (Phase 1) */}
        <section className="mb-16 space-y-8">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            1. Zero-Budget Automation (Phase 1)
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
              <div className="relative aspect-[21/9] w-full bg-zinc-950">
                <Image
                  src="/images/ai-code-review/gitlab-request-flow.png"
                  alt="GitLab Request Flow"
                  fill
                  className="object-contain p-8 opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

            <ul className="list-disc list-inside space-y-2 text-zinc-400 text-[10.5pt] ml-2">
              <li><Markdown content="**데이터 정제:** Git Diff 포맷을 분석하여 Hunk 단위로 분해하고 로직과 무관한 노이즈(Import, 주석) 필터링" /></li>
              <li><Markdown content="**추론 안정화:** `gpt-oss-20b` 모델 적용 및 n8n Merge 노드를 활용한 컨텍스트 데이터 유실 방지" /></li>
              <li><Markdown content="**프롬프트 고도화:** Google AI Studio를 활용한 약 100회 이상의 반복 검증으로 최적의 System Prompt 도출" /></li>
            </ul>
          </div>
        </section>

        {/* 2. Technical Evolution (Phase 2) */}
        <section className="mb-16 space-y-10 print:break-inside-avoid">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            2. System Refactoring (Phase 2)
          </h2>

          <div className="text-zinc-300 text-[10.5pt] leading-relaxed px-1">
            <Markdown content="초기 n8n 기반 파이프라인의 낮은 확장성과 데이터 가공의 한계를 극복하기 위해, **Kotlin & Spring Boot 3 기반의 전용 서버**로 시스템을 전면 리팩터링했습니다. 이를 통해 GitHub App 형태의 유연한 연동과 정교한 인라인 리뷰 기능을 확보했습니다." />
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
            <div className="relative aspect-[16/7] w-full bg-zinc-950">
              <Image
                src="/images/ai-code-review/github-pipeline-architecture.png"
                alt="AI Code Review System Architecture"
                fill
                className="object-contain p-8 opacity-90 group-hover:opacity-100 transition-opacity"
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
            {/* Feature 1: Async Job Queue */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-zinc-500 font-mono text-[10pt]">01.</span>
                <h3 className="text-[12pt] font-bold text-white tracking-tight">Coroutine Channel 기반 비동기 작업 큐</h3>
              </div>
              <div className="text-[10pt] text-zinc-400 leading-relaxed ml-8">
                <Markdown content="Redis와 같은 별도 인프라 없이 **In-memory Channel**로 고가용성 큐를 구현했습니다. `SupervisorJob`과 `runCatching`을 활용하여 개별 작업의 실패가 전체 시스템으로 전파되지 않도록 설계했으며, `Semaphore`를 활용해 Rate Limit을 정밀하게 제어합니다." />
              </div>
              <div className="ml-8 mt-4">
                <CodeBlock
                  language="kotlin"
                  code={`@Component
class ReviewJobQueue(private val codeReviewService: CodeReviewService) {
    // 동시 실행 상한 제어
    private val semaphore = Semaphore(MAX_CONCURRENCY)

    @PostConstruct
    fun start() {
        repeat(workerCount) { idx ->
            scope.launch {
                for (job in channel) {
                    runCatching {
                        semaphore.withPermit {
                            codeReviewService.review(job)
                        }
                    }.onFailure { /* 에러 전파 방지 */ }
                }
            }
        }
    }
}`}
                />
              </div>
            </div>

            {/* Feature 2: Diff Parser */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-zinc-500 font-mono text-[10pt]">02.</span>
                <h3 className="text-[12pt] font-bold text-white tracking-tight">정교한 커스텀 Diff 파서 엔진</h3>
              </div>
              <div className="text-[10pt] text-zinc-400 leading-relaxed ml-8">
                <Markdown content="단순 문자열 비교가 아닌, Unified Diff 포맷을 직접 분석하여 의미 있는 변경점만 추출합니다. **Sealed Class 기반 ReviewType 설계**를 통해 PR 전체 요약, 파일 코멘트, 멀티라인 인라인 코멘트를 타입 안전하게 다형적으로 처리합니다." />
              </div>
              <div className="bg-zinc-900/30 p-6 rounded-lg border border-zinc-800/50 ml-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-[8pt] font-black text-emerald-500 uppercase tracking-widest">Efficiency</h4>
                  <ul className="text-zinc-400 text-[9pt] space-y-1.5 list-disc list-inside">
                    <li><Markdown content="**Import 및 Package** 구문 변경 자동 제외" /></li>
                    <li><Markdown content="삭제만 있는 파일 및 빈 변경 사항 필터링" /></li>
                    <li><Markdown content="**토큰 소모량 60% 절감** 및 환각 방지" /></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[8pt] font-black text-emerald-500 uppercase tracking-widest">Accuracy</h4>
                  <ul className="text-zinc-400 text-[9pt] space-y-1.5 list-disc list-inside">
                    <li><Markdown content="Hunk 헤더 기반 **old/new 라인 번호** 추적" /></li>
                    <li><Markdown content="멀티라인 코멘트 범위(Range) 정밀 계산" /></li>
                    <li><Markdown content="**AS-IS / TO-BE** 코드 제안 템플릿 생성" /></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature 3: Security */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-zinc-500 font-mono text-[10pt]">03.</span>
                <h3 className="text-[12pt] font-bold text-white tracking-tight">보안 중심 설계 (Zero-Trust)</h3>
              </div>
              <div className="text-[10pt] text-zinc-400 leading-relaxed ml-8">
                <Markdown content="Webhook 검증 단계에서 **Constant-Time Comparison(상수 시간 비교)**을 구현하여 Timing Attack을 방어하고, RS256 기반 JWT 인증 및 Installation Token 캐싱으로 보안성과 성능을 동시에 확보했습니다." />
              </div>
              <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-950 p-4 border border-zinc-800 rounded">
                  <p className="text-emerald-500 font-bold text-[9pt] mb-1">상수 시간 서명 검증</p>
                  <div className="text-zinc-500 text-[8.5pt]">
                    <Markdown content="HMAC-SHA256 서명 비교 시 조기 반환을 방지하여 응답 시간 차이로 서명을 유추하는 공격 차단" />
                  </div>
                </div>
                <div className="bg-zinc-950 p-4 border border-zinc-800 rounded">
                  <p className="text-emerald-500 font-bold text-[9pt] mb-1">GitHub App 인증</p>
                  <div className="text-zinc-500 text-[8.5pt]">
                    <Markdown content="**JJWT**를 활용한 RS256 서명 및 토큰 캐싱으로 불필요한 API 호출 최소화" />
                  </div>
                </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Review Lead Time", value: "-70%", color: "text-emerald-500" },
                { label: "Infra Cost", value: "₩0", color: "text-emerald-500" },
                { label: "Token Saving", value: "60%", color: "text-blue-500" },
                { label: "Data Privacy", value: "100%", color: "text-emerald-500" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-[7pt] text-zinc-500 uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-[18pt] font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 border-t border-zinc-800 pt-8">
              <div className="text-zinc-400 text-[10pt] leading-relaxed italic text-center">
                <Markdown content='&quot;주도적으로 팀의 생산성 병목을 해결한 성과를 인정받아, 연봉 인상에 긍정적인 성과 평가를 달성했습니다.&quot;' />
              </div>
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

      {/* Image Modal */}
      <ImageModal
        isOpen={modalState.isOpen}
        src={modalState.src}
        alt={modalState.alt}
        onClose={closeModal}
      />
    </main>
  );
}
