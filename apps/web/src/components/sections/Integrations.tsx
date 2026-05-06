import React from "react";
import { Github, Gitlab, GitBranch } from "lucide-react";

export const Integrations = () => (
  <section className="bg-zinc-950 py-24 px-6 border-b-4 border-primary overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="space-y-6 max-w-xl text-center md:text-left">
        <h2 className="text-4xl md:text-6xl text-white font-space font-black uppercase leading-tight">
          WORKS WHERE YOU WORK.
        </h2>
        <p className="text-xl text-zinc-400 font-work leading-relaxed">
          Native integrations for the most popular git providers. No matter
          where your code lives, we speak its language.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full md:w-auto">
        <div className="bg-black border-4 border-primary p-8 flex flex-col items-center gap-4 hover:bg-zinc-900 transition-colors group">
          <Github
            size={48}
            className="text-primary group-hover:scale-110 transition-transform"
          />
          <div className="font-space font-bold uppercase text-white">
            GitHub
          </div>
        </div>
        <div className="bg-black border-4 border-primary p-8 flex flex-col items-center gap-4 hover:bg-zinc-900 transition-colors group">
          <Gitlab
            size={48}
            className="text-primary group-hover:scale-110 transition-transform"
          />
          <div className="font-space font-bold uppercase text-white">
            GitLab
          </div>
        </div>
        <div className="bg-black border-4 border-primary p-8 flex flex-col items-center gap-4 hover:bg-zinc-900 transition-colors group">
          <GitBranch
            size={48}
            className="text-primary group-hover:scale-110 transition-transform"
          />
          <div className="font-space font-bold uppercase text-white">
            Bitbucket
          </div>
        </div>
      </div>
    </div>
  </section>
);
