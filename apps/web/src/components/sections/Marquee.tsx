"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";

export const Marquee = () => (
  <div className="bg-black py-6 border-b-4 border-black overflow-hidden relative grayscale hover:grayscale-0 transition-all">
    <motion.div
      className="flex whitespace-nowrap gap-12"
      animate={{ x: [0, -1000] }}
      transition={{
        repeat: Infinity,
        duration: 20,
        ease: "linear",
      }}
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-12 text-primary text-3xl font-space font-bold uppercase"
        >
          <span>Instant Reviews</span>
          <Star fill="currentColor" size={24} />
          <span>Security Scans</span>
          <Star fill="currentColor" size={24} />
          <span>Performance Optimization</span>
          <Star fill="currentColor" size={24} />
          <span>Architectural Insights</span>
          <Star fill="currentColor" size={24} />
        </div>
      ))}
    </motion.div>
  </div>
);
