import React from "react";
import { motion } from "framer-motion";

export default function GlitchDivider() {
  return (
    <div className="relative w-full h-px my-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}