"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PhotoGrid from "@/components/PhotoGrid";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const staticPhotos = [
  { src: "/assets/tdr1.png", alt: "Trans Day of Remembrance Ascension Service" },
  { src: "/assets/tdr2.png", alt: "Order of Service" },
  { src: "/assets/brochure-1.png", alt: "Why Make Art — The Ascension Service" },
  { src: "/assets/brochure-2.png", alt: "Ask Yourself — The Ascension Service" },
  { src: "/assets/performance-church-1.jpg", alt: "The Ascension Service — church performance" },
  { src: "/assets/performance-church-2.jpg", alt: "The Ascension Service — church ceremony" },
  { src: "/assets/performance-gallery.jpg", alt: "The Ascension Service — gallery performance" },
  { src: "/assets/performance-outdoor-1.jpg", alt: "The Ascension Service — outdoor ceremony" },
  { src: "/assets/performance-outdoor-2.jpg", alt: "The Ascension Service — outdoor performance" },
  { src: "/assets/performance-projection.jpg", alt: "The Ascension Service — projection" },
];

export default function Press() {
  const [uploadedPhotos, setUploadedPhotos] = useState<{ src: string; alt: string }[]>([]);

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then((data: { id: string; url: string; alt: string }[]) => {
        setUploadedPhotos(data.map((d) => ({ src: d.url, alt: d.alt })));
      });
  }, []);

  const allPhotos = [...uploadedPhotos, ...staticPhotos];

  return (
    <motion.div
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="mb-2 font-display text-5xl text-white md:text-6xl">
          Images
        </h1>
        <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
      </motion.div>

      <motion.div variants={fadeUp}>
        <PhotoGrid photos={allPhotos} />
      </motion.div>
    </motion.div>
  );
}
