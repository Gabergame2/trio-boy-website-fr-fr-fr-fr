
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Eye, Clock, ExternalLink } from "lucide-react";
import SectionNumber from "./SectionNumber";
import GlitchDivider from "./GlitchDivider";

const VIDEOS = [
  {
    title: "WE SURVIVED 24 HOURS IN AN ABANDONED FACTORY",
    thumbnail: "/videos/thumb1.png",
    views: "4.2M",
    duration: "28:14",
    category: "CHALLENGE",
    vibe: "INTENSE",
  },
  {
    title: "EXTREME NIGHT CHALLENGE — WHO BREAKS FIRST?",
    thumbnail: "/videos/thumb2.png",
    views: "3.8M",
    duration: "22:07",
    category: "EXTREME",
    vibe: "CHAOTIC",
  },
  {
    title: "THE STARE DOWN — TRIO BOYS EDITION",
    thumbnail: "/videos/thumb3.png",
    views: "5.1M",
    duration: "15:32",
    category: "VIRAL",
    vibe: "ELECTRIC",
  },
  {
    title: "BEHIND THE SCENES — HOW WE FILM EVERYTHING",
    thumbnail: "/videos/thumb4.png",
    views: "2.9M",
    duration: "18:45",
    category: "BTS",
    vibe: "RAW",
  },
  {
    title: "WE SURVIVED 24 HOURS IN AN ABANDONED FACTORY PT.2",
    thumbnail: "/videos/thumb1.png",
    views: "3.5M",
    duration: "31:20",
    category: "CHALLENGE",
    vibe: "UNHINGED",
  },
];

function VideoCard({ video, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const rotation = index % 2 === 0 ? -3 : 3;

  return (
    <motion.div
      className="flex-shrink-0 w-[85vw] md:w-[420px] relative group cursor-pointer"
      style={{ rotate: `${rotation}deg` }}
      whileHover={{ rotate: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-sm">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
          </motion.div>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 text-xs font-mono tracking-wider">
          {video.duration}
        </div>

        {/* Hover metadata overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="text-accent text-xs font-bold tracking-[0.2em]">{video.category}</span>
            <span className="text-primary text-xs font-bold tracking-[0.2em]">VIBE: {video.vibe}</span>
          </div>
        </motion.div>
      </div>

      {/* Info below thumbnail */}
      <div className="mt-4 px-1">
        <h3 className="font-display text-sm font-bold leading-tight tracking-wide line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-3 mt-2 text-muted-foreground">
          <span className="flex items-center gap-1 text-xs">
            <Eye className="w-3 h-3" />
            {video.views}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" />
            {video.duration}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function VideoFeed() {
  return (
    <section id="feed" className="relative py-24 md:py-32 overflow-hidden">
      <SectionNumber number="02" />
      <GlitchDivider />

      <div className="px-6 md:px-10 pt-16">
        {/* Section header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-primary" />
            <span className="text-primary text-xs font-body tracking-[0.3em] uppercase font-medium">
              LATEST DROPS
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight">
            THE FEED
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md text-lg leading-relaxed">
            Our latest videos. Raw, unfiltered, unapologetic.
          </p>
        </motion.div>

        {/* Horizontal scroll feed */}
        <div className="flex gap-6 md:gap-8 overflow-x-auto pb-8 -mx-6 px-6 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {VIDEOS.map((video, i) => (
            <VideoCard key={i} video={video} index={i} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-sm font-body tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors"
          >
            VIEW ALL ON YOUTUBE
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}