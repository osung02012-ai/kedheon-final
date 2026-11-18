'use client';

import React from 'react';
import { BADGE_LABEL, BADGE_STYLE, type BadgeKind } from '../lib/badges';
import { tr, type Lang } from '../lib/i18n';

/** 인증 뱃지 1개 — 카드 제목 옆이나 위에 붙인다. */
export default function AuthBadge({
  kind,
  lang,
  className = '',
}: {
  kind: BadgeKind;
  lang: Lang;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center shrink-0 whitespace-nowrap rounded-full px-[7px] py-[2px] t-tag ${BADGE_STYLE[kind]} ${className}`}
    >
      {tr(BADGE_LABEL[kind], lang)}
    </span>
  );
}
