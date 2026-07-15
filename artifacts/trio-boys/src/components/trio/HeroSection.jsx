
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronDown } from "lucide-react";

const MEMBERS = [
  {
    name: "GABE",
    role: "OG TRIO · FOUNDER",
    image: "https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/cd09ef8a7_Untitleddesign-12.png",
    stats: {},
    isReal: true,
  },
  {
    name: "PRESTON",
    role: "OG TRIO · FOUNDER",
    image: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/29ae4fa79_2.png",
    stats: {},
    isReal: true,
  },
  {
    name: "COLIN",
    role: "OG TRIO",
    image: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/16a339ffb_3.png",
    stats: {},
    isReal: true,
  },
  {
    name: "RHYS",
    role: "4TH GRADE TRIO",
    image: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/64de9b5d0_4.png",
    stats: {},
    isReal: true,
  },
  {
    name: "CONNOR",
    role: "4TH GRADE TRIO",
    image: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/909838026_5.png",
    stats: {},
    isReal: true,
  },
  {
    name: "DOM",
    role: "4TH GRADE TRIO",
    image: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/1287e29c5_6.png",
    stats: {},
    isReal: true,
  },
  {
    name: "WYATT",
    role: "6TH GRADE TRIO",
    image: "https://db.app/api/apps/6a30bf87c8bc35a71d08ae5f/files/mp/public/6a30bf87c8bc35a71d08ae5f/f9befa98a_7.png",
    stats: {},
    isReal: true,
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display font-black text-[30vw] leading-none text-foreground/[0.02]">
          III
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10 pt-20 md:pt-0 min-h-[184vh]">
        {MEMBERS.map((member, i) => (
          <motion.div
            key={member.name}
            className="relative flex-1 cursor-pointer overflow-hidden group"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            animate={{
              flex: activeIndex === null ? 1 : activeIndex === i ? 2.5 : 0.55,
              opacity: activeIndex === null ? 1 : activeIndex === i ? 1 : 0.4,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Image */}
            <div className="absolute inset-x-[0.675rem] md:inset-x-[1.35rem] top-8 bottom-24">
              <img
                src={member.image}
                alt={member.name}
                style={member.isReal ? { objectPosition: 'center center' } : member.imageOffset ? { objectPosition: `${member.imageOffset} top` } : undefined}
                className={`w-full h-full ${member.isReal ? "object-contain" : "object-cover object-top"}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              {!member.isReal && <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-background/20" />}
            </div>

            {/* Vertical divider line */}
            {i < MEMBERS.length - 1 && (
              <div className="absolute right-0 top-0 bottom-0 w-px bg-primary/20 z-20 hidden md:block" />
            )}

            {/* Member info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-primary text-xs font-body tracking-[0.3em] uppercase">
                    {member.role}
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-7xl font-black tracking-tight">
                  {member.name}
                </h2>
              </motion.div>

              {/* Expanded stats on hover */}
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    className="mt-4 flex gap-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {Object.entries(member.stats).map(([key, val]) => (
                      <div key={key}>
                        <p className="text-foreground font-display text-xl font-bold">{val}</p>
                        <p className="text-muted-foreground text-xs tracking-widest uppercase">{key}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Number label */}
            <div className="absolute top-24 md:top-8 left-6 md:left-10 z-10">
              <span className="font-display text-7xl md:text-9xl font-black text-foreground/[0.06]">
                0{i + 1}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom bar */}
      <motion.div
        className="relative z-20 flex items-center justify-between px-6 md:px-10 py-6 border-t border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div />
        <motion.button
          onClick={() => document.querySelector("#feed")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs tracking-[0.2em] uppercase"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          EXPLORE
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </section>
  );
}