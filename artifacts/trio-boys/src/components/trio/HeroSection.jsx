import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import MediaVault from "./MediaVault";

const MEMBERS = [
  { name: "GABE",    role: "OG TRIO · FOUNDER", image: "/members/1.png" },
  { name: "PRESTON", role: "OG TRIO · FOUNDER", image: "/members/2.png" },
  { name: "COLIN",   role: "OG TRIO",           image: "/members/3.png" },
  { name: "RHYS",    role: "4TH GRADE TRIO",    image: "/members/4.png" },
  { name: "CONNOR",  role: "4TH GRADE TRIO",    image: "/members/5.png" },
  { name: "DOM",     role: "4TH GRADE TRIO",    image: "/members/6.png" },
  { name: "WYATT",   role: "6TH GRADE TRIO",    image: "/members/7.png" },
];

/* ─── Mobile card ──────────────────────────────────────────────── */
function HoldIndicator({ progress }) {
  if (!progress) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div className="rounded-full bg-background/80 backdrop-blur-sm border border-primary/70 p-3 shadow-[0_0_30px_hsl(var(--primary)/0.35)]">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(hsl(var(--primary)) ${progress * 360}deg, hsl(var(--foreground) / 0.15) 0deg)`,
          }}
        >
          <div className="w-[3.4rem] h-[3.4rem] rounded-full bg-background flex items-center justify-center">
            <span className="text-[0.55rem] text-primary font-bold tracking-widest text-center leading-tight">
              {progress >= 1 ? "OPEN" : "HOLD"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCard({ member, i, holdProgress = 0, onHoldStart, onHoldEnd }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg"
      style={{ aspectRatio: "3/4" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
      onPointerDown={member.name === "GABE" ? onHoldStart : undefined}
      onPointerUp={member.name === "GABE" ? onHoldEnd : undefined}
      onPointerLeave={member.name === "GABE" ? onHoldEnd : undefined}
      onPointerCancel={member.name === "GABE" ? onHoldEnd : undefined}
      onContextMenu={member.name === "GABE" ? (event) => event.preventDefault() : undefined}
    >
      {/* Photo */}
      <img
        src={member.image}
        alt={member.name}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      {member.name === "GABE" && <HoldIndicator progress={holdProgress} />}

      {/* Number watermark */}
      <span className="absolute top-2 left-3 font-display font-black text-5xl text-foreground/10 leading-none select-none pointer-events-none">
        0{i + 1}
      </span>

      {/* Name + role */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-primary text-[0.6rem] font-body tracking-[0.25em] uppercase">
            {member.role}
          </span>
        </div>
        <h2 className="font-display text-2xl font-black tracking-tight leading-none">
          {member.name}
        </h2>
      </div>
    </motion.div>
  );
}

/* ─── Desktop panel ────────────────────────────────────────────── */
function DesktopPanel({
  member,
  i,
  activeIndex,
  setActiveIndex,
  holdProgress = 0,
  onHoldStart,
  onHoldEnd,
}) {
  return (
    <motion.div
      key={member.name}
      className="relative flex-1 cursor-pointer overflow-hidden group"
      onMouseEnter={() => setActiveIndex(i)}
      onMouseLeave={() => setActiveIndex(null)}
      onPointerDown={member.name === "GABE" ? onHoldStart : undefined}
      onPointerUp={member.name === "GABE" ? onHoldEnd : undefined}
      onPointerCancel={member.name === "GABE" ? onHoldEnd : undefined}
      onContextMenu={member.name === "GABE" ? (event) => event.preventDefault() : undefined}
      animate={{
        flex: activeIndex === null ? 1 : activeIndex === i ? 2.5 : 0.55,
        opacity: activeIndex === null ? 1 : activeIndex === i ? 1 : 0.4,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Photo */}
      <div className="absolute inset-x-4 top-8 bottom-24">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-contain object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      {member.name === "GABE" && <HoldIndicator progress={holdProgress} />}

      {/* Vertical divider */}
      {i < MEMBERS.length - 1 && (
        <div className="absolute right-0 top-0 bottom-0 w-px bg-primary/20 z-20" />
      )}

      {/* Member info */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
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
          <h2 className="font-display text-5xl xl:text-7xl font-black tracking-tight">
            {member.name}
          </h2>
        </motion.div>
      </div>

      {/* Number watermark */}
      <div className="absolute top-8 left-6 z-10">
        <span className="font-display text-9xl font-black text-foreground/[0.06] leading-none">
          0{i + 1}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Section ──────────────────────────────────────────────────── */
export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [vaultOpen, setVaultOpen] = useState(false);
  const holdTimer = useRef(null);
  const holdProgressTimer = useRef(null);

  const clearHold = useCallback(() => {
    window.clearTimeout(holdTimer.current);
    window.clearInterval(holdProgressTimer.current);
    holdTimer.current = null;
    holdProgressTimer.current = null;
    setHoldProgress(0);
  }, []);

  const startGabeHold = useCallback((event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    clearHold();

    const startedAt = Date.now();
    const holdDuration = 1800;
    setHoldProgress(0.01);
    holdProgressTimer.current = window.setInterval(() => {
      setHoldProgress(Math.min((Date.now() - startedAt) / holdDuration, 1));
    }, 40);
    holdTimer.current = window.setTimeout(() => {
      window.clearInterval(holdProgressTimer.current);
      holdProgressTimer.current = null;
      setHoldProgress(1);
      setVaultOpen(true);
      window.setTimeout(() => setHoldProgress(0), 350);
    }, holdDuration);
  }, [clearHold]);

  const endGabeHold = useCallback(() => {
    if (!vaultOpen) clearHold();
  }, [clearHold, vaultOpen]);

  const closeVault = useCallback(() => {
    setVaultOpen(false);
    setHoldProgress(0);
  }, []);

  React.useEffect(() => () => clearHold(), [clearHold]);

  return (
    <>
      <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display font-black text-[30vw] leading-none text-foreground/[0.02]">
          III
        </span>
      </div>

      {/* ── MOBILE: 2-column portrait grid ── */}
      <div className="md:hidden flex-1 px-3 pt-24 pb-4 grid grid-cols-2 gap-3 relative z-10 auto-rows-fr">
            {MEMBERS.map((member, i) => (
          <div
            key={member.name}
            /* last item (index 6) spans both cols and is narrower to keep proportions */
            className={i === MEMBERS.length - 1 && MEMBERS.length % 2 === 1
              ? "col-span-2 flex justify-center"
              : ""}
          >
              {i === MEMBERS.length - 1 && MEMBERS.length % 2 === 1 ? (
              <div className="w-1/2">
                  <MobileCard
                    member={member}
                    i={i}
                    holdProgress={member.name === "GABE" ? holdProgress : 0}
                    onHoldStart={startGabeHold}
                    onHoldEnd={endGabeHold}
                  />
              </div>
            ) : (
                <MobileCard
                  member={member}
                  i={i}
                  holdProgress={member.name === "GABE" ? holdProgress : 0}
                  onHoldStart={startGabeHold}
                  onHoldEnd={endGabeHold}
                />
            )}
          </div>
        ))}
      </div>

      {/* ── DESKTOP: expanding horizontal panels ── */}
      <div className="hidden md:flex flex-1 relative z-10 pt-0" style={{ minHeight: "calc(100vh - 4rem)" }}>
        {MEMBERS.map((member, i) => (
            <DesktopPanel
            key={member.name}
            member={member}
            i={i}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
              holdProgress={member.name === "GABE" ? holdProgress : 0}
              onHoldStart={startGabeHold}
              onHoldEnd={endGabeHold}
          />
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
      <MediaVault open={vaultOpen} onClose={closeVault} />
    </>
  );
}
