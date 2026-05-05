import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  PartyPopper,
  Mail,
  ThumbsUp,
} from "lucide-react";
import { useWaitlistForm } from "@/hooks/useWaitlistForm";
import { WaitlistStep } from "@/types/Waitlist";

export const Waitlist = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    step,
    formData,
    updateField,
    nextStep,
    prevStep,
    submitForm,
    isSubmitting,
    error,
  } = useWaitlistForm(() => setSubmitted(true));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      nextStep();
    } else {
      submitForm();
    }
  };

  const steps: WaitlistStep[] = [
    {
      title: "JOIN THE REVOLUTION.",
      description:
        "Join 2,000+ engineers who have already secured their place in the future of automated code review.",
      content: (
        <div className="flex flex-col md:flex-row items-stretch bg-white border-4 border-black shadow-brutal-black">
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="ENTER YOUR EMAIL"
            className="flex-1 p-6 font-space font-bold text-xl outline-none border-b-4 md:border-b-0 md:border-r-4 border-black text-black"
          />
          <button
            type="submit"
            className="bg-black text-primary px-12 py-6 font-space font-bold text-2xl uppercase hover:bg-neutral-800 transition-colors border-t-4 md:border-t-0 md:border-l-4 border-primary flex items-center justify-center gap-3"
          >
            Next <ArrowRight size={24} />
          </button>
        </div>
      ),
    },
    {
      title: "TELL US MORE.",
      description:
        "We're building this for you. How can Git Merge Buddy help your workflow?",
      content: (
        <div className="space-y-6">
          <div className="bg-white border-4 border-black p-6 shadow-brutal-black text-left">
            <label className="block font-space font-black text-black uppercase mb-2">
              Why do you want access?
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => updateField("reason", e.target.value)}
              placeholder="E.G. TIRED OF MANUAL REVIEWS..."
              className="w-full h-32 p-4 font-space font-bold text-lg outline-none bg-zinc-50 border-2 border-black text-black"
            />
          </div>
          <div className="bg-white border-4 border-black p-6 shadow-brutal-black text-left">
            <label className="block font-space font-black text-black uppercase mb-2">
              How do you plan to use it?
            </label>
            <textarea
              required
              value={formData.usage}
              onChange={(e) => updateField("usage", e.target.value)}
              placeholder="E.G. FOR MY OPEN SOURCE PROJECTS..."
              className="w-full h-32 p-4 font-space font-bold text-lg outline-none bg-zinc-50 border-2 border-black text-black"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="bg-zinc-200 text-black px-8 py-4 font-space font-bold text-xl uppercase hover:bg-zinc-300 transition-colors border-4 border-black flex items-center justify-center gap-3"
            >
              <ArrowLeft size={24} /> Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-primary px-8 py-4 font-space font-bold text-xl uppercase hover:bg-neutral-800 transition-colors border-4 border-black flex items-center justify-center gap-3"
            >
              Next <ArrowRight size={24} />
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "SHAPE THE PRODUCT.",
      description:
        "One last thing. Help us get the pricing and features right.",
      content: (
        <div className="space-y-6">
          <div className="bg-white border-4 border-black p-6 shadow-brutal-black text-left">
            <label className="block font-space font-black text-black uppercase mb-2">
              How can we improve the product?
            </label>
            <textarea
              required
              value={formData.improvement}
              onChange={(e) => updateField("improvement", e.target.value)}
              placeholder="E.G. ADD SUPPORT FOR RUST..."
              className="w-full h-32 p-4 font-space font-bold text-lg outline-none bg-zinc-50 border-2 border-black text-black"
            />
          </div>
          <div className="bg-white border-4 border-black p-6 shadow-brutal-black text-left">
            <label className="block font-space font-black text-black uppercase mb-4">
              Pricing Preference
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "monthly", label: "Monthly Subscription" },
                { id: "one-time", label: "One-time Payment" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateField("pricing", opt.id)}
                  className={`p-4 border-4 font-space font-bold uppercase transition-all ${
                    formData.pricing === opt.id
                      ? "bg-black text-primary border-primary"
                      : "bg-zinc-100 text-black border-black hover:bg-zinc-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="bg-zinc-200 text-black px-8 py-4 font-space font-bold text-xl uppercase hover:bg-zinc-300 transition-colors border-4 border-black flex items-center justify-center gap-3"
            >
              <ArrowLeft size={24} /> Back
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting || !formData.improvement || !formData.pricing
              }
              className="flex-1 bg-black text-primary px-8 py-4 font-space font-bold text-xl uppercase hover:bg-neutral-800 transition-colors border-4 border-black disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Complete <Check size={24} />
                </>
              )}
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="waitlist" className="bg-primary py-32 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-space font-black leading-none text-black">
                  {steps[step].title}
                </h2>
                <p className="text-xl md:text-2xl font-bold max-w-xl mx-auto uppercase text-black">
                  {steps[step].description}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                {steps[step].content}
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500 text-white p-4 border-4 border-black font-space font-bold uppercase shadow-brutal-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </form>

              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-3 w-12 border-2 border-black transition-colors ${i === step ? "bg-black" : "bg-white"}`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="bg-black text-primary p-12 md:p-20 border-8 border-white shadow-brutal-black max-w-3xl mx-auto relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <PartyPopper size={120} />
              </div>
              <div className="absolute bottom-0 left-0 p-4 opacity-20">
                <Zap size={120} />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex justify-center gap-4">
                  <div className="bg-primary text-black p-4 rounded-full rotate-12">
                    <Check size={48} strokeWidth={3} />
                  </div>
                </div>

                <h3 className="text-5xl md:text-7xl font-space font-black uppercase mb-4 leading-none tracking-tighter">
                  YOU'RE ON <br />
                  THE LIST.
                </h3>

                <div className="space-y-6 text-xl md:text-2xl font-work font-medium text-white/90">
                  <p className="flex items-center justify-center gap-3">
                    <Mail className="text-primary" />
                    Check{" "}
                    <span className="text-primary font-black underline">
                      {formData.email}
                    </span>{" "}
                    for confirmation.
                  </p>
                  <p className="flex items-center justify-center gap-3">
                    <ThumbsUp className="text-primary" />
                    Your feedback is being reviewed by our team.
                  </p>
                </div>

                <div className="pt-8">
                  <div className="inline-block bg-primary text-black px-8 py-4 font-space font-black text-2xl uppercase shadow-brutal-sm rotate-1">
                    WELCOME TO THE FUTURE.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
