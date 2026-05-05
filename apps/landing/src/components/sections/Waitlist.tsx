import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';

export const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="bg-primary py-32 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-space font-black leading-none text-black">JOIN THE REVOLUTION.</h2>
        <p className="text-xl md:text-2xl font-bold max-w-xl mx-auto uppercase text-black">
          Join 2,000+ engineers who have already secured their place in the future of automated code review.
        </p>
        
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row items-stretch bg-white border-4 border-black shadow-brutal-black"
            >
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL" 
                className="flex-1 p-6 font-space font-bold text-xl outline-none border-b-4 md:border-b-0 md:border-r-4 border-black text-black"
              />
              <button 
                type="submit"
                className="bg-black text-primary px-12 py-6 font-space font-bold text-2xl uppercase hover:bg-neutral-800 transition-colors border-t-4 md:border-t-0 md:border-l-4 border-primary"
              >
                Join Waitlist
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black text-primary p-12 border-4 border-primary shadow-brutal"
            >
              <Zap size={48} className="mx-auto mb-6" fill="currentColor" />
              <h3 className="text-4xl font-space font-black uppercase mb-2">You're In.</h3>
              <p className="text-xl font-bold uppercase opacity-80">Watch your inbox for the welcome transmission.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
