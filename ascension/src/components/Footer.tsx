"use client";

import Image from "next/image";
import SubscribeForm from "@/components/SubscribeForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neptune-blue/30">
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
        <div className="mb-8 flex justify-center">
          <Image
            src="/assets/Welcome_to_The_Ascension_Service__logo_.png"
            alt="The Ascension Service"
            width={120}
            height={45}
            className="h-auto w-[120px]"
          />
        </div>

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
