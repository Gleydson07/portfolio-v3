import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AnalyticsShell } from "@/components/analytics/AnalyticsShell";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { siteConfig } from "@/lib/content";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    siteConfig.name,
    "Desenvolvedor Backend",
    "Desenvolvedor Fullstack",
    "Engenheiro de Software",
    "Node.js",
    "NestJS",
    "TypeScript",
    "Arquitetura de Software",
    "Clean Architecture",
    "React",
    "Next.js",
    "Docker",
    "Inteligência Artificial",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: `${siteConfig.name} — Desenvolvedor Backend · Node.js · NestJS · TypeScript`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name} — Desenvolvedor Backend · Node.js · NestJS · TypeScript` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Desenvolvedor Backend · Node.js · NestJS · TypeScript`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
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
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <SiteChrome>{children}</SiteChrome>
        <AnalyticsShell />
      </body>
    </html>
  );
}
