"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollingBanner from "@/components/ScrollingBanner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const row1 = Array.from({ length: 13 }, (_, i) => `/assets/panels/panel-${25 + i}.jpg`);
const row2 = Array.from({ length: 12 }, (_, i) => `/assets/panels/panel-${38 + i}.jpg`);

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center">
        <Image
          src="/assets/performance-church-2.jpg"
          alt="The Ascension Service — live performance"
          fill
          preload
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <motion.div
          className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.div variants={fadeUp}>
            <Image
              src="/assets/Welcome_to_The_Ascension_Service__logo_.png"
              alt="The Ascension Service"
              width={480}
              height={200}
              preload
              className="h-auto w-[300px] md:w-[480px]"
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="font-display text-2xl text-white md:text-3xl"
          >
            A ritual for the living
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-4">
            <Link
              href="/events"
              className="border border-neptune-teal px-8 py-3 font-body text-sm tracking-widest text-neptune-teal transition-colors duration-200 hover:bg-neptune-teal hover:text-black"
            >
              EVENTS
            </Link>
            <Link
              href="/press"
              className="border border-white/40 px-8 py-3 font-body text-sm tracking-widest text-white transition-colors duration-200 hover:border-white"
            >
              PRESS
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Scrolling banners */}
      <div className="space-y-4 py-8">
        <ScrollingBanner images={row1} direction="left" speed={60} />
        <ScrollingBanner images={row2} direction="right" speed={50} />
      </div>

      {/* Intro text */}
      <motion.section
        className="mx-auto max-w-[640px] px-6 py-24 text-center md:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <h2 className="mb-2 font-display text-4xl text-white md:text-5xl">
          <span className="inline-block border-b-2 border-neptune-teal pb-2">
            Welcome to The Ascension Service
          </span>
        </h2>
        <p className="mt-8 font-body text-lg leading-relaxed text-neptune-muted">
          The Ascension Service is a living ceremony — part performance, part
          practice, part invitation. Founded by Forrest Mortifee, it travels to
          churches, forests, galleries, and living rooms. You are already a
          member.
        </p>
      </motion.section>

      {/* Neptune teaser */}
      <section className="relative py-24">
        <Image
          src="/assets/neptune-particles.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          className="relative z-10 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className="font-display text-3xl text-white md:text-4xl">
            Observed. Recorded. Ascending.
          </p>
        </motion.div>
      </section>
    </>
  );
}
