
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Calendar, Flame, Mail } from "lucide-react";
import Navbar from "@/components/trio/Navbar";
import DailyPhoto from "@/components/trio/DailyPhoto";

export default function ProjectSummer() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background sun glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <motion.div
            className="w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full blur-[120px] bg-accent/10"
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs tracking-[0.2em] uppercase mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-accent" />
              <Sun className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs font-body tracking-[0.3em] uppercase font-medium">
                Classified
              </span>
              <div className="w-8 h-px bg-accent" />
            </div>

            <h1 className="font-display text-6xl md:text-9xl font-black tracking-tight leading-none">
              PROJECT
              <span className="block text-accent">SUMMER</span>
            </h1>

            <p className="text-muted-foreground mt-8 max-w-xl mx-auto text-lg leading-relaxed">
              The sun's out and the boys are (MILDLY) locked in. This is going to
              be the biggest season yet (duh cuz we haven't posted yet)
              challenges, collabs, and content you will believe because the
              production value is LOW! Also, daily photos showcasing the Trio
              Boys Summer!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-body tracking-[0.15em] uppercase">
                  Summer 2026
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-border" />
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-primary" />
                <span className="text-sm font-body tracking-[0.15em] uppercase">
                  Incoming
                </span>
              </div>
            </div>
          </motion.div>

          {/* Countdown / teaser card */}
          <motion.div
            className="mt-16 relative overflow-hidden border border-border bg-card p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-[1px] bg-primary/30 pointer-events-none"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-center text-muted-foreground text-sm tracking-[0.2em] uppercase">
              Loading next drop...
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-accent rounded-full"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Email sign up */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary" />
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-body tracking-[0.3em] uppercase font-medium">
                Get Notified
              </span>
              <div className="w-8 h-px bg-primary" />
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
              NEVER MISS A <span className="text-accent">DROP</span>
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Join the inner circle. Early access to videos, merch, and exclusive content.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="flex-1 bg-muted border border-border px-5 py-3.5 text-sm font-body tracking-wider placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-8 py-3.5 text-sm font-bold tracking-[0.15em] hover:bg-accent hover:text-accent-foreground transition-colors duration-300 whitespace-nowrap"
              >
                JOIN NOW
              </button>
            </form>
          </motion.div>

          {/* Daily photo */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-px bg-accent" />
              <Sun className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs font-body tracking-[0.3em] uppercase font-medium">
                Daily Photo
              </span>
              <div className="w-8 h-px bg-accent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <DailyPhoto
                name="Gabe"
                day="Day 1"
                image="/project-summer/day1.jpg"
                delay={0.6}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 2"
                image="/project-summer/day2.jpg"
                delay={0.7}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 3"
                image="/project-summer/day3.jpg"
                delay={0.8}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 4"
                image="/project-summer/day4.jpg"
                delay={0.9}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 5"
                image="/project-summer/day5.jpg"
                delay={1.0}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 6"
                image="/project-summer/day6.jpg"
                delay={1.1}
              />
              <div className="sm:col-span-2 text-center py-6">
                <h3 className="font-display text-3xl md:text-5xl font-black tracking-tight">
                  SEVEN PHOTOS FOR <span className="text-accent">7 DAYS!</span>
                </h3>
              </div>
              <DailyPhoto
                name="Gabe"
                day="Day 7"
                image="/project-summer/day7.jpg"
                delay={1.2}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 7"
                image="/project-summer/day8.jpg"
                delay={1.25}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 7"
                image="/project-summer/day9.jpg"
                delay={1.3}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 7"
                image="/project-summer/day10.jpg"
                delay={1.35}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 7"
                image="/project-summer/day11.jpg"
                delay={1.4}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 7"
                image="/project-summer/day12.jpg"
                delay={1.45}
              />
              <DailyPhoto
                name="Gabe"
                day="Day 7"
                image="/project-summer/day13.jpg"
                delay={1.5}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}