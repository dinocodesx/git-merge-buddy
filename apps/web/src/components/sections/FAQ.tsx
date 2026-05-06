"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";
import { FAQS } from "@/constants/faqs";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-zinc-900 py-32 px-6 border-b-4 border-primary">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-space font-black text-white uppercase leading-none">
            Frequently Asked.
          </h2>
          <p className="text-primary font-bold uppercase mt-4">
            Still confused? Read on.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border-4 border-primary bg-black hover:bg-zinc-800 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center group"
              >
                <span className="text-lg md:text-xl font-space font-bold text-white uppercase">
                  {faq.q}
                </span>
                <span
                  className={`text-primary transition-transform ${openIndex === i ? "rotate-45" : ""}`}
                >
                  <Zap size={24} fill="currentColor" />
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 text-zinc-400 font-work border-t border-primary/20 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
