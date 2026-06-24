import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AmbientOrbs } from "@/components/layout/AmbientOrbs";
import { GridBackground } from "@/components/layout/GridBackground";
import { HudNavigation } from "@/components/layout/HudNavigation";
import { ScrollProgress, ScrollProgressGlow } from "@/components/layout/ScrollProgress";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
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
    "Desenvolvedor full-stack",
    "Engenheiro de software",
    "Arquitetura de software",
    "NestJS",
    "Docker",
    "React",
    "Next.js",
    "TypeScript",
    "Inteligência Artificial",
    "LLMs",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
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
        <SmoothScrollProvider>
          <ScrollProgress />
          <ScrollProgressGlow />
          <GridBackground />
          <AmbientOrbs />
          <HudNavigation />
          <main className="relative z-10">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
