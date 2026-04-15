"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ScrollingBanner from "@/components/ScrollingBanner";

const links = [
  { href: "/feed", label: "FEED" },
  { href: "/events", label: "EVENTS" },
  { href: "/press", label: "PRESS" },
  { href: "/shop", label: "SHOP" },
  { href: "/community", label: "COMMUNITY" },
  { href: "/contact", label: "CONTACT" },
];

const row1 = Array.from({ length: 13 }, (_, i) => `/assets/panels/panel-${25 + i}.jpg`);
const row2 = Array.from({ length: 12 }, (_, i) => `/assets/panels/panel-${38 + i}.jpg`);

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Banner above nav */}
      <div className="overflow-hidden bg-black">
        <ScrollingBanner images={row1} direction="left" speed={60} height={72} />
      </div>

      {/* Nav bar */}
      <nav className="relative border-b border-neptune-blue/30 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 md:px-12 md:py-8">
          <Link
            href="/"
            className="font-display text-xl text-neptune-blue transition-colors duration-200 hover:text-neptune-teal md:text-4xl"
          >
            The Ascension Service
          </Link>

          {/* Neptune globe — center */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <Image
              src="/assets/neptune-globe-cropped.png"
              alt="Neptune"
              width={80}
              height={80}
              className="h-[80px] w-[80px] rounded-full object-cover"
            />
          </Link>

          {/* Hamburger button */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-[2px] w-6 bg-neptune-blue transition-transform duration-200 ${
                  menuOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-neptune-blue transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-neptune-blue transition-transform duration-200 ${
                  menuOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-4 z-50 border border-neptune-blue/30 bg-white shadow-lg"
                style={{ minWidth: '200px' }}
              >
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-6 py-3 font-body text-sm font-black tracking-widest transition-colors duration-200 hover:bg-neptune-blue/5 hover:text-neptune-teal border-b border-neptune-blue/10 last:border-b-0 ${
                      pathname === link.href ? "text-neptune-teal" : "text-neptune-blue"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Banner below nav */}
      <div className="overflow-hidden bg-black">
        <ScrollingBanner images={row2} direction="right" speed={50} height={72} />
      </div>
    </header>
  );
}
