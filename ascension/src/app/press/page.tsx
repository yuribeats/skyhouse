"use client";

import { motion } from "framer-motion";
import PhotoGrid from "@/components/PhotoGrid";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const photos = [
  { src: "/assets/performance-church-1.jpg", alt: "The Ascension Service — church performance" },
  { src: "/assets/performance-church-2.jpg", alt: "The Ascension Service — church ceremony" },
  { src: "/assets/performance-gallery.jpg", alt: "The Ascension Service — gallery performance" },
  { src: "/assets/performance-outdoor-1.jpg", alt: "The Ascension Service — outdoor ceremony" },
  { src: "/assets/performance-outdoor-2.jpg", alt: "The Ascension Service — outdoor performance" },
  { src: "/assets/performance-projection.jpg", alt: "The Ascension Service — projection" },
];

// TODO: add press quotes when available
const quotes = [
  { text: "\u2014", publication: "Publication Name", year: "2026" },
];

export default function Press() {
  return (
    <motion.div
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="mb-2 font-display text-5xl text-white md:text-6xl">
          The Service in the World
        </h1>
        <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
      </motion.div>

      <motion.div variants={fadeUp}>
        <PhotoGrid photos={photos} />
      </motion.div>

      {/* Press quotes */}
      <motion.div variants={fadeUp} className="mt-20 space-y-8">
        <h2 className="font-display text-3xl text-white">Press</h2>
        {quotes.map((quote, i) => (
          <blockquote
            key={i}
            className="border-l-2 border-neptune-teal pl-4 font-body text-lg italic leading-relaxed text-neptune-muted"
          >
            <p>{quote.text}</p>
            <cite className="mt-2 block text-sm not-italic text-neptune-muted">
              — {quote.publication}, {quote.year}
            </cite>
          </blockquote>
        ))}
      </motion.div>
    </motion.div>
  );
}
