"use client";

import { useState } from "react";
import ScrollingBanner from "@/components/ScrollingBanner";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { href: "#manifesto", label: "MANIFESTO" },
  { href: "#reflections", label: "REFLECTIONS" },
  { href: "#steward", label: "STEWARD" },
  { href: "#music", label: "MUSIC" },
  { href: "#events", label: "EVENTS" },
  { href: "#contact", label: "REACH OUT" },
];

const panels = Array.from({ length: 25 }, (_, i) => `/assets/panels/panel-${25 + i}.jpg`);

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const handleClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="overflow-hidden bg-black">
        <ScrollingBanner images={panels} direction="right" speed={80} height={56} />
      </div>

      <div className="relative h-10 bg-[var(--tas-bg)] border-b border-[var(--tas-border)]">
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[2px] w-6 bg-[var(--tas-fg)] transition-transform duration-200 ${
                menuOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-[var(--tas-fg)] transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-[var(--tas-fg)] transition-transform duration-200 ${
                menuOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-3 z-50 border border-[var(--tas-border)] bg-[var(--tas-bg)] shadow-lg"
              style={{ minWidth: "220px" }}
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleClick(link.href)}
                  className="block px-6 py-3 font-body text-xs font-black tracking-widest text-[var(--tas-fg)] border-b border-[var(--tas-border)] hover:opacity-70"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={toggle}
                className="block w-full text-left px-6 py-3 font-body text-xs font-black tracking-widest text-[var(--tas-fg)] hover:opacity-70"
              >
                {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
