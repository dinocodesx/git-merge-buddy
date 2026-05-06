import React from "react";
import { ArrowRight, Circle, Cpu, FileJson } from "lucide-react";

export interface FeatureItem {
  tag: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

export const FEATURE_ITEMS: FeatureItem[] = [
  {
    tag: "1-click & AI fixes",
    title: "Catch fast. Fix fast.",
    description:
      "1-click commits for easy fixes and a 'Fix with AI' button for more complex architectural refactors.",
    content: (
      <div className="bg-zinc-950 p-4 border-2 border-primary/20 font-mono text-[10px] md:text-xs text-zinc-300">
        <div className="flex justify-between items-center mb-4 border-b border-primary/10 pb-2">
          <span className="text-primary">suggestion.ts</span>
          <span className="bg-primary text-black px-2 text-[10px] font-bold">
            STABLE FIX
          </span>
        </div>
        <div className="space-y-1">
          <div className="text-red-400 bg-red-950/30 line-through opacity-60">
            - async function fetchAll(ids: string[]) &#123;
          </div>
          <div className="text-red-400 bg-red-950/30 line-through opacity-60">
            - return ids.map(async id =&gt; await db.get(id));
          </div>
          <div className="text-red-400 bg-red-950/30 line-through opacity-60">
            - &#125;
          </div>
          <div className="text-green-400 bg-green-950/30">
            + async function fetchAll(ids: string[]) &#123;
          </div>
          <div className="text-green-400 bg-green-950/30">
            + return Promise.all(ids.map(id =&gt; db.get(id)));
          </div>
          <div className="text-green-400 bg-green-950/30">+ &#125;</div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="bg-primary text-black px-3 py-1 font-bold text-[10px] uppercase cursor-pointer">
            Apply Fix
          </div>
          <div className="border border-white/20 text-white px-3 py-1 text-[10px] uppercase cursor-pointer">
            Review
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: "Summaries & visual diagrams",
    title: "TL;DR for your diff.",
    description:
      "Quick context with a summary of changes, a walkthrough & an architectural diagram.",
    content: (
      <div className="h-full flex flex-col justify-center items-center bg-zinc-950/50 p-6 border-2 border-primary/20 space-y-4">
        <div className="w-full space-y-2">
          <div className="h-1 bg-primary/50 w-3/4"></div>
          <div className="h-1 bg-primary/20 w-1/2"></div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-12 h-16 border-2 border-primary/40 flex flex-col items-center justify-center">
            <div className="w-6 h-1 bg-primary mb-1"></div>
            <div className="w-8 h-1 bg-primary"></div>
          </div>
          <ArrowRight size={16} className="text-primary opacity-50" />
          <div className="w-12 h-16 border-2 border-primary flex flex-col items-center justify-center bg-primary/10">
            <div className="w-8 h-1 bg-primary mb-1"></div>
            <Circle className="w-2 h-2 text-primary" fill="currentColor" />
          </div>
        </div>
        <div className="text-[10px] text-zinc-500 font-mono italic">
          MAP: AuthProxy -&gt; TokenStore
        </div>
      </div>
    ),
  },
  {
    tag: "Agentic reviews",
    title: "Find the bugs. Skip the noise.",
    description:
      "We find bugs humans miss – & flag the time consuming and tedious. Without the noise.",
    content: (
      <div className="bg-zinc-950 p-4 border-2 border-primary/20 font-mono text-xs h-full flex flex-col justify-center gap-2">
        <div className="bg-zinc-900 p-3 border-l-4 border-red-500">
          <div className="text-red-500 font-bold mb-1 uppercase text-[10px]">
            Critical: Race Condition
          </div>
          <div className="text-zinc-400 text-[10px] leading-tight">
            Updating <code className="text-zinc-200">counter</code> without a
            transaction could lead to inconsistent state...
          </div>
        </div>
        <div className="bg-zinc-900 p-3 border-l-4 border-yellow-500">
          <div className="text-yellow-500 font-bold mb-1 uppercase text-[10px]">
            Warning: Re-entrancy
          </div>
          <div className="text-zinc-400 text-[10px] leading-tight">
            External call before state update in{" "}
            <code className="text-zinc-200">withdraw()</code>...
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: "Chat",
    title: "Chat with the bot directly.",
    description:
      "Give feedback on reviews to create Learnings. Or create issues, trigger docstrings & more.",
    content: (
      <div className="bg-zinc-950 p-4 border-2 border-primary/20 font-mono text-xs space-y-4">
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-zinc-800 rounded-full shrink-0"></div>
          <div className="bg-zinc-900 p-2 rounded-lg text-white">
            <div className="text-[10px] text-zinc-400 mb-1">
              jennjenn <span className="opacity-50">(author)</span>
            </div>
            <div className="text-[10px] uppercase">
              @gitmergebuddy we want to get rid of the star imports
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <div className="bg-primary/10 border border-primary/30 p-2 rounded-lg text-right">
            <div className="text-[10px] text-primary mb-1">
              Git Merge Buddy <span className="opacity-50">bot</span>
            </div>
            <div className="text-zinc-200 text-[10px]">
              UNDERSTOOD. CONVERTING STAR IMPORTS TO NAMED EXPORTS...
            </div>
          </div>
          <div className="w-6 h-6 bg-primary rounded-full shrink-0 flex items-center justify-center">
            <Cpu size={12} className="text-black" />
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: "Your code, your way",
    title: "Most customizable tool.",
    description:
      "Customize everything from your coding guidelines to your workflow in a yaml file.",
    content: (
      <div className="bg-zinc-950 p-4 border-2 border-primary/20 font-mono text-[10px] h-full flex flex-col justify-center items-center">
        <div className="flex items-center gap-3 bg-zinc-900 p-4 border border-primary/20">
          <FileJson size={24} className="text-primary" />
          <div className="font-black text-xl text-primary tracking-tighter">
            YAML
          </div>
        </div>
        <div className="mt-4 text-zinc-500 italic uppercase tracking-widest text-[8px]">
          ENGINE_CONFIG.YAML
        </div>
      </div>
    ),
  },
  {
    tag: "Automated reports",
    title: "The reports you need.",
    description:
      "Automate the creation of your daily standup reports, sprint reviews, and more.",
    content: (
      <div className="bg-zinc-950 p-6 border-2 border-primary/20 font-space text-white h-full flex flex-col justify-center">
        <div className="space-y-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            Quality Focus
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-green-400">
              <span className="text-xs uppercase">Issues Found</span>
              <span className="font-bold">98</span>
            </div>
            <div className="flex justify-between items-center text-primary">
              <span className="text-xs uppercase">Refactors</span>
              <span className="font-bold">44</span>
            </div>
            <div className="flex justify-between items-center text-blue-400">
              <span className="text-xs uppercase">Accepted</span>
              <span className="font-bold">39</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];
