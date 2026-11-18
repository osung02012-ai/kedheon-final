'use client';

import React from 'react';

/** 섹션 머리글 — 케데헌 공통 규격(빨간 상단 괘선 · 검정 제목 · 회색 설명) */
export default function SectionHead({
  no,
  title,
  desc,
}: {
  no: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mt-4 mb-1.5 text-left border-t border-[#dc2626] pt-2">
      <div className="flex items-baseline gap-2">
        <span className="t-tag text-[#dc2626] shrink-0">{no}</span>
        <h2 className="t-section text-neutral-900 uppercase border-l-[3px] border-neutral-900 pl-2">{title}</h2>
      </div>
      <p className="t-sub text-neutral-500 mt-1 pl-[13px]">{desc}</p>
    </div>
  );
}
