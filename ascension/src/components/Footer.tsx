"use client";

import SubscribeForm from "@/components/SubscribeForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neptune-blue/30">
      <div className="mx-auto max-w-[1200px] px-6 py-12 text-center md:px-12">
        <div className="mx-auto mb-8 max-w-md">
          <SubscribeForm />
        </div>

        <p className="font-body text-xs tracking-wider text-neptune-muted">
          &copy; {year} THE ASCENSION SERVICE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
