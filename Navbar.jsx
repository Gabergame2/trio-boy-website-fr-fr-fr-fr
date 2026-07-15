const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Youtube, ExternalLink } from "lucide-react";

const NAV_ITEMS = [
  { label: "THE BOYS", href: "#hero" },
  { label: "VIDEOS", href: "#feed" },
  { label: "MERCH", href: "#merch" },
  { label: "COMMUNITY", href: "#community" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/80 backdrop-blur-xl border-b border-primary/10" : ""
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2 group">
            <img
              src="https://media.db.com/images/public/6a30bf87c8bc35a71d08ae5f/e003c3074_1000012074.png"
              alt="Trio Boys Logo"
              className="h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="relative px-4 py-2 text-sm font-body font-medium tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold tracking-wider hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
            >
              <Youtube className="w-4 h-4" />
              SUBSCRIBE
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="text-3xl font-display font-bold tracking-widest text-foreground hover:text-primary transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 text-lg font-bold tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Youtube className="w-5 h-5" />
              SUBSCRIBE
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}