"use client";

import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neptune-blue/30">
      {/* Star divider */}
      <div className="flex justify-center bg-black py-4">
        <Image
          src="/assets/Stars__No_BG_Graphic_.png"
          alt=""
          width={400}
          height={60}
          className="h-[40px] w-auto opacity-60 mix-blend-screen"
        />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-12 text-center md:px-12">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/assets/Welcome_to_The_Ascension_Service__logo_.png"
            alt="The Ascension Service"
            width={120}
            height={45}
            className="h-auto w-[120px]"
          />
        </div>

        {/* Mailing list */}
        <div className="mx-auto mb-8 max-w-md">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="flex-1 border border-neptune-blue/40 bg-transparent px-4 py-2 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
            />
            {/* TODO: wire mailing list to Mailchimp / ConvertKit / Resend */}
            <button className="bg-neptune-blue px-6 py-2 font-body text-sm tracking-wider text-white transition-colors hover:bg-neptune-teal">
              SUBSCRIBE
            </button>
          </div>
        </div>

        {/* TODO: add social links (Instagram, etc.) in footer */}

        <p className="font-body text-xs tracking-wider text-neptune-muted">
          &copy; {year} THE ASCENSION SERVICE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
