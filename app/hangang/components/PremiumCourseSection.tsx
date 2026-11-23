'use client';

import React, { useMemo, useState } from 'react';
import { tr, LANG_INDEX, type Lang } from '../lib/i18n';
import { buildIcs, premiumCourseOf } from '../lib/premiumCourses';
import { passT } from '../../components/pass-i18n';

/**
 * PremiumCourseSection — Hangang 프리미엄 3일 코스 (패스 전용)
 *
 *  - 무료 방문자: 잠금 카드 + 패스 안내(누르면 패스 시트). 여행 기본 정보는 그대로 무료.
 *  - 패스 사용자: 권역별 3일 동선과 예산, 내 달력(.ics) 저장.
 *  - 코스 내용은 이 권역의 실제 선택지(ZONES)에서 구성한다 — 새로 지어낸 장소 없음.
 */

export default function PremiumCourseSection({
  zoneKey,
  lang,
  passActive,
  onNeedPass
}: {
  zoneKey: string;
  lang: Lang;
  passActive: boolean;
  onNeedPass: () => void;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const t = (key: Parameters<typeof passT>[1]) => passT(lang, key);
  const course = useMemo(() => premiumCourseOf(zoneKey), [zoneKey]);
  if (!course) return null;

  const saveIcs = () => {
    try {
      const ics = buildIcs(course, LANG_INDEX[lang]);
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hangang-${course.zoneKey.toLowerCase()}-3days.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setMsg(t('icsDone'));
    } catch {
      setMsg(null);
    }
  };

  return (
    <section className="mt-4 text-left">
      <div className="border-t border-[#dc2626] pt-2">
        <div className="flex items-baseline gap-2">
          <span translate="no" className="notranslate t-tag text-[#dc2626] shrink-0">PASS</span>
          <h2 className="t-section text-neutral-900 uppercase border-l-[3px] border-neutral-900 pl-2">
            {t('premiumTitle')}
          </h2>
        </div>
        <p className="t-sub text-neutral-500 mt-1 pl-[13px]">{t('premiumDesc')}</p>
      </div>

      {!passActive ? (
        <div className="mt-2 border border-dashed border-neutral-300 rounded-2xl bg-neutral-50 p-4 text-center space-y-2">
          <p className="t-card text-black">
            <span translate="no" className="notranslate text-[#7d4698] mr-1">π</span>
            {course.code} · {course.days.length} days
          </p>
          <p className="t-sub text-gray-500">{t('premiumDesc')}</p>
          <button
            onClick={onNeedPass}
            className="t-tag bg-black text-white rounded-lg px-3 py-2 hover:bg-[#dc2626] transition-colors active:scale-95"
          >
            {t('badgeStart')} →
          </button>
        </div>
      ) : (
        <>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
            {course.days.map(day => (
              <div key={day.day} className="bg-white border border-neutral-200 rounded-xl p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="t-card text-black">{t('day').replace('{n}', String(day.day))}</p>
                  <p translate="no" className="notranslate t-tag text-[#dc2626]">{day.budget} Pi</p>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {day.items.map((it, i) => (
                    <li key={i} className="t-tag text-neutral-600 flex gap-1.5">
                      <span className="text-[#dc2626]">·</span>
                      <span className="min-w-0">{tr(it.label, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2">
            <p className="t-tag text-neutral-600">
              {t('budget')} <span translate="no" className="notranslate text-black font-black">{course.total} Pi</span>
            </p>
            <button
              onClick={saveIcs}
              className="t-tag bg-black text-white rounded-lg px-2.5 py-1.5 hover:bg-[#dc2626] transition-colors active:scale-95"
            >
              📅 {t('icsBtn')}
            </button>
          </div>
          {msg && <p className="t-tag text-gray-400 mt-1">{msg}</p>}
        </>
      )}
    </section>
  );
}
