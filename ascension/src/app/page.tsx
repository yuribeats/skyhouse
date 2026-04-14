"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Home() {
  return (
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
  );
}
