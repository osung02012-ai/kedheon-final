import type { Metadata } from 'next';
import TermsDoc from './TermsDoc';

/**
 * /terms — 이용약관 (한국어 / English)
 *
 * Pi 메인넷 리스팅 필수 요건(terms_of_service_url). 연계 앱 푸터의
 * '/privacy · /terms' 링크와 Pi 개발자 콘솔의 3종 Mainnet 앱이 이 경로를 가리킨다.
 * 서브도메인(civil·factfilter·hangang·xaea12·vendor.kedheon.com)에서도
 * middleware.ts 가 /terms 를 리라이트하지 않아 같은 문서가 그대로 열린다.
 */
export const metadata: Metadata = {
  title: '이용약관 | Terms of Service — Kedheon',
  description:
    'Kedheon.pi 연계 앱(Kedheon · Civil · FactFilter · Hangang · XAEA12 · Vendor)의 이용약관. 서비스 내용, Pi 로그인과 이용자 책임, BEOM 활동 포인트, 팩트체크 투표·북마크 데이터, 서비스 변경·면책, 준거법과 문의처를 안내합니다.',
  alternates: {
    canonical: 'https://kedheon.com/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '이용약관 | Terms of Service — Kedheon',
    description:
      'Kedheon.pi 연계 앱 공통 이용약관. BEOM은 활동 지표용 내부 포인트이며 현금·암호화폐 가치를 보장하지 않습니다.',
    url: 'https://kedheon.com/terms',
    siteName: 'Kedheon',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsDoc />;
}
