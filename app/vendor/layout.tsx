import type { Metadata } from "next";

/**
 * Vendor 전용 메타데이터.
 * 루트 레이아웃의 Kedheon 제목을 그대로 두면 브라우저 탭·공유 카드·검색 결과에
 * "Kedheon"만 뜨고 Vendor가 사라진다(설계서 5.1 · 12번). 그래서 앱 세그먼트에서 덮어쓴다.
 */
export const metadata: Metadata = {
  title: "Vendor | Real-Economy Exchange — Pi로 사고파는 실물 경제 거래소",
  description:
    "238개국에서 인력·동네 당근·B2B 실물을 Pi로 직거래. 모집→예약→완료 상태 잠금, 이행(만남·택배·컨테이너·원격)과 정산(즉시·30/70 분할) 분리, Pi KYC 1계정과 실거래 원장만이 신뢰가 됩니다. 10개국어.",
  metadataBase: new URL("https://vendor.kedheon.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vendor | Real-Economy Exchange",
    description:
      "Work, neighbourhood goods and heavy equipment traded directly in Pi across 238 countries. Deal states, handoff and settlement kept apart, trust only from verified trades.",
    url: "https://vendor.kedheon.com",
    siteName: "Vendor",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/vendor-hero.png",
        width: 1024,
        height: 1024,
        alt: "Vendor — merchant cat with a needle and a satellite, VENDOR nameplate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendor | Real-Economy Exchange",
    description:
      "From a needle to a satellite — work, barter and real goods on one Pi KYC account. Terms in one line, trust from the ledger.",
    images: ["/vendor-hero.png"],
  },
  robots: { index: true, follow: true },
};

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
