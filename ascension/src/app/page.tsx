"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PhotoGrid from "@/components/PhotoGrid";
import AudioPlayer from "@/components/AudioPlayer";

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
        <div className="-mt-[15vw] flex w-full justify-center md:-mt-[12vw]">
          <Image
            src="/assets/Welcome_to_The_Ascension_Service__logo_.png"
            alt="Welcome to The Ascension Service"
            width={1920}
            height={1080}
            priority
            className="logo-white block h-auto w-[92vw] max-w-[1000px] md:w-[80vw]"
          />
        </div>
        <p className="-mt-[7vw] mb-1 px-4 text-center font-body text-xs font-bold italic uppercase tracking-wide text-[var(--tas-fg)] md:-mt-[5vw] md:mb-2 md:px-6 md:text-xl md:tracking-wider">
          &quot;HELPING YOU EMBODY YOUR FUTURE SELF SINCE 2025 AD!!&quot;
        </p>
        <Image
          src="/assets/Single_Neptune__No_BG_Graphic_.png"
          alt="Neptune"
          width={1080}
          height={1350}
          className="-mt-[4vw] h-auto w-[60vw] max-w-[400px] md:-mt-[2vw] md:w-[40vw]"
        />
      </section>

      {/* Manifesto */}
      <motion.section
        id="manifesto"
        className="scroll-mt-28 bg-[var(--tas-bg)] px-6 pb-12 pt-4 md:px-12 md:pb-16 md:pt-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 text-center font-display text-4xl text-[var(--tas-fg)] sm:text-5xl md:text-7xl">
              Manifesto
            </h2>
            <div className="mx-auto mb-6 h-[2px] w-16 bg-neptune-blue md:mb-12" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mx-auto flex w-full max-w-[820px] flex-col gap-6 font-body text-base font-bold uppercase leading-relaxed tracking-wide text-[var(--tas-fg)] md:text-lg"
          >
            <p>FOR CENTURIES, HUMAN EMOTIONAL INTELLIGENCE HAS BEEN GROSSLY UNDERVALUED BY HEGEMONIC SYSTEMS, THEREBY LIMITING OUR COLLECTIVE CAPACITY TO MAKE CHOICES THAT FOSTER SURVIVAL AND WELLBEING FOR OUR SPECIES, AND ALL OUR EARTHLY RELATIONS.</p>
            <p>THE ROOT PROBLEM OF THE CURRENT POLYCRISIS IS OUR COLLECTIVE LACK OF SKILLS AND PRACTICES FOR EMBODYING SELF-COMPASSION, A CORE PILLAR OF EMOTIONAL INTELLIGENCE AND SPIRITUAL ALIGNMENT. ©THE ASCENSION SERVICE™ AIMS TO FOSTER A CULTURE OF COMPASSIONATE SELF-INQUIRY, COLLECTIVE EMOTIONAL INTIMACY, AND THE VIBRATIONAL AMPLIFICATION OF BENEVOLENT HUMAN POSSIBILITY.</p>
            <p>OUR WILLINGNESS TO FEEL THE MULTIFACETED AND OFTEN PARADOXICAL BREADTH OF OUR PRESENT EMOTIONS IS MEDICINE TO OUR SYSTEMS. IT IS THE EMBODIMENT OF THE UNDERSTANDING THAT NO PART OF US IS DESERVING OF EXILE, AND THAT WE ARE EACH, IN OUR TOTALITIES, WORTHY OF BELONGING AND OF LOVE.</p>
            <p>WHEN WE SCALE THIS UNDERSTANDING FROM THE SELF TO THE SPECIES, WE BEGIN TO MATERIALIZE A REALITY OF COLLECTIVE UTOPIA - A STATE WHICH ALREADY EXISTS DOWN THE LINE OF SPACETIME. AS WE INTENTIONALLY CONNECT TO NOT JUST OUR PRESENT BUT ALSO FUTURE SELVES, WE ACTIVATE OUR TRANS-TEMPORAL RELATIONAL CAPACITIES, EFFECTIVELY ADOPTING THE WISDOM OF OUR FAR-FUTURE ANCESTORS.</p>
            <p>THESE FUTURE SELVES ARE ANGEL-ADJACENT MEMBERS OF OUR OWN SPECIES WHO HAVE EVOLVED TO EMBODY A HEIGHTENED SOUL INTELLIGENCE THAT WE CAN ACCESS AS EARLY AS TODAY. CAPABLE OF INSTANTLY INTUITING THE EMOTIONAL, SPIRITUAL, AND MATERIAL IMPLICATIONS OF EACH CHOICE MADE, OUR FUTURE SELVES HOLD A HEIGHTENED SENSITIVITY TO THE COLLECTIVE TIMELINES OF OUR SPECIES, PLANET, AND INTERGALACTIC COMMUNITIES.</p>
            <p>BY INTENTIONALLY CALLING THEIR SPIRITS FORWARD FROM WITHIN US, WE TAP INTO UNPRECEDENTED RESOURCES OF CARE, COURAGE, AND KINDNESS, MANIFESTING THE CONDITIONS NECESSARY FOR CREATING A LIVABLE, LOVABLE WORLD FOR ALL SENTIENT BEINGS.</p>
            <p>INDEED, THE EXTERNAL IS A MIRROR OF THE INTERNAL. BY SCULPTING OUR INNER WORLDS THROUGH THE CULTIVATION OF NON-DOGMATIC FAITH, DEVOTIONAL OPTIMISM, AND COMPASSIONATE RELATING BETWEEN OUR INNER BEINGS, WE ADDRESS THE ROOT CAUSE OF THE EXTERNAL CRISES CURRENTLY BEING ENACTED BY OUR SPECIES. OUR INNER WORLD IS THE GROUND FLOOR OF REALITY CREATION, AND IS THUS THE FOCUS OF OUR SPIRITUAL ACTIVISM.</p>
            <p>THROUGH ORIGINAL MUSIC SUNG LIVE, ALONGSIDE GUIDED MEDITATION, PRAYER, POETRY, AND INTERACTIVE PARTICIPATION, WE BREATHE AND SOFTEN INTO LAUGHTER, TEARS, AND EASEFUL COLLECTIVE PRESENCE, WITNESSING ONE ANOTHER TRANSFORM OUR INNER WORLDS IN REAL-TIME. THE INTERPERSONAL CONNECTIONS WE MAKE AT ©THE ASCENSION SERVICE™ SERVE AS A MATERIALIZED MIRROR OF OUR PROFOUND PRE-EXISTING INTERRELATION. THE EMPATHY CULTIVATED HEREIN ALLOWS US TO SEE OURSELVES IN THE OTHER AND TO SEE THE OTHER IN THE SELF.</p>
            <p>THROUGH GATHERING IN THIS WAY, WE CULTIVATE OUR INDIVIDUAL AND COLLECTIVE CAPACITIES FOR SUSTAINING LOVE, VULNERABILITY, IMAGINATION, GRIEF, INTIMACY, LONGING, FORGIVENESS, AND RICH SELF-EMPATHY. ©THE ASCENSION SERVICE™ OFFERS A THIRD SPACE FOR THOSE WHO YEARN TO MEET THEMSELVES MORE DEEPLY - AND TO EXPLORE AND NURTURE AUTHENTICITY AND VULNERABILITY WITHIN SELF AND WITHIN COMMUNITY.</p>
            <p>WE INVITE YOU TO JOIN US AS WE EMBARK UPON THIS INTENTIONAL EVOLUTIONARY JOURNEY SO THAT TOGETHER WE MAY BIRTH THIS COLLECTIVELY BENEVOLENT REALITY - ONE ALREADY WRITTEN THROUGH THE LINES OF SPACETIME, JUST WAITING TO BE SUNG FORTH FROM WITHIN US ALL.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 md:mt-16">
            <PhotoGrid photos={allPhotos} />
          </motion.div>
        </div>
      </motion.section>

      {/* Reflections from Service */}
      <motion.section
        id="reflections"
        className="scroll-mt-28 bg-[var(--tas-bg)] px-6 pb-12 pt-4 md:px-12 md:pb-16 md:pt-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 text-center font-display text-4xl text-[var(--tas-fg)] sm:text-5xl md:text-7xl">
              Reflections from Service
            </h2>
            <div className="mx-auto mb-6 h-[2px] w-16 bg-neptune-blue md:mb-12" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mx-auto flex w-full max-w-[820px] flex-col gap-6 font-body text-base font-bold uppercase leading-relaxed tracking-wide text-[var(--tas-fg)] md:text-lg"
          >
            <p>“IT’S ALL YOUR FAVORITE PARTS OF CHURCH WITHOUT THE SH*T YOU DON’T WANT.”</p>
            <p>“YOUR VOICE CRACKED ME OPEN… I FELT LIKE I WAS TRANSCENDING TIME AND SPACE, LIKE YOUR VOICE WAS CARRYING ME THROUGH DIFFERENT DIMENSIONS OF LOVE.”</p>
            <p>“I DROPPED INTO A DREAM STATE — A PLACE WHERE IT FELT SAFE TO VISUALIZE AND FEEL.”</p>
            <p>“A FRESH REIMAGINING OF WHAT HEALING FROM RELIGIOUS TRAUMA CAN LOOK LIKE.”</p>
            <p>“IT DIDN’T FEEL LIKE WE WERE WATCHING A SHOW. IT FELT LIKE WE WERE COLLABORATING IN AN EXPERIENCE TOGETHER.”</p>
            <p>“BEFORE I ARRIVED, I FELT HEAVY AND LIKE I WANTED TO HIDE. I LEFT FEELING LIGHTER, LIBERATED, HOPEFUL, AND DEEPLY HELD BY COMMUNITY.”</p>
            <p>“THIS SPIRITUAL ART IS GOING TO TRANSFORM ENTIRE COMMUNITIES AND PEOPLE AROUND THE WORLD.”</p>
          </motion.div>

          <motion.p variants={fadeUp} className="mx-auto mt-8 w-full max-w-[820px] font-body text-xs font-normal normal-case text-[var(--tas-fg)]">
            Note: Some testimonials have been lightly edited for clarity and length.
          </motion.p>
        </div>
      </motion.section>

      {/* About Our Steward */}
      <motion.section
        id="steward"
        className="scroll-mt-28 bg-[var(--tas-bg)] px-6 pb-12 pt-4 md:px-12 md:pb-16 md:pt-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 text-center font-display text-4xl text-[var(--tas-fg)] sm:text-5xl md:text-7xl">
              About our Steward
            </h2>
            <div className="mx-auto mb-6 h-[2px] w-16 bg-neptune-blue md:mb-12" />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mx-auto w-full max-w-[820px] font-body text-base font-bold uppercase leading-relaxed tracking-wide text-[var(--tas-fg)] md:text-lg"
          >
            FORREST MORTIFEE (HE/HIM) IS A MULTI-DISCIPLINARY ARTIST AND SPIRITUAL ACTIVIST CREATING AT THE INTERSECTION OF MUSIC, RITUAL, AND EMERGING TECH. WITH 60M STREAMS AND A DECADE OF INTERNATIONAL PERFORMANCE UNDER HIS BELT, FORREST IS NOW BUILDING THE IMMERSIVE WORLD OF ©THE ASCENSION SERVICE™. DESIGNING WITH EMPOWERMENT, CONNECTION, AND EMPATHY ON HIS MIND, FORREST FINDS PURPOSE IN MATERIALIZING REALITIES OF MUTUAL HEALING AND AWE.
          </motion.p>
        </div>
      </motion.section>

      {/* Music */}
      <motion.section
        id="music"
        className="scroll-mt-28 bg-[var(--tas-bg)] px-6 pb-12 pt-4 md:px-12 md:pb-16 md:pt-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 text-center font-display text-4xl text-[var(--tas-fg)] sm:text-5xl md:text-7xl">
              Music
            </h2>
            <div className="mx-auto mb-6 h-[2px] w-16 bg-neptune-blue md:mb-12" />
          </motion.div>

          <motion.div variants={fadeUp} className="mx-auto flex w-full max-w-[820px] flex-col gap-4">
            {[
              { title: "Blossoms", src: "/audio/Blossoms.mp3" },
              { title: "Prophecy of the Morning Dew", src: "/audio/Prophecy of the Morning Dew.mp3" },
              { title: "Sea The Signs", src: "/audio/Sea The Signs.mp3" },
            ].map((track) => (
              <div key={track.src} className="flex flex-col gap-2">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-[var(--tas-fg)] sm:text-sm">
                  {track.title}
                </span>
                <AudioPlayer src={track.src} />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Events */}
      <motion.section
        id="events"
        className="scroll-mt-28 bg-[var(--tas-bg)] px-6 pb-12 pt-4 md:px-12 md:pb-16 md:pt-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 text-center font-display text-4xl text-[var(--tas-fg)] sm:text-5xl md:text-7xl">
              Events
            </h2>
            <div className="mx-auto mb-6 h-[2px] w-16 bg-neptune-blue md:mb-12" />
          </motion.div>

          {eventsLoaded && events.length > 0 && (
            <motion.div variants={fadeUp}>
              {events.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-col gap-3 border-b border-[var(--tas-border)] py-5 md:flex-row md:items-center md:justify-between md:gap-6 md:py-6"
                >
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
                    {e.name && (
                      <span className="font-body text-sm font-bold tracking-wider text-[var(--tas-accent)] md:text-base">
                        {e.name}
                      </span>
                    )}
                    <span className="font-body text-xs tracking-wider text-[var(--tas-muted)] md:w-[180px] md:text-sm">
                      {e.date}{e.startTime ? ` · ${e.startTime}` : ""}
                    </span>
                    <span className="font-body text-sm text-[var(--tas-fg)] md:text-base">
                      {e.city} — {e.venue}
                    </span>
                    <span className="font-body text-[10px] tracking-wider text-[var(--tas-muted)] md:text-xs">
                      {e.country}
                    </span>
                  </div>
                  <div className="flex w-full flex-wrap items-stretch gap-2 self-start md:w-auto md:gap-0 md:self-auto">
                    <span
                      className={`inline-flex min-w-[110px] flex-1 shrink-0 items-center justify-center px-3 py-1 font-body text-[10px] tracking-wider sm:flex-none md:text-xs ${statusStyles[e.status] || ""}`}
                    >
                      {e.status.toUpperCase()}
                    </span>
                    {e.status !== "sold-out" &&
                      (e.ticketUrl ? (
                        <a
                          href={e.ticketUrl}
                          className="inline-flex min-w-[140px] flex-1 shrink-0 items-center justify-center border border-neptune-blue px-3 py-1 font-body text-[10px] tracking-wider text-[var(--tas-fg)] transition-colors duration-200 hover:border-[var(--tas-accent)] hover:text-[var(--tas-accent)] sm:flex-none md:text-xs"
                        >
                          TICKETS
                        </a>
                      ) : (
                        <span className="inline-flex min-w-[140px] flex-1 shrink-0 items-center justify-center border border-[var(--tas-border)] px-3 py-1 font-body text-[10px] tracking-wider text-[var(--tas-muted)] sm:flex-none md:text-xs">
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
        className="scroll-mt-28 bg-[var(--tas-bg)] px-6 pb-4 pt-4 md:px-12 md:pb-6 md:pt-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mx-auto max-w-[1000px]">
          <motion.div variants={fadeUp}>
            <h2 className="mb-2 text-center font-display text-4xl text-[var(--tas-fg)] sm:text-5xl md:text-7xl">
              Reach Out
            </h2>
            <div className="mx-auto mb-6 h-[2px] w-16 bg-neptune-blue md:mb-12" />
          </motion.div>

          <motion.div variants={fadeUp} className="mx-auto w-full max-w-[600px]">
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
