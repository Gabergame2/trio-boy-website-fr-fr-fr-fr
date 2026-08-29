import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";

const MEDIA_SECTIONS = [
  {
    title: "BRAND FILES",
    items: [
      { label: "Trio Boys Logo", file: "trio-boys-logo.png", src: "/logo.png", kind: "PNG" },
      { label: "Site Favicon", file: "trio-boys-favicon.svg", src: "/favicon.svg", kind: "SVG" },
    ],
  },
  {
    title: "THE BOYS",
    items: [1, 2, 3, 4, 5, 6, 7].map((number) => ({
      label: ["Gabe", "Preston", "Colin", "Rhys", "Connor", "Dom", "Wyatt"][number - 1],
      file: `trio-boys-${number}.png`,
      src: `/members/${number}.png`,
      kind: "PNG",
    })),
  },
  {
    title: "VIDEO THUMBNAILS",
    items: [1, 2, 3, 4].map((number) => ({
      label: `Video Thumbnail ${number}`,
      file: `trio-boys-video-${number}.png`,
      src: `/videos/thumb${number}.png`,
      kind: "PNG",
    })),
  },
  {
    title: "MERCH",
    items: [1, 2, 3].map((number) => ({
      label: `Merch Item ${number}`,
      file: `trio-boys-merch-${number}.png`,
      src: `/merch/merch${number}.png`,
      kind: "PNG",
    })),
  },
  {
    title: "PROJECT SUMMER",
    items: Array.from({ length: 13 }, (_, index) => {
      const day = index + 1;
      return {
        label: `Day ${day}`,
        file: `project-summer-day-${day}.jpg`,
        src: `/project-summer/day${day}.jpg`,
        kind: "JPG",
      };
    }),
  },
];

const TOTAL_MEDIA = MEDIA_SECTIONS.reduce((total, section) => total + section.items.length, 0);

export default function MediaVault({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="min-h-full px-5 py-8 md:px-10 md:py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-start justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-px bg-primary" />
                    <span className="text-primary text-xs font-body tracking-[0.3em] uppercase">
                      Secret archive unlocked
                    </span>
                  </div>
                  <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight">
                    MEDIA <span className="text-accent">VAULT</span>
                  </h2>
                  <p className="text-muted-foreground text-sm mt-3">
                    {TOTAL_MEDIA} local files ready to download at their original quality.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 flex items-center gap-2 border border-border px-4 py-3 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Close media vault"
                >
                  <X className="w-4 h-4" />
                  CLOSE
                </button>
              </div>

              {MEDIA_SECTIONS.map((section) => (
                <section key={section.title} className="mb-12">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-primary text-xs font-body tracking-[0.3em] uppercase">
                      {section.title}
                    </span>
                    <div className="h-px flex-1 bg-border/70" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
                    {section.items.map((item) => (
                      <div key={item.src} className="group">
                        <div className="relative aspect-square overflow-hidden border border-border bg-card">
                          <img
                            src={item.src}
                            alt={item.label}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                          <a
                            href={item.src}
                            download={item.file}
                            className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-2 py-2.5 text-[0.6rem] font-bold tracking-wider opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                            aria-label={`Download ${item.label}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            DOWNLOAD
                          </a>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <p className="text-xs font-bold tracking-wide truncate">{item.label}</p>
                          <span className="text-[0.55rem] text-muted-foreground tracking-widest shrink-0">
                            {item.kind}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}