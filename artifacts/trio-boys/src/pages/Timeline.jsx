import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Camera, CircleDot, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/trio/Navbar";
import Footer from "@/components/trio/Footer";

const FILTERS = [
  { id: "all", label: "ALL FILES" },
  { id: "og", label: "OG TRIO" },
  { id: "fourth", label: "4TH GRADE" },
  { id: "sixth", label: "6TH GRADE" },
  { id: "summer", label: "SUMMER 2026" },
];

const EVENTS = [
  {
    id: "origin",
    filter: "og",
    index: "01",
    eyebrow: "FOUNDATION FILE",
    era: "OG TRIO",
    title: "THREE NAMES.\nONE FREQUENCY.",
    date: "THE BEGINNING",
    copy: "Gabe, Preston, and Colin establish the original signal. Before the channel, before the merch, before anyone was keeping score — there was the trio.",
    images: [
      { src: "/members/1.png", alt: "Gabe, original Trio Boys member" },
      { src: "/members/2.png", alt: "Preston, original Trio Boys member" },
      { src: "/members/3.png", alt: "Colin, original Trio Boys member" },
    ],
    note: "OG / 003",
  },
  {
    id: "expansion",
    filter: "fourth",
    index: "02",
    eyebrow: "ROSTER EXPANSION",
    era: "4TH GRADE TRIO",
    title: "THE CIRCLE\nGETS LOUDER.",
    date: "THE SECOND WAVE",
    copy: "Rhys, Connor, and Dom pull up and the trio becomes a moving target. More voices, more inside jokes, more evidence that this was never meant to stay small.",
    images: [
      { src: "/members/4.png", alt: "Rhys, fourth grade Trio Boys member" },
      { src: "/members/5.png", alt: "Connor, fourth grade Trio Boys member" },
      { src: "/members/6.png", alt: "Dom, fourth grade Trio Boys member" },
    ],
    note: "4TH GRADE / 006",
  },
  {
    id: "seventh-signal",
    filter: "sixth",
    index: "03",
    eyebrow: "NEW SIGNAL DETECTED",
    era: "6TH GRADE TRIO",
    title: "SEVEN DEEP.\nSTILL MOVING.",
    date: "THE NEXT CHAPTER",
    copy: "Wyatt joins the archive and the lineup keeps evolving. The name stays the same because the energy does — curious, chaotic, and impossible to fake.",
    images: [{ src: "/members/7.png", alt: "Wyatt, sixth grade Trio Boys member" }],
    note: "6TH GRADE / 007",
  },
  {
    id: "project-summer",
    filter: "summer",
    index: "04",
    eyebrow: "ACTIVE TRANSMISSION",
    era: "PROJECT SUMMER",
    title: "THE HOTTEST\nFILE YET.",
    date: "SUMMER 2026",
    copy: "Daily photos, low production value, high commitment. Project Summer is the next chapter in public — a rolling record of the boys while it is still happening.",
    images: [
      { src: "/project-summer/day1.jpg", alt: "Project Summer daily photo, day one" },
      { src: "/project-summer/day3.jpg", alt: "Project Summer daily photo, day three" },
      { src: "/project-summer/day7.jpg", alt: "Project Summer daily photo, day seven" },
    ],
    note: "LIVE / 013 FRAMES",
    link: "/project-summer",
  },
];

