
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import SectionNumber from "./SectionNumber";
import GlitchDivider from "./GlitchDivider";

const PRODUCTS = [
  {
    name: "VELOCITY HOODIE",
    price: "$89",
    image: "/merch/merch1.png",
    tag: "LIMITED DROP",
    description: "Premium heavyweight. Triple-stitched. Midnight black.",
  },
  {
    name: "PRISM SNAPBACK",
    price: "$45",
    image: "/merch/merch2.png",
    tag: "NEW",
    description: "Structured crown. Embossed triangle. One size.",
  },
  {
    name: "SIGNAL TEE",
    price: "$55",
    image: "/merch/merch3.png",
    tag: "CORE",
    description: "100% organic cotton. Oversized fit. Geometric print.",
  },
];

function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-muted aspect-square">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.08 : 1,
            filter: isHovered ? "brightness(1.1)" : "brightness(0.85)",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Scan line effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-primary/60 pointer-events-none"
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Tag */}
        <div className="absolute top-4 left-4">
          <span className="bg-accent text-accent-foreground text-[10px] font-bold tracking-[0.2em] px-3 py-1.5">
            {product.tag}
          </span>
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center px-6"
            animate={{ y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.description}</p>
            <div className="inline-flex items-center gap-2 text-primary text-sm font-bold tracking-[0.2em]">
              QUICK VIEW <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Product info */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <h3 className="font-display text-lg font-bold tracking-wide group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">{product.description}</p>
        </div>
        <span className="font-display text-xl font-bold text-accent">{product.price}</span>
      </div>
    </motion.div>
  );
}

export default function MerchSection() {
  return (
    <section id="merch" className="relative py-24 md:py-32">
      <SectionNumber number="03" />
      <GlitchDivider />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16">
        {/* Section header */}
        <motion.div
          className="mb-16 md:flex md:items-end md:justify-between"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-accent" />
              <span className="text-accent text-xs font-body tracking-[0.3em] uppercase font-medium">
                EXCLUSIVE DROPS
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight">
              THE DROP
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md text-lg leading-relaxed">
              Limited edition. Once it's gone, it's gone.
            </p>
          </div>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-3 mt-6 md:mt-0 bg-foreground text-background px-8 py-4 text-sm font-bold tracking-[0.15em] hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            SHOP ALL
          </a>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 md:hidden flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm font-bold tracking-[0.15em]"
          >
            <ShoppingBag className="w-4 h-4" />
            SHOP ALL
          </a>
        </div>
      </div>
    </section>
  );
}