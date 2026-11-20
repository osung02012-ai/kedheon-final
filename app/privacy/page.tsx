import type { Metadata } from 'next';
import PrivacyDoc from './PrivacyDoc';

/**
 * /privacy — 개인정보 처리방침 (한국어 / English)
 *
 * Pi Next 해커톤·메인넷 리스팅 필수 요건. 6개 앱의 하단 푸터에서 이 경로로 연결한다.
 * 서브도메인(civil·factfilter·hangang·xaea12·vendor.kedheon.com)에서도
 * middleware.ts 가 /privacy 를 리라이트하지 않아 같은 문서가 그대로 열린다.
 */
export const metadata: Metadata = {
  title: '개인정보 처리방침 | Privacy Policy — Kedheon',
  description:
    'Kedheon.pi 연계 앱(Kedheon · Civil · FactFilter · Hangang · XAEA12 · Vendor)의 개인정보 처리방침. 수집 항목, 이용 목적, 보관·파기, 제3자 제공, 이용자 권리와 문의처를 안내합니다.',
  alternates: {
    canonical: 'https://kedheon.com/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '개인정보 처리방침 | Privacy Policy — Kedheon',
    description:
      'Kedheon.pi 연계 앱 공통 개인정보 처리방침. 실명·비밀번호·24단어 비밀구절은 수집하지 않습니다.',
    url: 'https://kedheon.com/privacy',
    siteName: 'Kedheon',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyDoc />;
}
