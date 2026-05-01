"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
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
        <h1 className="mb-2 font-display text-3xl text-white md:text-6xl">
          Get in Touch
        </h1>
        <div className="mb-16 h-[2px] w-16 bg-neptune-blue" />
      </motion.div>

      <div className="grid gap-8 md:gap-16 md:grid-cols-2">
        {/* Booking form */}
        <motion.div variants={fadeUp}>
          {submitted ? (
            <p className="font-display text-3xl text-neptune-teal">
              We&apos;ll be in touch.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input
                name="name"
                type="text"
                placeholder="NAME"
                required
                className="border border-neptune-blue/40 bg-transparent px-4 py-3 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
              />
              <input
                name="email"
                type="email"
                placeholder="EMAIL"
                required
                className="border border-neptune-blue/40 bg-transparent px-4 py-3 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
              />
              <input
                name="organization"
                type="text"
                placeholder="ORGANIZATION / VENUE"
                className="border border-neptune-blue/40 bg-transparent px-4 py-3 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
              />
              <textarea
                name="message"
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
    </motion.div>
  );
}
