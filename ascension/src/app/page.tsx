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
          <motion.div variants={fadeUp} className="flex w-full justify-center">
            <Image
              src="/assets/logo-cropped.png"
              alt="The Ascension Service"
              width={960}
              height={400}
              preload
              className="h-auto w-[50vw]"
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
          {/* Neptune globes + intro */}
          <motion.div variants={fadeUp} className="mb-16 flex flex-col items-center text-center">
            <div className="mb-8 flex items-center justify-center gap-4 md:gap-8">
              {[1, 10, 12].map((n) => (
                <Image
                  key={n}
                  src={`/assets/neptune-grid-${String(n).padStart(2, "0")}.png`}
                  alt="Neptune"
                  width={224}
                  height={224}
                  className="h-auto w-[28vw] max-w-[180px]"
                />
              ))}
            </div>
            <p className="font-display text-3xl text-white md:text-4xl">
              A Secular Spiritual Gathering
            </p>
            <p className="mt-2 font-body text-lg tracking-wider text-neptune-teal">
              ★ FOR THE INTERNET AGE !! ★
            </p>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
