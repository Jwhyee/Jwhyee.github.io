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

export default function ProfanityFilterSection({ isPrintMode = false }: { isPrintMode?: boolean }) {
  const project = projects.find((p) => p.id === 'profanity-filter-library');
  const [modalState, setModalState] = useState<{ isOpen: boolean; src: string; alt: string }>({
    isOpen: false,
    src: '',
    alt: '',
  });

  // Problem 02, 04 코드 토글 상태
  const [expandedProblems, setExpandedProblems] = useState<Record<string, boolean>>({
    'problem-02': false,
    'problem-04': false,
  });

  if (!project) return <div>Project not found</div>;

  const markdownContent = generateProjectMarkdown(project);

  const openModal = (src: string, alt: string) => {
    setModalState({ isOpen: true, src, alt });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const toggleProblem = (id: string) => {
    setExpandedProblems(prev => ({ ...prev, [id]: !prev[id] }));
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
              href="https://github.com/Jwhyee/profanity-filter"
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

      {/* Technical Insights & Blog Links */}
      <section className="mb-12 px-1 no-print">
        <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest mb-4">Technical Insights & Record</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-[10.5pt] text-emerald-500 font-medium hover:text-emerald-400 transition-colors">
            <span className="text-zinc-700 text-[8pt]">▶</span>
            <Markdown content="[비속어 필터 라이브러리: Spring 환경 적용 가이드](https://jwhy-study.tistory.com/138)" />
          </li>
        </ul>
      </section>

      {/* 1. Why this project? (Motivation) */}
      <section className="mb-16 space-y-6">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          1. Why this project? (Motivation)
        </h2>
        <div className="text-zinc-300 space-y-4 leading-relaxed text-[10.5pt]">
          <div className="text-zinc-300">
            <Markdown content="퇴사 후 동기들과 사이드 프로젝트를 진행하며 리뷰 기능에 비속어 필터링이 필요했습니다. 비속어 필터링 라이브러리를 가져다가 사용하지 않고, &quot;직접 구현하면서 배우자&quot;는 판단으로 리서치를 시작했고, 우아한형제들 기술 블로그를 통해 기존 방식의 한계를 분석했습니다." />
          </div>
          <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
            <li><Markdown content="**성능의 선형 저하:** 금칙어 사전의 크기가 커질수록 모든 패턴을 개별적으로 검사해야 하므로 시간 복잡도가 $O(N \times K)$로 증가합니다. 특히 10,000개 이상의 패턴을 가진 복합 정규식은 실서비스 적용이 불가능할 정도의 지연을 초래합니다." /></li>
            <li><Markdown content="**변칙 우회의 취약성:** 숫자나 공백을 섞은 변칙 표현(예: &quot;시1발&quot;)을 정규식으로 처리하려면 패턴이 기하급수적으로 복잡해져 성능이 더욱 악화됩니다." /></li>
          </ul>
          <p>
            <Markdown content="단순히 구현하는 것에 그치지 않고, JMH로 기존 방식과 직접 성능을 비교 측정하는 것까지 스스로 범위를 확장했습니다. 결과적으로 사이드 프로젝트는 무산되었지만, 이 **라이브러리는 완성되었고, Jitpack에 배포**했습니다. &quot;프로젝트가 사라져도 내가 만든 것은 남는다&quot;는 사실이 이 작업을 끝까지 밀어붙인 이유였습니다." />
          </p>
        </div>
      </section>

      {/* 2. Performance Results (Promoted) */}
      <section className="mb-16 space-y-8 print:break-inside-avoid">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          2. Performance Results
        </h2>
        <p className="text-zinc-400 text-[10pt] px-1 italic">
          * JMH(Java Microbenchmark Harness)를 사용하여 직접 측정한 성능 비교 수치입니다.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-1">
          <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
            <p className="text-[7pt] text-zinc-100 uppercase mb-1">라이브러리</p>
            <p className="text-[12pt] font-black text-emerald-500">3.15 ms</p>
          </div>
          <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
            <p className="text-[7pt] text-zinc-100 uppercase mb-1">단순 정규식</p>
            <p className="text-[12pt] font-black text-red-500">70.64 ms</p>
          </div>
          <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
            <p className="text-[7pt] text-zinc-100 uppercase mb-1">퍼포먼스 향상</p>
            <p className="text-[12pt] font-black text-emerald-400">23x</p>
          </div>
          <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
            <p className="text-[7pt] text-zinc-100 uppercase mb-1">시간복잡도</p>
            <p className="text-[12pt] font-black text-emerald-400">O(N)</p>
          </div>
        </div>

        {/* Performance Chart */}
        <div
          className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mx-1 cursor-zoom-in"
          onClick={() => openModal("/images/profanity-filter/benchmark.png", "Performance Benchmark Results")}
        >
          <div className="absolute top-3 right-3 z-10 no-print opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[6pt] bg-zinc-900/80 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-colors uppercase">Click to Enlarge</span>
          </div>
          <div className="relative aspect-[21/9] w-full bg-zinc-950/50 print:aspect-auto print:h-[50mm]">
            <Image
              src="/images/profanity-filter/benchmark.png"
              alt="Regex vs Aho-Corasick Performance Comparison"
              fill
              className="object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity print-img-constrain"
            />
          </div>
        </div>
      </section>

      {/* 3. Architecture & How It Works */}
      <section className="mb-16 space-y-8 print:break-inside-avoid">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          3. Architecture & How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1">
          <div className="space-y-3">
            <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest">Core Architecture</h3>
            <p className="text-zinc-400 text-[10pt] leading-relaxed">
              <Markdown content="Trie 자료구조를 기반으로 **Failure Function**을 결합한 아호코라식 알고리즘을 핵심 엔진으로 채택했습니다. 매칭 실패 시 루트로 돌아가지 않고 최장 공통 접미사 노드로 즉시 이동하여 입력 문자열을 단 한 번만 순회(**O(N)**)하도록 설계했습니다." />
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest">Deployment (Jitpack)</h3>
            <p className="text-zinc-400 text-[10pt] leading-relaxed">
              <Markdown content="오픈소스 라이브러리로서의 범용성을 위해 **Jitpack**을 배포 저장소로 선택했습니다. GitHub 리포지토리의 태그 릴리즈를 통해 버전 관리를 수행하며, `Gradle` 및 `Maven` 환경에서 별도의 복잡한 설정 없이 의존성을 추가하여 즉시 사용 가능하도록 배포 체계를 구축했습니다." />
            </p>
          </div>
        </div>

        {/* Algorithm Diagram */}
        <div
          className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mx-1 cursor-zoom-in"
          onClick={() => openModal("/images/profanity-filter/aho-corasick-tree.png", "Aho-Corasick Algorithm Structure")}
        >
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 items-center justify-between flex">
            <div className="flex items-center gap-2">
              <span className="text-[7pt] font-black text-zinc-500 uppercase tracking-[0.2em]">Aho-Corasick Algorithm & Trie Diagram</span>
              <span className="text-[6pt] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-colors uppercase no-print">Click to Enlarge</span>
            </div>
          </div>
          <div className="relative aspect-[16/9] w-full bg-white print:aspect-auto print:h-[55mm]">
            <Image
              src="/images/profanity-filter/aho-corasick-tree.png"
              alt="Aho-Corasick Algorithm Structure"
              fill
              className="object-contain p-8 opacity-90 group-hover:opacity-100 transition-opacity print-img-constrain"
            />
          </div>
        </div>
      </section>

      {/* 4. Engineering Challenges */}
      <section className="mb-16 space-y-10">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          4. Engineering Challenges
        </h2>

        <div className="space-y-12 px-1">
          {/* Problem 1 - Keep Code */}
          <div className="space-y-4 print:break-inside-avoid">
            <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
              Problem 01: Performance Bottleneck
            </div>
            <h3 className="text-[12pt] font-bold text-white tracking-tight">10,000개 금칙어 및 100KB 페이로드 환경에서의 지연 해결</h3>
            <div className="text-[10pt] text-zinc-400 leading-relaxed">
              <Markdown content="기존 복합 정규식 엔진은 금칙어 개수에 비례하여 성능이 저하되는 구조적 한계가 있었습니다. 이를 금칙어 개수와 무관하게 **O(N)** 성능을 보장하는 알고리즘으로 대체했습니다." />
            </div>
            <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
              <CodeBlock
                language="kotlin"
                code={`// Aho-Corasick PayloadTrie를 활용한 O(N) 탐색
val detectedBans = trie.parseText(normalizedSentence)
  .map { it.payload.word }
  .distinct()`}
              />
            </div>
          </div>

          {/* Problem 2 - Toggle Code */}
          <div className="space-y-4 print:break-inside-avoid">
            <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
              Problem 02: Index Restoration
            </div>
            <h3 className="text-[12pt] font-bold text-white tracking-tight">변칙 우회 방어 및 원본 인덱스 복원 알고리즘</h3>
            <div className="text-[10pt] text-zinc-400 leading-relaxed">
              <Markdown content="정규화(Normalization) 과정에서 텍스트 길이가 변하더라도, **IntArray 기반의 매핑 테이블**을 통해 원본 위치를 정확히 추적하여 마스킹 오차를 해결했습니다." />
            </div>
            <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50">
              <CodeBlock
                language="kotlin"
                code={`detectedBans.forEach { ban ->
    val isAllowed = detectedAllows.any { allow -> 
        overlaps(ban.start, ban.end, allow.start, allow.end) 
    }
    if (!isAllowed) {
        val originalStart = mapping.indexMap[ban.start]
        val originalEnd = mapping.indexMap[ban.end]

        for (i in originalStart..originalEnd) {
            resultChars[i] = maskChar // 비속어를 **로 마스킹
        }
    }
}`}
              />
            </div>
          </div>

          {/* Problem 3 - Toggle Code */}
          <div className="space-y-4 print:break-inside-avoid">
            <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
              Problem 03: False Positives
            </div>
            <h3 className="text-[12pt] font-bold text-white tracking-tight">정상 단어 보호를 위한 Interval Overlap 로직</h3>
            <div className="text-[10pt] text-zinc-400 leading-relaxed">
              <Markdown content="금칙어 구간이 화이트리스트 구간에 포함될 경우(예: '시발' ⊂ '시발점') 이를 필터링에서 제외하는 정교한 구간 비교 로직을 도입했습니다." />
            </div>
            <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50">
              <CodeBlock
                language="kotlin"
                code={`// Interval Overlap: 금칙어가 허용 단어 구간에 포함되면 무시
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
      </section>

      {/* 5. Lessons Learned */}
      <section className="mb-16 space-y-6 print:break-inside-avoid">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          5. Lessons Learned
        </h2>
        <div className="bg-zinc-900/20 p-8 rounded-lg border border-zinc-800/50 space-y-6">
          <div className="space-y-3">
            <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
              <span className="text-emerald-500">●</span> 이론의 실제적 가치 실증
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
              <Markdown content="교과서적인 알고리즘(`Aho-Corasick`, `Trie`)이 실제 비즈니스 환경에서 발생하는 성능 병목을 어떻게 효율적으로 해결할 수 있는지 체득했습니다. 기술적 선택이 단순한 취향의 문제를 넘어 서비스의 품질(응답 속도, 리소스 절감)과 직결됨을 깊이 이해했습니다." />
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
