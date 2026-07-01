"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScrollTo } from "@/lib/hooks/useScrollTo";
import { captureButtonClick } from "@/lib/analytics/track";
import { navigation, type NavItem } from "@/lib/content";

function isAnchorItem(item: NavItem): item is { id: string; label: string } {
  return "id" in item && Boolean(item.id);
}

type HudNavigationProps = {
  reduceEffects?: boolean;
};

function NavIndicator({ reduceEffects }: { reduceEffects: boolean }) {
  if (reduceEffects) {
    return (
      <span className="absolute -bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-accent" />
    );
  }

  return (
    <motion.span
      layoutId="nav-indicator"
      className="absolute -bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-accent"
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );
}

export function HudNavigation({ reduceEffects = false }: HudNavigationProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = useScrollTo();

  useEffect(() => {
    if (!isHome) return;

    const sectionIds = navigation.filter(isAnchorItem).map((item) => item.id);
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
  }, [isHome]);

  const trackNavClick = (buttonId: string, buttonLabel: string, href?: string) => {
    captureButtonClick({
      buttonId,
      buttonLabel,
      location: "navigation",
      href,
    });
  };

  const handleAnchorClick = (id: string, label: string) => {
    setMenuOpen(false);
    trackNavClick(`nav_${id}`, label, `#${id}`);
    scrollTo(id);
  };

  const isItemActive = (item: NavItem) => {
    if (!isAnchorItem(item)) {
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    }

    return isHome && activeSection === item.id;
  };

  const renderNavItem = (item: NavItem) => {
    const active = isItemActive(item);
    const className = `relative font-mono px-3 py-1.5 text-xs tracking-widest uppercase transition-colors hover:text-accent ${
      active ? "nav-link-active" : "text-text-secondary"
    }`;

    if (!isAnchorItem(item)) {
      return (
        <Link
          href={item.href}
          className={className}
          onClick={() => {
            setMenuOpen(false);
            trackNavClick(`nav_${item.href.replace(/\//g, "_")}`, item.label, item.href);
          }}
        >
          {item.label}
          {active && <NavIndicator reduceEffects={reduceEffects} />}
        </Link>
      );
    }

    if (isHome) {
      return (
        <button onClick={() => handleAnchorClick(item.id, item.label)} className={className}>
          {item.label}
          {active && <NavIndicator reduceEffects={reduceEffects} />}
        </button>
      );
    }

    return (
      <Link href={`/#${item.id}`} className={className} onClick={() => setMenuOpen(false)}>
        {item.label}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-4 pt-4 md:px-8">
      <nav className="glass-panel nav-blur mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 md:px-8">
        <Link
          href={isHome ? "#inicio" : "/#inicio"}
          onClick={(event) => {
            if (isHome) {
              event.preventDefault();
              handleAnchorClick("inicio", "Início");
            } else {
              setMenuOpen(false);
            }
          }}
          className="font-display text-sm font-bold tracking-wider text-accent md:text-base"
          aria-label="Ir para início"
        >
          [GS]
        </Link>

        <ul className="hidden items-center gap-1 md:flex lg:gap-2">
          {navigation.map((item) => (
            <li key={isAnchorItem(item) ? item.id : item.href}>{renderNavItem(item)}</li>
          ))}
        </ul>

        <button
          className="font-mono text-xs tracking-widest text-accent md:hidden"
          onClick={() => {
            const next = !menuOpen;
            setMenuOpen(next);
            captureButtonClick({
              buttonId: "nav_mobile_menu",
              buttonLabel: next ? "Abrir menu" : "Fechar menu",
              location: "navigation",
            });
          }}
          aria-expanded={menuOpen}
          aria-label="Abrir menu de navegação"
        >
          {menuOpen ? "[X]" : "[≡]"}
        </button>
      </nav>

      {menuOpen && (
        <div className="glass-panel nav-blur mx-auto mt-2 max-w-6xl rounded-2xl p-4 md:hidden">
          <ul className="flex flex-col gap-2">
            {navigation.map((item) => (
              <li key={isAnchorItem(item) ? item.id : item.href}>
                {isAnchorItem(item) ? (
                  isHome ? (
                    <button
                      onClick={() => handleAnchorClick(item.id, item.label)}
                      className={`font-mono w-full py-2 text-left text-xs tracking-widest uppercase transition-colors hover:text-accent ${
                        isItemActive(item) ? "nav-link-active" : "text-text-secondary"
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={`/#${item.id}`}
                      onClick={() => setMenuOpen(false)}
                      className={`font-mono block w-full py-2 text-left text-xs tracking-widest uppercase transition-colors hover:text-accent ${
                        isItemActive(item) ? "nav-link-active" : "text-text-secondary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`font-mono block w-full py-2 text-left text-xs tracking-widest uppercase transition-colors hover:text-accent ${
                      isItemActive(item) ? "nav-link-active" : "text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
