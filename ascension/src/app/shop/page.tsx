"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Shop() {
  return (
    <motion.div
      className="flex min-h-[60vh] items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <h1 className="font-display text-5xl text-white md:text-6xl">
        Coming Soon
      </h1>
    </motion.div>
  );
}
