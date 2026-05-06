"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { BrutalButton } from "@/components/ui/BrutalButton";

const HeroBadge = () => (
  <div className="inline-block bg-black text-primary border-4 border-primary px-6 py-2 font-space font-bold text-sm tracking-[0.2em] shadow-brutal-sm">
    ELITE CODE REVIEWS
  </div>
);

const HeroTitle = ({ word }: { word: string }) => (
  <h1 className="text-6xl md:text-8xl lg:text-9xl leading-none tracking-tighter text-white font-space font-black">
    SHIP{" "}
    <AnimatePresence mode="wait">
      <motion.span
        key={word}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-primary text-black px-4 inline-block transform -rotate-1"
      >
        {word}
      </motion.span>
    </AnimatePresence>{" "}
    CODE. <br />
    <span className="text-primary italic">FASTER.</span>
  </h1>
);

const HeroButtons = () => (
  <div className="flex flex-wrap justify-center gap-6 pt-8">
    <BrutalButton size="lg" as="a" href="#waitlist" shadow="white">
      Get Started
    </BrutalButton>
    <BrutalButton
      variant="white"
      size="lg"
      as={Link}
      href="/pricing"
      shadow="white"
    >
      Compare Plans
    </BrutalButton>
  </div>
);

export const Hero = () => {
  const [rotatedIndex, setRotatedIndex] = useState(0);
  const words = ["BETTER", "SECURE", "BUG-FREE"];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatedIndex((prev) => (prev + 1) % words.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative px-6 py-20 md:py-32 overflow-hidden min-h-[80vh] flex flex-col items-center text-center bg-zinc-900 transition-colors">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-10 opacity-[0.05]">
        <div className="font-space font-black text-[25vw] -rotate-12 flex gap-[10vw] text-primary">
          <span>SHIP</span>
          <span>CODE</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        <HeroBadge />
        <HeroTitle word={words[rotatedIndex]} />
        <p className="text-xl md:text-3xl font-medium max-w-3xl mx-auto leading-tight opacity-90 text-zinc-100 font-work">
          Git Merge Buddy is the AI senior engineer that reviews your PRs. No
          fluff, no generic suggestions. Stop merging debt and start shipping
          excellence.
        </p>
        <HeroButtons />
      </div>
    </header>
  );
};
