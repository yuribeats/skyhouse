"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-black">
      <motion.div
        className="relative z-10 flex w-full flex-col items-center gap-10 text-center"
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
            width={900}
            height={400}
            preload
            className="h-auto w-full"
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="font-display text-2xl text-white md:text-3xl"
        >
          A ritual for the living
        </motion.p>
      </motion.div>
    </section>
  );
}
