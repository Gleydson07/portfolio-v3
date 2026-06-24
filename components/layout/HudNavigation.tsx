"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScrollTo } from "@/lib/hooks/useScrollTo";
import { navigation } from "@/lib/content";

export function HudNavigation() {
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const sectionIds = navigation.map((item) => item.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-4 pt-4 md:px-8">
      <nav className="glass-panel nav-blur mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 md:px-8">
        <button
          onClick={() => handleNavClick("inicio")}
          className="font-display text-sm font-bold tracking-wider text-accent md:text-base"
          aria-label="Ir para início"
        >
          [GS]
        </button>

        <ul className="hidden items-center gap-1 md:flex lg:gap-2">
          {navigation.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                className={`relative font-mono px-3 py-1.5 text-xs tracking-widest uppercase transition-colors hover:text-accent ${
                  activeSection === item.id ? "nav-link-active" : "text-text-secondary"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="font-mono text-xs tracking-widest text-accent md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Abrir menu de navegação"
        >
          {menuOpen ? "[X]" : "[≡]"}
        </button>
      </nav>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel nav-blur mx-auto mt-2 max-w-6xl rounded-2xl p-4 md:hidden"
        >
          <ul className="flex flex-col gap-2">
            {navigation.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`font-mono w-full py-2 text-left text-xs tracking-widest uppercase transition-colors hover:text-accent ${
                    activeSection === item.id ? "nav-link-active" : "text-text-secondary"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </header>
  );
}
