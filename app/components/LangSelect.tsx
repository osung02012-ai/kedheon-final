'use client';

import React from 'react';

/**
 * LangSelect — 상단 언어 선택(🇰🇷 KR ▾), 4대 앱 공통 규격.
 *
 * 예전 구현은 `<select>` 자체에 테두리·모서리를 주고 그 위에 화살표 칸을
 * `absolute inset-y-0 right-0` 으로 덮었다. Pi Browser(글꼴 1.5배)에서 셀렉트 높이와
 * 화살표 칸 높이가 반올림 때문에 어긋나, 화살표 칸이 테두리 밖으로 1px 튀어나와
 * `KR` 상자 오른쪽이 사각으로 삐져나온 것처럼 보였다.
 *
 * 이제 테두리·모서리·overflow는 바깥 래퍼가 갖고, `<select>` 는 테두리 없는 투명 배경으로
 * 래퍼 안을 그대로 채운다. 래퍼 높이는 곧 셀렉트 높이이고 화살표 칸은 `inset-y-0` 으로
 * 그 높이에 정확히 붙으므로, 배율이 어떻든 오른쪽 모서리가 깔끔하게 잘린다.
 */
export default function LangSelect({
  value,
  onChange,
  options,
  ariaLabel = 'Language',
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel?: string;
}) {
  return (
    <div className="relative shrink-0 inline-flex items-stretch rounded-lg border border-neutral-300 bg-white shadow-xs overflow-hidden transition-colors focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="appearance-none min-w-0 bg-transparent border-0 text-black t-tag rounded-none pl-2 pr-7 py-1 outline-none cursor-pointer"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 flex w-5 items-center justify-center border-l border-neutral-200 bg-neutral-50 text-neutral-500"
      >
        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
