import React from "react";
import { motion } from "framer-motion";

export default function SectionNumber({ number }) {
  return (
    <motion.div
      className="absolute top-0 right-0 pointer-events-none select-none overflow-hidden h-full flex items-center justify-end pr-4 md:pr-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.04 }}
      transition={{ duration: 1 }}
    >
      <span className="font-display font-black text-[20vw] md:text-[15vw] leading-none text-foreground">
        {number}
      </span>
    </motion.div>
  );
}