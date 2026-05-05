import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Integrations } from "@/components/sections/Integrations";
import { Waitlist } from "@/components/sections/Waitlist";
import { FAQ } from "@/components/sections/FAQ";
import { Marquee } from "@/components/sections/Marquee";

export const LandingPage = () => (
  <>
    <Hero />
    <Features />
    <Integrations />
    <Marquee />
    <Waitlist />
    <FAQ />
  </>
);
