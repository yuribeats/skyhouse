"use client";

import SubscribeForm from "@/components/SubscribeForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neptune-blue/30">
      <div className="mx-auto max-w-[1200px] px-6 py-16 text-center md:px-12">
        <p className="mb-6 font-display text-3xl text-white">
          Stay in the current
        </p>
        <div className="mx-auto mb-10 max-w-md">
          <SubscribeForm />
        </div>

        <p className="font-body text-xs tracking-wider text-neptune-muted">
          &copy; {year} THE ASCENSION SERVICE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
