import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hangang | Seoul K-Culture Pass for Pi",
  description:
    "Seoul concert packages, National Museum goods, stays, transit and a safety shield — connected by Pi KYC identity. 0% direct-deal fee. Powered by Kedheon.",
  metadataBase: new URL("https://hangang.kedheon.com"),
  openGraph: {
    title: "Hangang | Seoul K-Culture Pass for Pi",
    description:
      "Concert packages across Jamsil, Sangam, Gocheok and Yongsan with stays, food, transit and a Seoul safety shield. Pi KYC verified.",
    url: "https://hangang.kedheon.com",
    siteName: "Hangang",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/hangang-hero.jpg",
        width: 1024,
        height: 1024,
        alt: "Hangang white tiger guardian — Seoul K-Culture Pass for Pi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hangang | Seoul K-Culture Pass for Pi",
    description:
      "Seoul concerts, museum goods, stays, transit and safety in one Pi pass.",
    images: ["/hangang-hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function HangangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
