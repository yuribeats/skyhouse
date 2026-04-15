"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ScrollingBanner from "@/components/ScrollingBanner";

const links = [
  { href: "/events", label: "EVENTS" },
  { href: "/press", label: "PRESS" },
  { href: "/shop", label: "SHOP" },
  { href: "/community", label: "COMMUNITY", children: [
    { href: "/community?view=gallery", label: "GALLERY" },
    { href: "/community?view=mint", label: "JOIN / MINT" },
  ]},
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
      <nav className="relative border-b border-neptune-blue/30 bg-white" style={{ overflow: 'visible', zIndex: 5 }}>
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 md:px-12 md:py-8">
          <Link
            href="/"
            className="font-display text-xl text-neptune-blue transition-colors duration-200 hover:text-neptune-teal md:text-4xl"
          >
            The Ascension Service
          </Link>

          {/* Neptune globe — center, overlaps banners */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 hidden md:block" style={{ top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
            <Image
              src="/assets/neptune-globe-cropped.png"
              alt="Neptune"
              width={200}
              height={200}
              className="h-[200px] w-[200px] rounded-full object-cover"
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
                  <div key={link.href} className="group/nav relative">
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-6 py-3 font-body text-sm font-black tracking-widest transition-colors duration-200 hover:bg-neptune-blue/5 hover:text-neptune-teal border-b border-neptune-blue/10 ${
                        pathname === link.href || pathname.startsWith(link.href + "?")
                          ? "text-neptune-teal"
                          : "text-neptune-blue"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="hidden group-hover/nav:block">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className="block px-6 py-2 pl-10 font-body text-xs font-black tracking-widest text-neptune-blue/60 transition-colors duration-200 hover:bg-neptune-blue/5 hover:text-neptune-teal border-b border-neptune-blue/10"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
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
