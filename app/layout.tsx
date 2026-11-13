import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
