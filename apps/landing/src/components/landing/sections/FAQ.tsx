import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "How does Git Merge Buddy compare to GitHub Copilot?", a: "Copilot suggests code while you write. Git Merge Buddy acts as the senior architect who reviews your finished PR, looking for high-level flaws, security risks, and architectural drift." },
    { q: "Does Git Merge Buddy store my source code?", a: "No. We analyze code in a secure, transient environment. Once the analysis is complete, your data is wiped from our memory." },
    { q: "Can I use it with private repositories?", a: "Absolutely. Our Pro and Enterprise plans allow seamless integration with private GitHub, GitLab, and Bitbucket repositories." },
    { q: "How do I customize the rules?", a: "You can drop a .gitmergebuddy.yaml file into your repo root. Define your strictness, focus areas, and even specific patterns to ignore." },
    { q: "What languages do you support?", a: "We support Python, JavaScript, TypeScript, Go, Rust, Java, and C++. We're adding new languages every month." },
    { q: "Does it work with existing CI/CD pipelines?", a: "Yes. Git Merge Buddy can be triggered via GitHub Actions, GitLab CI, Bitbucket Pipelines, or our stand-alone CLI tool." },
    { q: "How accurate is the security scan?", a: "Our scans cover the full OWASP Top 10 and use taint analysis to find vulnerabilities that standard linters miss." },
    { q: "Can it auto-approve PRs?", a: "Yes, you can configure 'Auto-Approve' for PRs that meet specific non-critical criteria, like documentation changes." },
    { q: "What's the pricing for huge teams?", a: "Our Enterprise plan is custom-built for large scale. Contact us for flat-rate organization-wide licensing." },
    { q: "Can I explain my code to the bot?", a: "Yes! You can reply to any comment made by Git Merge Buddy to clarify your approach or ask for a refactored alternative." },
    { q: "Does it find performance bottlenecks?", a: "Yes, our engine identifies O(n²) loops, redundant API calls, and excessive re-renders in frontend code." },
    { q: "Can I self-host Git Merge Buddy?", a: "The Enterprise plan includes a self-hosted agent option for teams with strict data residency requirements." },
    { q: "How long does a review take?", a: "Most reviews are completed in 30-90 seconds, depending on the size of the PR." },
    { q: "Does it integrate with Slack?", a: "Yes, you can get instant review summaries and critical alerts directly in your Slack or Discord channels." },
    { q: "Is there a free trial?", a: "Our Solo plan starts at just $5, but we offer a 14-day free trial of our Pro features for all new accounts." }
  ];

  return (
    <section className="bg-zinc-900 py-32 px-6 border-b-4 border-primary">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-space font-black text-white uppercase leading-none">Frequently Asked.</h2>
          <p className="text-primary font-bold uppercase mt-4">Still confused? Read on.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-4 border-primary bg-black hover:bg-zinc-800 transition-colors">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center group"
              >
                <span className="text-lg md:text-xl font-space font-bold text-white uppercase">{faq.q}</span>
                <span className={`text-primary transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>
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
                    <div className="p-6 pt-0 text-zinc-400 font-work border-t border-primary/20 mt-2">
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
