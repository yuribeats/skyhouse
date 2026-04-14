"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SubscribeForm from "@/components/SubscribeForm";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire contact form to Resend / Formspree / email API
    setSubmitted(true);
  };

  return (
    <motion.div
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="mb-2 font-display text-5xl text-white md:text-6xl">
          Get in Touch
        </h1>
        <div className="mb-16 h-[2px] w-16 bg-neptune-blue" />
      </motion.div>

      <div className="grid gap-16 md:grid-cols-2">
        {/* Booking form */}
        <motion.div variants={fadeUp}>
          {submitted ? (
            <p className="font-display text-3xl text-neptune-teal">
              We&apos;ll be in touch.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="NAME"
                required
                className="border border-neptune-blue/40 bg-transparent px-4 py-3 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
              />
              <input
                type="email"
                placeholder="EMAIL"
                required
                className="border border-neptune-blue/40 bg-transparent px-4 py-3 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
              />
              <input
                type="text"
                placeholder="ORGANIZATION / VENUE"
                className="border border-neptune-blue/40 bg-transparent px-4 py-3 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
              />
              <div className="relative border border-neptune-blue/40 transition-colors focus-within:border-neptune-teal">
                <select
                  required
                  defaultValue=""
                  className="w-full appearance-none bg-transparent px-4 py-3 font-body text-sm tracking-wider text-white outline-none [&>option]:bg-black [&>option]:text-white"
                >
                  <option value="" disabled>
                    EVENT TYPE
                  </option>
                  <option value="performance">PERFORMANCE</option>
                  <option value="workshop">WORKSHOP</option>
                  <option value="private">PRIVATE SESSION</option>
                  <option value="other">OTHER</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neptune-muted">
                  V
                </div>
              </div>
              <textarea
                placeholder="MESSAGE"
                rows={5}
                required
                className="resize-none border border-neptune-blue/40 bg-transparent px-4 py-3 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
              />
              <button
                type="submit"
                className="bg-neptune-blue px-8 py-3 font-body text-sm tracking-wider text-white transition-colors hover:bg-neptune-teal"
              >
                SEND
              </button>
            </form>
          )}
        </motion.div>

        {/* Info block */}
        <motion.div variants={fadeUp} className="flex flex-col gap-6">
          <h2 className="font-display text-3xl text-white">
            Bookings & Press
          </h2>
          <p className="font-body text-sm leading-relaxed text-neptune-muted">
            For press inquiries, licensing, and private engagements.
          </p>
          <div className="mt-4 flex justify-center md:justify-start">
            <Image
              src="/assets/Single_Neptune__No_BG_Graphic_.png"
              alt=""
              width={200}
              height={200}
              className="h-auto w-[200px] opacity-60"
            />
          </div>
        </motion.div>
      </div>

      {/* Mailing list */}
      <motion.div variants={fadeUp} className="mt-24 border-t border-neptune-blue/30 pt-16 text-center">
        <p className="mb-6 font-display text-3xl text-white">
          Stay in the current
        </p>
        <div className="mx-auto max-w-md">
          <SubscribeForm />
        </div>
      </motion.div>
    </motion.div>
  );
}
