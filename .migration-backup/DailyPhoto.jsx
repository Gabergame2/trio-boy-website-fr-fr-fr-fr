import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function DailyPhoto({ name, day, image, delay = 0.6 }) {
  return (
    <motion.div
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
    >
      <div className="relative overflow-hidden border border-border bg-card group">
        <img
          src={image}
          alt={`${name} - ${day}`}
          className="w-full aspect-[3/4] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
        <a
          href={image}
          download
          className="absolute bottom-3 right-3 flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 text-xs font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent hover:text-accent-foreground"
        >
          <Download className="w-4 h-4" />
          DOWNLOAD
        </a>
      </div>
      <div className="mt-5 text-center">
        <h3 className="font-display text-3xl font-black tracking-tight">
          {name.toUpperCase()}
        </h3>
        <p className="text-accent text-xs font-body tracking-[0.3em] uppercase mt-1">
          {day}
        </p>
      </div>
    </motion.div>
  );
}