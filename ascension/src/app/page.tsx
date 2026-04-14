"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

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

      {/* Order of Service */}
      <motion.section
        className="relative border-t border-b border-neptune-blue/30 py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <Image
          src="/assets/neptune-particles.png"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-12">
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-center font-body text-xs tracking-[0.4em] text-neptune-muted"
          >
            ORDER OF SERVICE
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mb-16 max-w-lg text-center font-body text-sm italic leading-relaxed text-neptune-muted"
          >
            We gently invite you to put your phone away for the duration of The
            Ascension Service.
          </motion.p>

          {/* Neptune image */}
          <motion.div variants={fadeUp} className="mb-16 flex justify-center">
            <Image
              src="/assets/Single_Neptune__No_BG_Graphic_.png"
              alt="Neptune"
              width={200}
              height={200}
              className="h-auto w-[140px] md:w-[200px]"
            />
          </motion.div>

          {/* Three columns */}
          <div className="grid gap-12 md:grid-cols-3">
            {/* Left column */}
            <motion.div variants={fadeUp} className="space-y-8">
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ PRAYER
                </p>
                <p className="font-body text-lg font-bold text-white">
                  THE UNCONDITIONAL
                </p>
                <p className="mt-1 font-body text-xs italic text-neptune-muted">
                  (If you feel called, please join in affirming the following)
                </p>
                <p className="mt-4 font-body text-sm leading-relaxed text-neptune-muted">
                  I trust my capacity for joy, for resilience, for rest. I am
                  safe to feel my grief, my fear, my gratitude. I am the
                  unconditionally accepting witness. I am the unconditionally
                  celebratory experiencer of this life&apos;s circumstances. I am the
                  unconditionally trusting sailor of God&apos;s seas. Take me
                  anywhere you think it best that I go, God, and I will say
                  thank you.
                </p>
                <p className="mt-4 font-body text-sm text-white">
                  Thank you, thank you, and thank you again.
                </p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ SONG
                </p>
                <p className="font-body text-base font-bold text-white">
                  LIFE&apos;S LONGING FOR ITSELF
                </p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ REFLECTION
                </p>
                <p className="font-body text-base font-bold text-white">
                  I AM NO STRANGER TO GRIEF
                </p>
              </div>
            </motion.div>

            {/* Center column */}
            <motion.div variants={fadeUp} className="space-y-8">
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ SONG
                </p>
                <p className="font-body text-base font-bold text-white">
                  UNSEEN HAND
                </p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ COLLECTIVE BREATH
                </p>
                <p className="font-body text-base font-bold text-white">
                  MOMENT OF SILENCE
                </p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ SONG
                </p>
                <p className="font-body text-base font-bold text-white">
                  TO YOU
                </p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ REFLECTION
                </p>
                <p className="font-body text-base font-bold text-white">
                  GOD&apos;S HEART INSIDE MY OWN CHEST
                </p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ SONG
                </p>
                <p className="font-body text-base font-bold text-white">
                  TENDERNESS
                </p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ SONG
                </p>
                <p className="font-body text-base font-bold text-white">
                  COST OF LOVING
                </p>
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div variants={fadeUp} className="space-y-8">
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ PRAYER
                </p>
                <p className="font-body text-lg font-bold text-white">
                  ON TRANSFORMATION
                </p>
                <p className="mt-1 font-body text-xs italic text-neptune-muted">
                  (If you feel called, please join in affirming the following)
                </p>
                <p className="mt-4 font-body text-sm leading-relaxed text-neptune-muted">
                  Thank you to all those who have walked before us on the path
                  of transgenderness, transdimensionality, and transformation.
                  We hold you all, in our wells of gratitude, and we love you
                  all, as our souls echo your light.
                </p>
                <p className="mt-4 font-body text-sm text-white">
                  Thank you, thank you, and thank you again.
                </p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ COLLECTIVE BREATH
                </p>
                <p className="font-body text-base font-bold text-white">
                  NAMING THOSE PASSED
                </p>
              </div>
              <div>
                <p className="mb-1 font-body text-xs tracking-[0.3em] text-neptune-teal">
                  ★ SONG
                </p>
                <p className="font-body text-base font-bold text-white">
                  ANOTHER LOVE
                </p>
                <p className="mt-1 font-body text-xs italic text-neptune-muted">
                  (If you feel called, please join in affirming the chorus:
                  &ldquo;There will always be another love.&rdquo;)
                </p>
              </div>
            </motion.div>
          </div>

          {/* Neptune phases */}
          <motion.div variants={fadeUp} className="mt-16 flex justify-center">
            <Image
              src="/assets/15_Neptunes__No_BG_Graphic_.png"
              alt="Neptune phases"
              width={600}
              height={80}
              className="h-auto w-full max-w-[500px] opacity-80"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Closing */}
      <motion.section
        className="py-24 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <p className="font-display text-3xl text-white md:text-4xl">
          Observed. Recorded. Ascending.
        </p>
      </motion.section>
    </>
  );
}
