import React from 'react';

/**
 * HanbokIcon — 경주·전주 한복 대여 카드용 한복 픽토그램.
 *
 * 기존 `👘`(기모노)는 일본 복식이라 한국 한복 대여 항목에 쓰면 정체성이 뒤집힌다.
 * 이모지 집합에는 한복이 없으므로 저고리와 치마 두 덩어리로 직접 그린다.
 *   - 저고리: 짧은 상의 + 옆으로 뻗은 넓은 소매 + 검정 고름
 *   - 치마: 허리에서 아래로 퍼지며 밑단이 살짝 둥근 자락
 * 색은 한복의 전형인 붉은 저고리 / 남색 치마 두 색만 쓴다. 27px(모바일 1.5배)에서도
 * '기모노'가 아니라 '한복 차림'으로 읽히도록 디테일(주름·동정)은 넣지 않았다.
 * 크기는 부모 글자 크기(1em)를 따라가 이모지 자리(<span className="text-[18px]">)와 같은 줄 높이에 놓인다.
 */
export default function HanbokIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="hanbok"
      focusable="false"
      className={className}
      style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: '-0.125em' }}
    >
      {/* 치마 */}
      <path d="M8.8 13.6h14.4L25.8 28.8q-9.8 2.4-19.6 0z" fill="#1e3a8a" />
      {/* 소매 */}
      <rect x="3" y="7.6" width="7" height="3.6" rx="1.4" transform="rotate(-10 6.5 9.4)" fill="#dc2626" />
      <rect x="22" y="7.6" width="7" height="3.6" rx="1.4" transform="rotate(10 25.5 9.4)" fill="#dc2626" />
      {/* 저고리 */}
      <path d="M9.6 6h12.8l.6 7.8H9z" fill="#dc2626" />
      {/* 고름 */}
      <path d="M8.8 13.4h14.4" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
