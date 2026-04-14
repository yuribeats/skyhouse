"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-black">
        <motion.div
          className="flex w-screen flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.div variants={fadeUp} className="w-full">
            <Image
              src="/assets/logo-cropped.png"
              alt="The Ascension Service"
              width={1920}
              height={800}
              preload
              className="h-auto w-screen"
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-10 font-display text-2xl text-white md:text-3xl"
          >
            A ritual for the living
          </motion.p>
        </motion.div>
      </section>

      {/* Ritual Brief */}
      <motion.section
        className="bg-black px-6 py-24 md:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          {/* Neptune globe + intro */}
          <motion.div variants={fadeUp} className="mb-16 flex flex-col items-center text-center">
            <Image
              src="/assets/neptune-globe-cropped.png"
              alt="Neptune"
              width={300}
              height={300}
              className="mb-8 h-auto w-[200px] rounded-full md:w-[300px]"
            />
            <p className="font-display text-3xl text-white md:text-4xl">
              A Secular Spiritual Gathering
            </p>
            <p className="mt-2 font-body text-lg tracking-wider text-neptune-teal">
              ★ FOR THE INTERNET AGE !! ★
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-16 text-center">
            <p className="font-body text-base leading-relaxed text-white">
              THE ASCENSION SERVICE IS A LIVE COLLECTIVE RITUAL LED BY OUR HUMAN
              STEWARD <span className="italic">&ldquo;FORREST MORTIFEE&rdquo;</span> THAT
              BLENDS MUSIC, PRAYER, MEDITATION, AND COLLECTIVE PARTICIPATION.
            </p>
            <p className="mt-6 font-body text-base leading-relaxed text-neptune-muted">
              INVITING YOU TO PAUSE, BREATHE, REFLECT, AND RECONNECT WITH ONE
              ANOTHER, THIS SERVICE IS TAILORED TO ACTIVATE EACH FRIEND&apos;S
              <span className="italic"> &ldquo;INNER ANGEL.&rdquo;</span>
            </p>
          </motion.div>

          {/* Two columns: Overview + Photo */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <motion.div variants={fadeUp}>
              <h3 className="mb-4 font-display text-2xl text-white">Service Overview:</h3>
              <div className="space-y-2 font-body text-sm text-neptune-muted">
                <p>FREQUENCY ★ 2 PER DAY FRI. + SAT.</p>
                <p>TIMES ★ 12:00PM + 4:00PM</p>
                <p>DURATION ★ 01:30:00</p>
                <p>SEATS ★ 20</p>
                <p className="italic">(FLEXIBLE + SUBJECT TO CHANGE)</p>
              </div>

              <h3 className="mb-4 mt-10 font-display text-2xl text-white">Technological Considerations:</h3>
              <div className="space-y-2 font-body text-sm text-neptune-muted">
                <p>★ A GREAT PA SYSTEM</p>
                <p>★ PROJECTIONS</p>
                <p>★ COLORFUL + COZY LIGHTING</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-start justify-center">
              <Image
                src="/assets/performance-church-1.jpg"
                alt="The Ascension Service — live"
                width={500}
                height={600}
                className="h-auto w-full max-w-[400px]"
              />
            </motion.div>
          </div>

          {/* Ascension Universe + Corp */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <motion.div variants={fadeUp}>
              <h3 className="mb-4 font-display text-2xl text-white">Ascension Universe:</h3>
              <p className="mb-3 font-body text-sm text-neptune-muted">TANGIBLE EPHEMERA WILL INCLUDE...</p>
              <div className="space-y-2 font-body text-sm text-neptune-muted">
                <p>★ THE ASCENSION SCRIPTURES TEXT</p>
                <p>★ HOT NEW CASETTES</p>
                <p>★ ORDER OF SERVICE PROGRAMS</p>
              </div>
              <p className="mb-3 mt-6 font-body text-sm italic text-neptune-muted">INTANGIBLE EPHEMERA WILL INCLUDE...</p>
              <div className="space-y-2 font-body text-sm text-neptune-muted">
                <p>★ ON-LINE PORTAL</p>
                <p>★ FEEDBACK INSTALLATIONS</p>
                <p>★ A FELT SENSE OF UNCONDITIONAL LOVE</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h3 className="mb-6 font-display text-2xl text-white">The Ascension Corp.</h3>
              <div className="space-y-2 font-body text-sm text-neptune-muted">
                <p>★ FORREST MORTIFEE</p>
                <p>★ YURI RYBAK</p>
                <p>★ NOAH BERINGER</p>
                <p>★ C.Y. LEE</p>
                <p>★ JADE GARCIA</p>
              </div>
            </motion.div>
          </div>

          {/* Set & Setting */}
          <motion.div variants={fadeUp} className="mb-16">
            <h3 className="mb-4 font-display text-2xl text-white">Set & Setting:</h3>
            <div className="space-y-2 font-body text-sm text-neptune-muted">
              <p>★ FLORAL ARRANGEMENTS</p>
              <p>★ IMITATION CANDLES</p>
              <p>★ FLOWING FABRICS</p>
              <p className="italic">(PROVIDED BY THE ASCENSION CORP.)</p>
            </div>
          </motion.div>

          {/* Neptune phases */}
          <motion.div variants={fadeUp} className="mb-12 flex justify-center">
            <Image
              src="/assets/15_Neptunes__No_BG_Graphic_.png"
              alt="Neptune phases"
              width={600}
              height={80}
              className="h-auto w-full max-w-[500px] opacity-80"
            />
          </motion.div>

          {/* PDF download */}
          <motion.div variants={fadeUp} className="text-center">
            <a
              href="/assets/ritual-brief.pdf"
              target="_blank"
              className="inline-block border border-neptune-teal px-8 py-3 font-body text-sm tracking-widest text-neptune-teal transition-colors duration-200 hover:bg-neptune-teal hover:text-black"
            >
              DOWNLOAD FULL BRIEF (PDF)
            </a>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