function ArchiveStamp({ children, tone = "cyan" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.22em] ${
        tone === "lime"
          ? "border-accent/50 text-accent"
          : "border-primary/50 text-primary"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone === "lime" ? "bg-accent" : "bg-primary"}`} />
      {children}
    </span>
  );
}

function ImageStrip({ images, eventId }) {
  return (
    <div className={`grid ${images.length === 1 ? "grid-cols-1" : "grid-cols-3"} gap-2`}>
      {images.map((image, imageIndex) => (
        <div
          key={image.src}
          data-testid={`image-frame-${eventId}-${imageIndex}`}
          className={`relative overflow-hidden border border-foreground/10 bg-muted ${
            images.length === 1 ? "aspect-[4/3] max-w-[16rem]" : "aspect-[4/5]"
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            data-testid={`img-archive-${eventId}-${imageIndex}`}
            className="h-full w-full object-cover object-top grayscale-[0.15] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
          <span className="absolute bottom-1.5 left-1.5 bg-background/75 px-1.5 py-1 text-[0.5rem] font-mono tracking-widest text-primary">
            0{imageIndex + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

function TimelineEvent({ event, index }) {
  const isRight = index % 2 === 1;

  return (
    <motion.li
      layout
      data-testid={`timeline-event-${event.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.3), ease: "easeOut" }}
      className="relative grid items-start gap-7 md:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)] md:gap-0"
    >
      <div className={`${isRight ? "md:col-start-3" : "md:col-start-1"} group relative`}>
        <div className="mb-4 flex items-center justify-between gap-4 md:hidden">
          <ArchiveStamp tone={event.filter === "summer" ? "lime" : "cyan"}>{event.era}</ArchiveStamp>
          <span className="font-mono text-[0.65rem] tracking-[0.22em] text-muted-foreground">{event.index} / 04</span>
        </div>

        <article className="relative overflow-hidden border border-border bg-card/75 p-5 transition-transform duration-500 hover:-translate-y-1 hover:border-primary/50 md:p-7">
          <div className="absolute right-0 top-0 h-20 w-20 bg-primary/5 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
          <div className="relative z-10">
            <div className="mb-6 hidden items-center justify-between gap-4 md:flex">
              <ArchiveStamp tone={event.filter === "summer" ? "lime" : "cyan"}>{event.era}</ArchiveStamp>
              <span className="font-mono text-[0.65rem] tracking-[0.22em] text-muted-foreground">{event.index} / 04</span>
            </div>
            <p className="mb-3 font-mono text-[0.62rem] font-bold tracking-[0.24em] text-accent">{event.eyebrow}</p>
            <h2 className="whitespace-pre-line font-display text-4xl font-black leading-[0.9] tracking-[-0.04em] md:text-5xl">
              {event.title}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">{event.copy}</p>

            <div className="mt-7">
              <ImageStrip images={event.images} eventId={event.id} />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-4">
              <span className="font-mono text-[0.65rem] tracking-[0.17em] text-muted-foreground">{event.note}</span>
              {event.link ? (
                <Link
                  to={event.link}
                  data-testid="link-project-summer-from-timeline"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-primary transition-colors hover:text-accent"
                >
                  OPEN PROJECT SUMMER
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.16em] text-muted-foreground">
                  <CircleDot className="h-3.5 w-3.5 text-primary" />
                  PRESERVED
                </span>
              )}
            </div>
          </div>
        </article>
      </div>

      <div className="absolute left-0 top-6 flex w-8 -translate-x-1/2 justify-center md:static md:col-start-2 md:row-start-1 md:w-auto md:translate-x-0">
        <div className="relative z-10 flex h-8 w-8 items-center justify-center border border-primary bg-background shadow-[0_0_0_6px_hsl(var(--background))]">
          <span className="h-2.5 w-2.5 bg-primary" />
        </div>
      </div>

      <div className={`${isRight ? "md:col-start-1 md:row-start-1 md:text-right" : "md:col-start-3 md:row-start-1"} hidden self-start pt-2 md:block`}>
        <p className="font-mono text-xs tracking-[0.24em] text-primary">{event.date}</p>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          {event.filter === "summer" ? "TRANSMISSION ACTIVE" : "FILE LOCKED"}
        </p>
      </div>
    </motion.li>
  );
}

export default function Timeline() {
  const [activeFilter, setActiveFilter] = useState("all");
  const visibleEvents = useMemo(
    () => EVENTS.filter((event) => activeFilter === "all" || event.filter === activeFilter),
    [activeFilter],
  );

  return (
    <div className="timeline-grain min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-44">
          <div className="pointer-events-none absolute -right-40 top-12 h-[32rem] w-[32rem] rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -left-60 top-72 h-[26rem] w-[26rem] rounded-full bg-accent/5 blur-3xl" />
          <div className="relative mx-auto max-w-7xl">
            <Link
              to="/"
              data-testid="link-timeline-back-home"
              className="mb-16 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              BACK TO THE BOYS
            </Link>

            <div className="grid items-end gap-12 lg:grid-cols-[1.3fr_0.7fr]">
              <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
                <div className="mb-7 flex flex-wrap items-center gap-3">
                  <ArchiveStamp>TRIO BOYS / TB-001</ArchiveStamp>
                  <span className="font-mono text-[0.62rem] tracking-[0.22em] text-muted-foreground">PUBLIC ACCESS</span>
                </div>
                <h1 className="max-w-5xl font-display text-[clamp(4.6rem,13vw,11rem)] font-black leading-[0.78] tracking-[-0.075em]">
                  THE STORY
                  <span className="block text-primary">SO FAR.</span>
                </h1>
                <p className="mt-9 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
                  A living record of the names, eras, and questionable decisions that made the Trio Boys what they are.
                  Start at the beginning. Stay for the evidence.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.18 }}
                className="relative border border-border bg-card/70 p-6 md:p-8"
              >
                <div className="absolute right-0 top-0 h-24 w-24 bg-accent/10 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
                <div className="relative">
                  <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                    <span className="font-mono text-[0.62rem] tracking-[0.25em] text-primary">ARCHIVE STATUS</span>
                    <span className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.2em] text-accent">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                      LIVE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-7">
                    <div data-testid="stat-archive-eras">
                      <p className="font-display text-4xl font-black text-foreground">04</p>
                      <p className="mt-1 text-[0.6rem] font-bold tracking-[0.2em] text-muted-foreground">ERAS LOGGED</p>
                    </div>
                    <div data-testid="stat-archive-members">
                      <p className="font-display text-4xl font-black text-foreground">07</p>
                      <p className="mt-1 text-[0.6rem] font-bold tracking-[0.2em] text-muted-foreground">NAMES ON FILE</p>
                    </div>
                    <div data-testid="stat-archive-frames">
                      <p className="font-display text-4xl font-black text-primary">013</p>
                      <p className="mt-1 text-[0.6rem] font-bold tracking-[0.2em] text-muted-foreground">SUMMER FRAMES</p>
                    </div>
                    <div data-testid="stat-archive-signal">
                      <p className="font-display text-4xl font-black text-accent">∞</p>
                      <p className="mt-1 text-[0.6rem] font-bold tracking-[0.2em] text-muted-foreground">CHAOS INDEX</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-card/25 px-6 py-5 md:px-10" aria-label="Archive filters">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-muted-foreground">
              <Layers3 className="h-4 w-4 text-primary" />
              SORT THE EVIDENCE
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter timeline by era">
              {FILTERS.map((filter) => {
                const active = filter.id === activeFilter;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveFilter(filter.id)}
                    data-testid={`button-filter-${filter.id}`}
                    className={`whitespace-nowrap border px-3 py-2 text-[0.62rem] font-bold tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/70 hover:text-primary"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-10 md:py-32" aria-labelledby="timeline-heading">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex items-end justify-between gap-8">
              <div>
                <p className="mb-3 font-mono text-[0.62rem] tracking-[0.24em] text-accent">CHRONOLOGICAL INDEX</p>
                <h2 id="timeline-heading" className="font-display text-4xl font-black tracking-[-0.04em] md:text-6xl">
                  EVERY ERA LEAVES A TRACE.
                </h2>
              </div>
              <div className="hidden items-center gap-2 font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground md:flex">
                <Camera className="h-4 w-4 text-primary" />
                LOCAL FILES ONLY
              </div>
            </div>

            <div className="relative">
              <div className="absolute bottom-4 left-0 top-3 w-px bg-gradient-to-b from-primary via-primary/40 to-accent md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />
              <AnimatePresence mode="popLayout">
                <ol className="relative space-y-16 pl-8 md:space-y-28 md:pl-0">
                  {visibleEvents.map((event, index) => (
                    <TimelineEvent key={event.id} event={event} index={index} />
                  ))}
                </ol>
              </AnimatePresence>
            </div>

            {visibleEvents.length === 0 && (
              <div className="border border-border p-10 text-center" data-testid="empty-timeline-filter">
                <p className="font-display text-3xl font-black">NO FILES FOUND.</p>
                <p className="mt-3 text-muted-foreground">Try another era.</p>
              </div>
            )}
          </div>
        </section>

        <section className="px-6 pb-24 md:px-10 md:pb-36">
          <div className="relative mx-auto max-w-7xl overflow-hidden border border-primary/40 bg-primary p-7 text-primary-foreground md:p-12">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-accent/20 [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="mb-4 font-mono text-[0.62rem] font-bold tracking-[0.25em] text-primary-foreground/70">NEXT FILE: SUMMER 2026</p>
                <h2 className="max-w-2xl font-display text-4xl font-black leading-[0.9] tracking-[-0.05em] md:text-7xl">
                  DON&apos;T READ ABOUT IT.
                  <span className="block text-accent">WATCH IT HAPPEN.</span>
                </h2>
              </div>
              <Link
                to="/project-summer"
                data-testid="link-timeline-project-summer-cta"
                className="group inline-flex shrink-0 items-center gap-3 bg-background px-5 py-4 text-xs font-bold tracking-[0.16em] text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
              >
                ENTER PROJECT SUMMER
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}