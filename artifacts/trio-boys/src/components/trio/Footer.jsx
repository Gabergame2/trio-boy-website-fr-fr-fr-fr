
import React from "react";
import { Youtube, Instagram, Twitter, MessageCircle, Download } from "lucide-react";

const SOCIALS = [
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <img
              src="/logo.png"
              alt="Trio Boys Logo"
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <a
              href="/logo.png"
              download="trio-boys-logo.png"
              className="flex items-center gap-2 border border-border px-3 py-2 text-[0.65rem] font-bold tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              DOWNLOAD LOGO
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-xs tracking-wider">
            © {new Date().getFullYear()} TRIO BOYS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}