"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ScrollingBanner from "@/components/ScrollingBanner";

const links = [
  { href: "/events", label: "EVENTS" },
  { href: "/press", label: "PRESS" },
  { href: "/shop", label: "SHOP" },
  { href: "/contact", label: "CONTACT" },
];

const row1 = Array.from({ length: 13 }, (_, i) => `/assets/panels/panel-${25 + i}.jpg`);
const row2 = Array.from({ length: 12 }, (_, i) => `/assets/panels/panel-${38 + i}.jpg`);

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Banner above nav */}
      <div className="overflow-hidden bg-black">
        <ScrollingBanner images={row1} direction="left" speed={60} height={36} />
      </div>

      {/* Nav bar */}
      <nav
        className={`border-b border-neptune-blue/30 transition-colors duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-black/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 md:px-12">
          <Link href="/">
            <Image
              src="/assets/Welcome_to_The_Ascension_Service__logo_.png"
              alt="The Ascension Service"
              width={160}
              height={60}
              preload
              className="h-auto w-[120px] md:w-[160px]"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm tracking-widest transition-colors duration-200 hover:text-neptune-teal ${
                  pathname === link.href
                    ? "text-neptune-teal"
                    : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[2px] w-6 bg-white transition-transform duration-200 ${
                menuOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-white transition-transform duration-200 ${
                menuOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Banner below nav */}
      <div className="overflow-hidden bg-black">
        <ScrollingBanner images={row2} direction="right" speed={50} height={36} />
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-0 z-40 flex flex-col items-center justify-center gap-10 bg-black md:hidden">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-2xl text-white"
            aria-label="Close menu"
          >
            X
          </button>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-body text-2xl tracking-widest transition-colors duration-200 hover:text-neptune-teal ${
                pathname === link.href ? "text-neptune-teal" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
