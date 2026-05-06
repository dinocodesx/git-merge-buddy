import React from 'react';
import { FEATURE_ITEMS } from '@/constants/features';

interface FeatureCardProps {
  tag: string;
  title: string;
  description: string;
  content: React.ReactNode;
  className?: string;
}

const FeatureCard = ({ 
  tag,
  title, 
  description, 
  content,
  className = ""
}: FeatureCardProps) => (
  <div className={`group relative bg-zinc-900/50 p-8 border-2 border-primary/10 hover:border-primary hover:shadow-brutal transition-all hover:z-10 flex flex-col h-full ${className}`}>
    <div className="flex-1 mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
      {content}
    </div>
    
    <div className="space-y-4">
      <div className="text-primary font-mono text-sm tracking-tight opacity-80 decoration-primary group-hover:underline">
        //{tag}
      </div>
      <h3 className="text-2xl md:text-3xl text-white font-space font-bold uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="font-work text-zinc-400 leading-relaxed text-sm md:text-base group-hover:text-zinc-200 transition-colors">
        {description}
      </p>
    </div>
  </div>
);

export const Features = () => (
  <section id="features" className="bg-black border-y-4 border-primary py-24 px-6 transition-colors">
    <div className="max-w-7xl mx-auto">
      <div className="mb-20 space-y-4">
        <h2 className="text-4xl md:text-6xl text-white uppercase font-space font-black">Tested Examples</h2>
        <p className="text-lg md:text-2xl font-bold opacity-60 text-primary uppercase">AI-driven reviews that think like a senior architect.</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURE_ITEMS.map((feature, i) => (
          <FeatureCard 
            key={i}
            tag={feature.tag}
            title={feature.title}
            description={feature.description}
            content={feature.content}
          />
        ))}
      </div>
    </div>
  </section>
);
