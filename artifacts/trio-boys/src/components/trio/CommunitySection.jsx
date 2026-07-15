import React from "react";
import { motion } from "framer-motion";
import { Youtube, Instagram, Twitter, MessageCircle, Users, Heart, Zap, TrendingUp } from "lucide-react";
import SectionNumber from "./SectionNumber";
import GlitchDivider from "./GlitchDivider";

const SOCIAL_CARDS = [
  {
    platform: "YOUTUBE",
    icon: Youtube,
    stat: "2.1M",
    label: "SUBSCRIBERS",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    link: "https://youtube.com",
  },
  {
    platform: "INSTAGRAM",
    icon: Instagram,
    stat: "890K",
    label: "FOLLOWERS",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    link: "https://instagram.com",
  },
  {
    platform: "TWITTER",
    icon: Twitter,
    stat: "620K",
    label: "FOLLOWERS",
    color: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    link: "https://twitter.com",
  },
  {
    platform: "DISCORD",
    icon: MessageCircle,
    stat: "45K",
    label: "MEMBERS",
    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    link: "https://discord.com",
  },
];

const HIGHLIGHTS = [
  { icon: Users, value: "3.6M+", label: "TOTAL COMMUNITY" },
  { icon: Heart, value: "50M+", label: "TOTAL LIKES" },
  { icon: Zap, value: "900+", label: "VIDEOS CREATED" },
  { icon: TrendingUp, value: "180M+", label: "TOTAL VIEWS" },
];

function SocialCard({ card, index }) {
  return (
    <motion.a
      href={card.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative overflow-hidden border ${card.color} p-6 md:p-8 hover:scale-[1.02] transition-transform duration-300`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Background icon */}
      <card.icon className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <card.icon className="w-5 h-5" />
          <span className="text-xs font-body tracking-[0.2em]">{card.platform}</span>
        </div>
        <p className="font-display text-3xl md:text-4xl font-black">{card.stat}</p>
        <p className="text-muted-foreground text-xs tracking-[0.15em] mt-1">{card.label}</p>
      </div>
    </motion.a>
  );
}

export default function CommunitySection() {
  return (
    <section id="community" className="relative py-24 md:py-32">
      <SectionNumber number="04" />
      <GlitchDivider />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-primary" />
            <span className="text-primary text-xs font-body tracking-[0.3em] uppercase font-medium">
              JOIN THE MOVEMENT
            </span>
            <div className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight">
            THE NEXUS
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-lg leading-relaxed">
            More than a fanbase. We're a movement. Connect with us everywhere.
          </p>
        </motion.div>

        {/* Social cards bento */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16">
          {SOCIAL_CARDS.map((card, i) => (
            <SocialCard key={card.platform} card={card} index={i} />
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 py-12 border-t border-b border-border/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={item.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <item.icon className="w-5 h-5 text-primary mx-auto mb-3" />
              <p className="font-display text-2xl md:text-3xl font-black">{item.value}</p>
              <p className="text-muted-foreground text-xs tracking-[0.15em] mt-1">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter / CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
            NEVER MISS A <span className="text-primary">DROP</span>
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Join the inner circle. Early access to videos, merch, and exclusive content.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="flex-1 bg-muted border border-border px-5 py-3.5 text-sm font-body tracking-wider placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary text-primary-foreground px-8 py-3.5 text-sm font-bold tracking-[0.15em] hover:bg-accent hover:text-accent-foreground transition-colors duration-300 whitespace-nowrap">
              JOIN NOW
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}