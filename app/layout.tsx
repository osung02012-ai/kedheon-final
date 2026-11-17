import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PiProvider from "./components/PiProvider";
import { PI_TEXT_SCALE_SCRIPT } from "./components/piTextScale";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kedheon | Web3 Infrastructure & Pi Ecosystem Portal",
  description: "Global standard for verifiable KYC voting, smart security QR, and Web3 ecosystem rewards. Powered by Kedheon.",
  metadataBase: new URL("https://kedheon.com"),
  openGraph: {
    title: "Kedheon | Web3 Infrastructure & Pi Ecosystem Portal",
    description: "Global standard for verifiable KYC voting, smart security QR, and Web3 ecosystem rewards. Powered by Kedheon.",
    url: "https://kedheon.com",
    siteName: "Kedheon",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kedheon | Web3 Infrastructure & Pi Ecosystem Portal",
    description: "Global standard for verifiable KYC voting, smart security QR, and Web3 ecosystem rewards.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/*
          Pi Browser(안드로이드 WebView) 글자 배율 자동 보정 — 5개 앱 공통
          · 첫 페인트 전에 --pi-scale 을 정해야 큰 글씨로 그렸다가 줄어드는 깜빡임이 없다.
          · 일반 브라우저에서는 --pi-scale = 1 이라 화면이 예전과 완전히 동일하다.
          · <html> 의 style·data 속성을 하이드레이션 전에 건드리므로 suppressHydrationWarning.
        */}
        <script
          id="pi-text-scale"
          dangerouslySetInnerHTML={{ __html: PI_TEXT_SCALE_SCRIPT }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PiProvider>{children}</PiProvider>
      </body>
    </html>
  );
}
