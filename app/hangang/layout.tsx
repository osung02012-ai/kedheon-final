import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hangang | Korea-Wide K-Culture Pass for Pi",
  description:
    "Concert, hanok, folk village, beach and island packages across 7 regions of Korea — Seoul, Yongin, Busan, Gyeongju, Jeju, Jeonju·Gangneung and the DMZ. Transit tips, tax refund and closing days in 10 languages. Pi KYC identity, 0% direct-deal fee.",
  metadataBase: new URL("https://hangang.kedheon.com"),
  openGraph: {
    title: "Hangang | Korea-Wide K-Culture Pass for Pi",
    description:
      "7 regions of Korea in one Pi pass: Seoul concerts, Yongin Folk Village, Busan, Gyeongju, Jeju, Jeonju·Gangneung and the DMZ — with real transit tips and a nationwide safety shield. 10 languages, Pi KYC verified.",
    url: "https://hangang.kedheon.com",
    siteName: "Hangang",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/hangang-hero.jpg",
        width: 1024,
        height: 1024,
        alt: "Hangang tiger guardian — classic Korean minhwa painting with hangang.pi nameplate, Korea-wide K-Culture Pass for Pi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hangang | Korea-Wide K-Culture Pass for Pi",
    description:
      "Seoul, Yongin, Busan, Gyeongju, Jeju, Jeonju·Gangneung, DMZ — stays, culture, food and transit in one Pi pass.",
    images: ["/hangang-hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function HangangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
