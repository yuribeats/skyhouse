"use client";

import { motion } from "framer-motion";
import EventRow from "@/components/EventRow";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// TODO: replace placeholder events with real data
const events = [
  {
    date: "MAY 10, 2026",
    city: "Philadelphia",
    venue: "TBA",
    country: "US",
    status: "announced" as const,
    ticketUrl: "#",
  },
  {
    date: "MAY 17, 2026",
    city: "New York",
    venue: "TBA",
    country: "US",
    status: "announced" as const,
    ticketUrl: "#",
  },
  {
    date: "JUN 7, 2026",
    city: "Los Angeles",
    venue: "TBA",
    country: "US",
    status: "announced" as const,
    ticketUrl: "#",
  },
  {
    date: "JUN 21, 2026",
    city: "London",
    venue: "TBA",
    country: "UK",
    status: "announced" as const,
    ticketUrl: "#",
  },
  {
    date: "JUL 5, 2026",
    city: "Berlin",
    venue: "TBA",
    country: "DE",
    status: "announced" as const,
    ticketUrl: "#",
  },
];

export default function Events() {
  return (
    <motion.div
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="mb-2 font-display text-5xl text-white md:text-6xl">
          Upcoming Services
        </h1>
        <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
      </motion.div>

      <motion.div variants={fadeUp}>
        {events.map((event) => (
          <EventRow key={event.date + event.city} {...event} />
        ))}
      </motion.div>

      {/* Mailing list nudge */}
      <motion.div
        variants={fadeUp}
        className="mt-16 text-center"
      >
        <p className="mb-6 font-display text-2xl text-white">
          Can&apos;t make it? Join the list — we&apos;ll find you.
        </p>
        <div className="mx-auto flex max-w-md gap-2">
          <input
            type="email"
            placeholder="YOUR EMAIL"
            className="flex-1 border border-neptune-blue/40 bg-transparent px-4 py-2 font-body text-sm tracking-wider text-white outline-none transition-colors focus:border-neptune-teal"
          />
          {/* TODO: wire mailing list to Mailchimp / ConvertKit / Resend */}
          <button className="bg-neptune-blue px-6 py-2 font-body text-sm tracking-wider text-white transition-colors hover:bg-neptune-teal">
            SUBSCRIBE
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
