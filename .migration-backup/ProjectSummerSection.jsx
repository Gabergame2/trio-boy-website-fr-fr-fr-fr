import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import SectionNumber from "./SectionNumber";
import GlitchDivider from "./GlitchDivider";

export default function ProjectSummerSection() {
  return (
    <section id="project-summer" className="relative py-24 md:py-32">
      <SectionNumber number="05" />
      <GlitchDivider />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16">
        <motion.div
          className="relative overflow-hidden border border-border bg-gradient-to-br from-card via-background to-background p-10 md:p-16 group"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Glow accents */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Animated scan line */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-primary/30 pointer-events-none"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-accent" />
                <span className="text-accent text-xs font-body tracking-[0.3em] uppercase font-medium">
                  Coming Soon
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight leading-none">
                PROJECT
                <span className="block text-accent">SUMMER</span>
              </h2>
              <p className="text-muted-foreground mt-5 max-w-md text-lg leading-relaxed">
                The boys are cooking up some big stuff for the hottest months.
                Sun, chaos, and the biggest and best stuff yet!
              </p>
            </div>

            <Link
              to="/project-summer"
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm font-bold tracking-[0.15em] hover:bg-accent hover:text-accent-foreground transition-colors duration-300 self-start md:self-auto"
            >
              <Sun className="w-4 h-4" />
              ENTER
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}