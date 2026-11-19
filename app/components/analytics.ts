'use client';

/**
 * Vercel Web Analytics 커스텀 이벤트 래퍼 (Kedheon·Civil·FactFilter·Hangang·XAEA12·Vendor 공통)
 * ---------------------------------------------------------------------------------------
 * · Vercel 프로젝트에서 Web Analytics 가 켜져 있지 않거나, 팀 플랜이 Hobby 라서 커스텀
 *   이벤트(Pro·Enterprise 전용)를 받지 못하는 경우에도 화면 동작은 절대 깨지지 않아야 한다.
 * · track() 은 window.va 큐에 이벤트를 넣는 방식이라 스크립트가 없어도 예외를 던지지 않지만,
 *   SSR·구형 WebView·차단된 스크립트 같은 예외 상황까지 막기 위해 try/catch 로 감싼다.
 * · 이름·속성 규칙(Vercel): 이벤트 이름과 키/값은 255자 이내, 값은 string | number | boolean | null,
 *   중첩 객체는 지원하지 않는다. 속성 개수는 Pro 2개 / Enterprise 8개까지만 저장된다.
 */
import { track } from '@vercel/analytics';

type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: string, properties?: AnalyticsProps) {
  if (typeof window === 'undefined') return;
  try {
    track(name, properties);
  } catch {
    // 분석이 꺼져 있어도 사용자 흐름(복사·이동)은 그대로 진행한다.
  }
}
