"use client";

import { motion } from "framer-motion";
import SubscribeForm from "@/components/SubscribeForm";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Events() {
  return (
    <motion.div
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="mb-2 font-display text-5xl text-white md:text-6xl">
          Upcoming Services
        </h1>
        <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
      </motion.div>

      <motion.div variants={fadeUp} className="text-center">
        <p className="mb-8 font-display text-2xl text-white">
          Join the list — we&apos;ll find you.
        </p>
        <div className="mx-auto max-w-md">
          <SubscribeForm />
        </div>
      </motion.div>
    </motion.div>
  );
}
