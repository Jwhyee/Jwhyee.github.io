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
            <Markdown content="퇴사 후 동기들과 사이드 프로젝트를 진행하며 리뷰 기능에 비속어 필터링이 필요했습니다. 라이브러리 대신 직접 구현하면서 배우자는 판단으로 리서치를 시작했고, [우아한형제들 기술 블로그](https://techblog.woowahan.com/15764)를 통해 기존 방식의 한계를 분석했습니다." />
          </div>
          <p>
            <Markdown content="정규식은 금칙어가 늘수록 O(N×K)로 느려지고, '시1발' 같은 변칙 표현을 커버하려면 패턴이 기하급수적으로 복잡해지는 구조적 문제가 있었습니다." />
          </p>
          <p>
            <Markdown content="단순 구현에 그치지 않고 JMH로 기존 방식과 직접 비교 측정하는 것까지 스스로 범위를 확장했습니다. 결과적으로 사이드 프로젝트는 무산됐지만 라이브러리는 끝까지 완성해 Jitpack에 배포했습니다." />
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
            <p className="text-[12pt] font-black text-emerald-400">22.4x</p>
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

        <div className="space-y-3">
          <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest">Core Architecture</h3>
          <p className="text-zinc-400 text-[10pt] leading-relaxed">
            <Markdown content="Trie 자료구조를 기반으로 **Failure Function**을 결합한 아호코라식 알고리즘을 핵심 엔진으로 채택했습니다. 매칭 실패 시 루트로 돌아가지 않고 매칭된 접두사의 가장 긴 접미사 노드로 즉시 이동하여 입력 문자열을 단 한 번만 순회(**O(N)**)하도록 설계했습니다." />
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest">Deployment (Jitpack)</h3>
          <p className="text-zinc-400 text-[10pt] leading-relaxed">
            <Markdown content="오픈소스 라이브러리로 배포하기 위해 Jitpack을 선택했습니다. GitHub 리포지토리의 태그 릴리즈로 버전을 관리하며, `Gradle` 및 `Maven` 환경에서 의존성 한 줄만 추가하면 바로 사용할 수 있도록 구성했습니다." />
          </p>
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
          {/* Problem 1 - Toggle Code */}
          <div className="space-y-4 print:break-inside-avoid">
            <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
              Problem 01: Normalization Index Mismatch
            </div>
            <h3 className="text-[12pt] font-bold text-white tracking-tight">변칙 우회 방어 및 원본 인덱스 복원 알고리즘</h3>
            <div className="text-[10pt] text-zinc-400 leading-relaxed">
              <Markdown content="정규화 과정에서 텍스트 길이가 바뀌면 탐지된 인덱스와 원본 인덱스가 어긋납니다. IntArray 매핑 테이블로 정규화 전후 위치를 추적해 마스킹 위치 오차를 잡았습니다." />
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

          {/* Problem 2 - Toggle Code */}
          <div className="space-y-4 print:break-inside-avoid">
            <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
              Problem 02: False Positives
            </div>
            <h3 className="text-[12pt] font-bold text-white tracking-tight">정상 단어 보호를 위한 Interval Overlap 로직</h3>
            <div className="text-[10pt] text-zinc-400 leading-relaxed">
              <Markdown content="금칙어 구간이 허용 단어 구간에 포함될 경우(예: '시발' ⊂ '시발점') 마스킹에서 제외해야 합니다. 두 구간의 겹침 여부를 판단하는 로직으로 이 문제를 처리했습니다." />
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
            <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
              <Markdown content="알고리즘 도입으로 실제로 얼마나 차이를 만드는지 JMH로 직접 측정해보기 전까지는 확신이 없었습니다. 수치로 확인하고 나서야 기술 선택이 서비스 품질과 직결된다는 걸 체감했습니다." />
            </p>
            <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
              <Markdown content="처음으로 다른 개발자가 쓸 라이브러리를 만들어보면서, 내가 편한 구조와 쓰는 사람이 편한 구조가 다르다는 걸 알았습니다. API 설계와 Jitpack 배포 과정이 생각보다 신경 쓸 게 많았지만, 이 과정이 재미있게 느껴졌습니다." />
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
