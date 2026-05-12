"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PhotoGrid from "@/components/PhotoGrid";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const staticPhotos = [
  { src: "/assets/performance-church-1.jpg", alt: "The Ascension Service — church performance" },
  { src: "/assets/performance-church-2.jpg", alt: "The Ascension Service — church ceremony" },
  { src: "/assets/performance-gallery.jpg", alt: "The Ascension Service — gallery performance" },
  { src: "/assets/performance-outdoor-1.jpg", alt: "The Ascension Service — outdoor ceremony" },
  { src: "/assets/performance-outdoor-2.jpg", alt: "The Ascension Service — outdoor performance" },
  { src: "/assets/performance-projection.jpg", alt: "The Ascension Service — projection" },
];

interface EventItem {
  id: string; name: string; date: string; startTime: string; city: string; venue: string;
  country: string; status: string; ticketUrl: string;
}

const statusStyles: Record<string, string> = {
  available: "bg-[var(--tas-accent)]/20 text-[var(--tas-accent)] border border-[var(--tas-accent)]/40",
  "sold-out": "bg-[var(--tas-fg)]/10 text-[var(--tas-muted)] line-through",
  announced: "bg-neptune-blue/20 text-[var(--tas-fg)]/70",
};

export default function Home() {
  const [uploadedPhotos, setUploadedPhotos] = useState<{ src: string; alt: string }[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then((data: { id: string; url: string; alt: string }[]) => {
        setUploadedPhotos(data.map((d) => ({ src: d.url, alt: d.alt })));
      });
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => { setEvents(data); setEventsLoaded(true); });
  }, []);

  const allPhotos = [...uploadedPhotos, ...staticPhotos];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero — white logo flush against header */}
      <section id="top" className="flex flex-col items-center bg-[var(--tas-bg)]">
        <div className="flex w-full justify-center">
          <Image
            src="/assets/Welcome_to_The_Ascension_Service__logo_.png"
            alt="Welcome to The Ascension Service"
            width={1920}
            height={1080}
            priority
            className="logo-white block h-auto w-[80vw] max-w-[1000px]"
          />
        </div>
        <p className="mt-2 mb-16 px-6 text-center font-body text-base font-bold uppercase tracking-wider text-[var(--tas-fg)] md:text-xl">
          &quot;HELPING YOU EMBODY YOUR FUTURE SELF SINCE 2025 AD!!&quot;
        </p>
      </section>

      {/* About */}
      <motion.section
        id="about"
        className="bg-[var(--tas-bg)] px-6 py-24 md:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 font-display text-5xl text-[var(--tas-fg)] md:text-7xl">
              about
            </h2>
            <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="max-w-[820px] font-body text-base font-bold uppercase leading-relaxed tracking-wide text-[var(--tas-fg)] md:text-lg"
          >
            ©THE ASCENSION SERVICE™ IS A LIVE PERFORMANCE RITUAL BLENDING MUSIC, PHILOSOPHY AND PRAYER WITH COLLECTIVE PARTICIPATION. GUIDED BY HUMAN STEWARD FORREST MORTIFEE, THIS POST-RELIGIOUS SPIRITUAL TECHNOLOGY INVITES US TO BREATHE, REFLECT, AND RECONNECT WITH OUR MOST BENEVOLENT FUTURE SELVES, AND WITH ONE ANOTHER.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-16">
            <PhotoGrid photos={allPhotos} />
          </motion.div>
        </div>
      </motion.section>

      {/* About Our Steward */}
      <motion.section
        id="steward"
        className="bg-[var(--tas-bg)] px-6 py-24 md:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 font-display text-5xl text-[var(--tas-fg)] md:text-7xl">
              about our steward
            </h2>
            <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="max-w-[820px] font-body text-base font-bold uppercase leading-relaxed tracking-wide text-[var(--tas-fg)] md:text-lg"
          >
            FORREST MORTIFEE IS A MUSICIAN, PERFORMER, AND THE HUMAN STEWARD OF THE ASCENSION SERVICE. [BIO PLACEHOLDER — REPLACE WITH FORREST&apos;S BIO.]
          </motion.p>
        </div>
      </motion.section>

      {/* Music */}
      <motion.section
        id="music"
        className="bg-[var(--tas-bg)] px-6 py-24 md:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 font-display text-5xl text-[var(--tas-fg)] md:text-7xl">
              music
            </h2>
            <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between border border-[var(--tas-border)] px-6 py-5"
              >
                <span className="font-body text-sm font-bold uppercase tracking-wider text-[var(--tas-fg)]">
                  TRACK {n} — [TITLE PLACEHOLDER]
                </span>
                <span className="font-body text-xs uppercase tracking-wider text-[var(--tas-muted)]">
                  COMING SOON
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Events */}
      <motion.section
        id="events"
        className="bg-[var(--tas-bg)] px-6 py-24 md:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 font-display text-5xl text-[var(--tas-fg)] md:text-7xl">
              events
            </h2>
            <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
          </motion.div>

          {eventsLoaded && events.length > 0 && (
            <motion.div variants={fadeUp}>
              {events.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-col gap-3 border-b border-[var(--tas-border)] py-6 md:flex-row md:items-center md:justify-between md:gap-6"
                >
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
                    {e.name && (
                      <span className="font-body text-base font-bold tracking-wider text-[var(--tas-accent)]">
                        {e.name}
                      </span>
                    )}
                    <span className="font-body text-sm tracking-wider text-[var(--tas-muted)] md:w-[180px]">
                      {e.date}{e.startTime ? ` · ${e.startTime}` : ""}
                    </span>
                    <span className="font-body text-base text-[var(--tas-fg)]">
                      {e.city} — {e.venue}
                    </span>
                    <span className="font-body text-xs tracking-wider text-[var(--tas-muted)]">
                      {e.country}
                    </span>
                  </div>
                  <div className="flex items-stretch self-start md:self-auto">
                    <span
                      className={`inline-flex w-[110px] shrink-0 items-center justify-center px-3 py-1 font-body text-xs tracking-wider ${statusStyles[e.status] || ""}`}
                    >
                      {e.status.toUpperCase()}
                    </span>
                    {e.status !== "sold-out" &&
                      (e.ticketUrl ? (
                        <a
                          href={e.ticketUrl}
                          className="inline-flex w-[140px] shrink-0 items-center justify-center border border-neptune-blue px-3 py-1 font-body text-xs tracking-wider text-[var(--tas-fg)] transition-colors duration-200 hover:border-[var(--tas-accent)] hover:text-[var(--tas-accent)]"
                        >
                          TICKETS
                        </a>
                      ) : (
                        <span className="inline-flex w-[140px] shrink-0 items-center justify-center border border-[var(--tas-border)] px-3 py-1 font-body text-xs tracking-wider text-[var(--tas-muted)]">
                          JUST SHOW UP
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        id="contact"
        className="bg-[var(--tas-bg)] px-6 py-24 md:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 font-display text-5xl text-[var(--tas-fg)] md:text-7xl">
              contact
            </h2>
            <div className="mb-12 h-[2px] w-16 bg-neptune-blue" />
          </motion.div>

          <motion.div variants={fadeUp} className="max-w-[600px]">
            {submitted ? (
              <p className="font-display text-3xl text-[var(--tas-accent)]">
                We&apos;ll be in touch.
              </p>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">
                <input
                  name="name"
                  type="text"
                  placeholder="NAME"
                  required
                  className="border border-[var(--tas-border)] bg-transparent px-4 py-3 font-body text-sm tracking-wider text-[var(--tas-fg)] outline-none transition-colors focus:border-[var(--tas-accent)]"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="EMAIL"
                  required
                  className="border border-[var(--tas-border)] bg-transparent px-4 py-3 font-body text-sm tracking-wider text-[var(--tas-fg)] outline-none transition-colors focus:border-[var(--tas-accent)]"
                />
                <input
                  name="organization"
                  type="text"
                  placeholder="ORGANIZATION / VENUE"
                  className="border border-[var(--tas-border)] bg-transparent px-4 py-3 font-body text-sm tracking-wider text-[var(--tas-fg)] outline-none transition-colors focus:border-[var(--tas-accent)]"
                />
                <textarea
                  name="message"
                  placeholder="MESSAGE"
                  rows={5}
                  required
                  className="resize-none border border-[var(--tas-border)] bg-transparent px-4 py-3 font-body text-sm tracking-wider text-[var(--tas-fg)] outline-none transition-colors focus:border-[var(--tas-accent)]"
                />
                <button
                  type="submit"
                  className="bg-neptune-blue px-8 py-3 font-body text-sm tracking-wider text-white transition-colors hover:bg-[var(--tas-accent)]"
                >
                  SEND
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
