"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const apparel = [
  { name: "SERVICE TEE — BLACK", price: "$45", ctaLabel: "ADD TO CART", ctaUrl: "#", category: "apparel" },
  { name: "SERVICE HOODIE — BLACK", price: "$85", ctaLabel: "ADD TO CART", ctaUrl: "#", category: "apparel" },
  { name: "ASCENSION TOTE", price: "$30", ctaLabel: "ADD TO CART", ctaUrl: "#", category: "apparel" },
];

const tickets = [
  {
    name: "GENERAL ADMISSION — SERVICE CEREMONY",
    price: "$35",
    description: "Entry to the live service ceremony.",
    ctaLabel: "GET TICKETS",
    ctaUrl: "#",
    category: "tickets",
  },
  {
    name: "VIP — FRONT ROW + AFTERGLOW ACCESS",
    price: "$75",
    description: "Front row seating and access to the afterglow gathering.",
    ctaLabel: "GET TICKETS",
    ctaUrl: "#",
    category: "tickets",
  },
  {
    name: "PRIVATE SESSION — CONTACT FOR PRICING",
    price: "INQUIRE",
    description: "A private ceremony tailored to your gathering.",
    ctaLabel: "CONTACT",
    ctaUrl: "/contact",
    category: "tickets",
  },
];

const digital = [
  { name: "THE ASCENSION SERVICE VOL. 1 (DIGITAL)", price: "$12", ctaLabel: "DOWNLOAD", ctaUrl: "#", category: "digital" },
  { name: "GUIDED CEREMONY AUDIO — 45 MIN", price: "$8", ctaLabel: "DOWNLOAD", ctaUrl: "#", category: "digital" },
];

export default function Shop() {
  return (
    <motion.div
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="mb-2 font-display text-5xl text-white md:text-6xl">
          The Ascension Store
        </h1>
        <div className="mb-16 h-[2px] w-16 bg-neptune-blue" />
      </motion.div>

      {/* Apparel */}
      <motion.div variants={fadeUp} className="mb-16">
        <h2 className="mb-6 font-body text-xs tracking-[0.3em] text-neptune-muted">
          APPAREL
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {apparel.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </motion.div>

      {/* Tickets & Experiences */}
      <motion.div variants={fadeUp} className="mb-16">
        <h2 className="mb-6 font-body text-xs tracking-[0.3em] text-neptune-muted">
          TICKETS & EXPERIENCES
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tickets.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </motion.div>

      {/* Digital Downloads */}
      <motion.div variants={fadeUp} className="mb-16">
        <h2 className="mb-6 font-body text-xs tracking-[0.3em] text-neptune-muted">
          DIGITAL DOWNLOADS
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {digital.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </motion.div>

      {/* Wellness Subscription */}
      <motion.div variants={fadeUp}>
        <h2 className="mb-6 font-body text-xs tracking-[0.3em] text-neptune-muted">
          WELLNESS SUBSCRIPTION
        </h2>
        <ProductCard
          name="THE PRACTICE — MONTHLY SUBSCRIPTION"
          price="$22 / MONTH"
          description="Weekly guided sessions, exclusive audio, access to the archive, and early access to all live services."
          category="subscription"
          ctaLabel="JOIN THE PRACTICE"
          ctaUrl="#"
          featured
        />
      </motion.div>
    </motion.div>
  );
}
