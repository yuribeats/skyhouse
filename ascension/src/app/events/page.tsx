"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SubscribeForm from "@/components/SubscribeForm";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

interface EventItem {
  id: string; name: string; date: string; startTime: string; city: string; venue: string;
  country: string; status: string; ticketUrl: string;
}

const statusStyles: Record<string, string> = {
  available: "bg-neptune-teal/20 text-neptune-teal border border-neptune-teal/40",
  "sold-out": "bg-white/10 text-neptune-muted line-through",
  announced: "bg-neptune-blue/20 text-neptune-mid",
};

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => { setEvents(data); setLoaded(true); });
  }, []);

  return (
    <motion.div
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-12"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={fadeUp}>
        <h1 className="mb-2 font-display text-3xl text-white md:text-6xl">
          Upcoming Services
        </h1>
        <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
      </motion.div>

      {loaded && events.length > 0 && (
        <motion.div variants={fadeUp} className="mb-16">
          {events.map((e) => (
            <div key={e.id} className="flex flex-col gap-3 border-b border-neptune-blue/30 py-6 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
                {e.name && (
                  <span className="font-body text-base font-bold tracking-wider text-orange-400">{e.name}</span>
                )}
                <span className="font-body text-sm tracking-wider text-neptune-muted md:w-[180px]">
                  {e.date}{e.startTime ? ` · ${e.startTime}` : ""}
                </span>
                <span className="font-body text-base text-white">{e.city} — {e.venue}</span>
                <span className="font-body text-xs tracking-wider text-neptune-muted">{e.country}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-block px-3 py-1 font-body text-xs tracking-wider ${statusStyles[e.status] || ""}`}>
                  {e.status.toUpperCase()}
                </span>
                {e.status !== "sold-out" && (
                  e.ticketUrl ? (
                    <a href={e.ticketUrl} className="border border-neptune-blue px-5 py-2 font-body text-xs tracking-wider text-white transition-colors duration-200 hover:border-neptune-teal hover:text-neptune-teal">
                      TICKETS
                    </a>
                  ) : (
                    <span className="border border-neptune-blue/30 px-5 py-2 font-body text-xs tracking-wider text-neptune-muted">
                      JUST SHOW UP
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

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
