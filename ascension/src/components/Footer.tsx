"use client";

import SubscribeForm from "@/components/SubscribeForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--tas-border)]">
      <div className="mx-auto max-w-[1200px] px-6 py-2 text-center md:px-12 md:py-3">
        <p className="mb-1 font-display text-2xl text-[var(--tas-fg)] md:text-3xl">
          Stay in the current
        </p>
        <div className="mx-auto mb-2 max-w-md">
          <SubscribeForm />
        </div>

        <p className="font-body text-[10px] tracking-wider text-[var(--tas-muted)] md:text-xs">
          &copy; {year} THE ASCENSION SERVICE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
