/* ------------------------------------------------------------------
 * Hangang — 프리미엄 3일 코스 (Kedheon.pi Pass 전용)
 *
 *  · 새로 지어낸 장소를 넣지 않는다. 권역 데이터(ZONES)의 실제 선택지 중에서
 *    도착·숙소 → 문화 → 음식 순으로 3일을 구성하고, 예산은 그 선택지의 Pi 합계다.
 *  · 문구는 기존 L10(10개국어) 값을 그대로 쓰므로 번역이 늘어나지 않는다.
 *  · .ics는 외부 서비스 없이 브라우저에서 만든다(개인 일정에 저장).
 * ------------------------------------------------------------------ */

import { ZONES, type Zone } from './zones';
import type { L10 } from './i18n';

export interface CourseItem {
  label: L10;
  pi: number;
}

export interface CourseDay {
  day: number;
  items: CourseItem[];
  budget: number;
}

export interface PremiumCourse {
  zoneKey: string;
  code: string;
  days: CourseDay[];
  total: number;
}

function item(zone: Zone, key: 'stay' | 'culture' | 'food' | 'transit', index: number): CourseItem {
  const option = zone.picks[key][Math.min(index, zone.picks[key].length - 1)];
  return { label: option.t, pi: option.pi };
}

/** 권역 하나의 3일 코스 — 도착·숙소 → 문화·음식 → 문화·음식 */
export function premiumCourseOf(zoneKey: string): PremiumCourse | null {
  const zone = ZONES.find(z => z.key === zoneKey);
  if (!zone) return null;

  const planned: Array<Array<CourseItem>> = [
    [item(zone, 'stay', 0), item(zone, 'transit', 0), item(zone, 'food', 0)],
    [item(zone, 'culture', 0), item(zone, 'food', 1)],
    [item(zone, 'culture', 1), item(zone, 'food', 2)]
  ];

  const days: CourseDay[] = planned.map((items, i) => ({
    day: i + 1,
    items,
    budget: items.reduce((sum, it) => sum + it.pi, 0)
  }));

  return {
    zoneKey: zone.key,
    code: zone.code,
    days,
    total: days.reduce((sum, d) => sum + d.budget, 0)
  };
}

function icsDate(date: Date): string {
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}`;
}

function icsEscape(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/**
 * 3일 코스를 달력 파일로 만든다. 내일부터 하루씩(종일 일정).
 * `langIndex`는 L10 배열의 언어 위치(0=KR … 9=ID).
 */
export function buildIcs(course: PremiumCourse, langIndex: number, startFrom = new Date()): string {
  const uidBase = `hangang-${course.zoneKey.toLowerCase()}-${Date.now().toString(36)}`;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kedheon//Hangang Pass//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  course.days.forEach((day, index) => {
    const start = new Date(Date.UTC(startFrom.getUTCFullYear(), startFrom.getUTCMonth(), startFrom.getUTCDate() + 1 + index));
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    const summary = `Hangang · ${course.code} · Day ${day.day}`;
    const description = day.items.map(it => it.label[langIndex] ?? it.label[1]).join(' / ') + ` — ${day.budget} Pi`;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uidBase}-${day.day}@kedheon.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(start)}`,
      `DTEND;VALUE=DATE:${icsDate(end)}`,
      `SUMMARY:${icsEscape(summary)}`,
      `DESCRIPTION:${icsEscape(description)}`,
      `URL:https://hangang.kedheon.com`,
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

/** 선택한 조합(숙소·문화·음식·교통)을 하루 일정으로 저장 — 예약 모달의 .ics */
export function buildSelectionIcs(
  zone: Zone,
  picks: Record<'stay' | 'culture' | 'food' | 'transit', number>,
  langIndex: number,
  startFrom = new Date()
): string {
  const labels = [
    zone.picks.stay[picks.stay],
    zone.picks.transit[picks.transit],
    zone.picks.culture[picks.culture],
    zone.picks.food[picks.food]
  ];
  const total = labels.reduce((sum, o) => sum + o.pi, 0);
  const start = new Date(Date.UTC(startFrom.getUTCFullYear(), startFrom.getUTCMonth(), startFrom.getUTCDate() + 1));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kedheon//Hangang Pass//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:hangang-${zone.key.toLowerCase()}-${Date.now().toString(36)}@kedheon.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(start)}`,
    `DTEND;VALUE=DATE:${icsDate(end)}`,
    `SUMMARY:${icsEscape(`Hangang · ${zone.code}`)}`,
    `DESCRIPTION:${icsEscape(labels.map(o => o.t[langIndex] ?? o.t[1]).join(' / ') + ` — ${total} Pi`)}`,
    'URL:https://hangang.kedheon.com',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  return lines.join('\r\n') + '\r\n';
}
