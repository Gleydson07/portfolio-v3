import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { siteConfig } from "@/lib/content";
import { HeroSection } from "@/components/sections/HeroSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <section id="inicio" className="relative scroll-mt-24">
        <HeroSection />
      </section>

      <SectionWrapper id="expertise">
        <ExpertiseSection />
      </SectionWrapper>

      <SectionWrapper id="experiencia">
        <ExperienceSection />
      </SectionWrapper>

      <SectionWrapper id="contato">
        <ContactSection />
      </SectionWrapper>

      <footer className="relative z-10 border-t border-glass-border py-10 text-center">
        <p className="font-mono text-xs tracking-widest text-text-secondary">
          © {new Date().getFullYear()} {siteConfig.name} · gsantos.dev.br
        </p>
      </footer>
    </>
  );
}
