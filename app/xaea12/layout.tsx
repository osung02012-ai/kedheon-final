import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XAEA12 | Short by N Pi · Pi ecosystem wish & gift playground",
  description:
    "When a BNPi home, a Hangang trip, an ecosystem order or a daily emergency is a few Pi short, pioneers chip in 1 Pi or finish it in one tap. Two-stage roadmap (Test-Pi rehearsal → Mainnet), 10 languages, and three safety rails: zero celebrities, zero personal data, zero draws.",
  metadataBase: new URL("https://xaea12.kedheon.com"),
  openGraph: {
    title: "XAEA12 | Short by N Pi",
    description:
      "The mutual-aid playground of the Kedheon ecosystem: stories that are N Pi short, filled by pioneers — 1 Pi at a time or in one full rescue. @username and pure Pi only, no prizes and no draws.",
    url: "https://xaea12.kedheon.com",
    siteName: "XAEA12",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/xaea12-hero.jpg",
        width: 1024,
        height: 1024,
        alt: "XAEA12 — neon panther with an X emblem and PIONEER, gold coins in its paw, xaea12.pi nameplate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XAEA12 | Short by N Pi",
    description:
      "Stories that are N Pi short — pioneers add 1 Pi or finish the gap in one tap. Test-Pi rehearsal now, on-chain Pi next.",
    images: ["/xaea12-hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function Xaea12Layout({ children }: { children: React.ReactNode }) {
  return children;
}
