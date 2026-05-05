import React, { useState } from "react";
import { motion } from "motion/react";
import { Zap, ShieldAlert, Cpu } from "lucide-react";
import { BrutalButton } from "@/components/ui/BrutalButton";

export const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const docSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: (
        <div className="space-y-8 text-white">
          <h1 className="text-4xl md:text-6xl tracking-tighter text-primary uppercase font-space font-bold">
            Welcome to Git Merge Buddy
          </h1>
          <p className="text-xl opacity-80 leading-relaxed font-work">
            Git Merge Buddy is designed to integrate seamlessly into your
            existing workflow. Follow these steps to get up and running in
            minutes.
          </p>

          <div className="space-y-6">
            <h2 className="text-2xl flex items-center gap-3 font-space uppercase font-bold">
              <span className="bg-primary text-black w-8 h-8 flex items-center justify-center font-bold">
                1
              </span>
              Install the App
            </h2>
            <p className="opacity-70 font-work">
              Navigate to the GitHub Marketplace and find Git Merge Buddy.
              Install it on your chosen organization or specific repositories.
            </p>
            <div className="bg-zinc-800 text-primary p-4 border-4 border-primary/20 font-mono text-sm">
              gh extension install gitmergebuddy/cli
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl flex items-center gap-3 font-space uppercase font-bold">
              <span className="bg-primary text-black w-8 h-8 flex items-center justify-center font-bold">
                2
              </span>
              Configure Rules
            </h2>
            <p className="opacity-70 font-work">
              Create a{" "}
              <code className="bg-zinc-800 text-primary px-1 py-0.5">
                .gitmergebuddy.yaml
              </code>{" "}
              file in your repository root to define your custom quality gates.
            </p>
            <pre className="bg-zinc-950 text-zinc-300 p-6 border-4 border-primary/20 text-sm overflow-x-auto shadow-brutal-sm">
              {`rules:
              performance: aggressive
              security: paranoid
              architectural: true
              ignore_paths:
                - "**/test/**"
                - "legacy/"`}
            </pre>
          </div>

          <div className="bg-zinc-800/50 p-8 border-l-8 space-y-4 border-4 border-primary/20">
            <h3 className="text-xl font-bold flex items-center gap-2 text-primary uppercase font-space">
              <Zap size={20} />
              Pro Tip
            </h3>
            <p className="opacity-80 font-work">
              Git Merge Buddy works best when individual PRs are kept under 300
              lines. Smaller context leads to better reasoning and deeper
              insights.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "configuration",
      title: "Configuration",
      content: (
        <div className="space-y-8 text-white">
          <h1 className="text-4xl md:text-6xl tracking-tighter text-primary uppercase font-space font-bold">
            Configuration Guide
          </h1>
          <p className="text-xl opacity-80 leading-relaxed font-work">
            Tune your AI senior engineer to match your team's specific standards
            and style guides.
          </p>
          <div className="space-y-4 border-t-2 border-primary/20 pt-8">
            <h3 className="text-2xl font-space uppercase font-bold">
              Available Parameters
            </h3>
            <ul className="list-disc list-inside space-y-2 opacity-70 font-work">
              <li>
                <code className="text-primary font-bold">strictness</code>: low
                | normal | aggressive
              </li>
              <li>
                <code className="text-primary font-bold">auto_approve</code>:
                true | false
              </li>
              <li>
                <code className="text-primary font-bold">focus_areas</code>:
                Array of features
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "security-policies",
      title: "Security Policies",
      content: (
        <div className="space-y-8 text-white">
          <h1 className="text-4xl md:text-6xl tracking-tighter text-primary uppercase font-space font-bold">
            Security Standards
          </h1>
          <p className="text-xl opacity-80 leading-relaxed font-work">
            How Git Merge Buddy identifies and prevents top OWASP
            vulnerabilities automatically.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
            {[
              "SQL Injection",
              "Cross-Site Scripting",
              "Broken Auth",
              "Sensitive Data",
            ].map((s) => (
              <div
                key={s}
                className="p-6 bg-zinc-800 border-4 border-primary/20 hover:border-primary transition-colors"
              >
                <ShieldAlert className="mb-4 text-primary" />
                <h4 className="font-bold uppercase mb-2 font-space">{s}</h4>
                <p className="text-sm opacity-60 font-work">
                  Full flow-analysis coverage for all modern frameworks.
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-900 transition-colors">
      {/* Docs Sidebar */}
      <aside className="w-full md:w-72 bg-black border-r-4 border-primary p-8 space-y-12 shrink-0">
        <div className="space-y-4">
          <div className="text-xs font-black opacity-40 uppercase tracking-widest text-white/40">
            Documentation
          </div>
          <nav className="flex flex-col gap-2">
            {docSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`
                  text-left font-space font-bold uppercase p-3 transition-all
                  ${
                    activeSection === sec.id
                      ? "bg-primary text-black border-4 border-primary shadow-brutal-sm"
                      : "opacity-60 hover:opacity-100 text-white"
                  }
                `}
              >
                {sec.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 bg-zinc-800 border-4 border-primary/20 space-y-4">
          <h4 className="text-sm font-black text-white">NEED HELP?</h4>
          <BrutalButton variant="yellow" size="sm" className="w-full">
            Support
          </BrutalButton>
        </div>
      </aside>

      {/* Docs Content */}
      <main className="flex-1 p-8 md:p-16 max-w-4xl">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {docSections.find((s) => s.id === activeSection)?.content}
        </motion.div>

        <div className="mt-24 pt-8 border-t-4 border-primary/20 flex justify-between items-center">
          <BrutalButton
            variant="white"
            size="sm"
            onClick={() => window.scrollTo(0, 0)}
          >
            Back to Top
          </BrutalButton>
          <div className="flex gap-4 opacity-40 font-bold uppercase text-xs text-white">
            <span>Last Updated: 2024</span>
          </div>
        </div>
      </main>
    </div>
  );
};
