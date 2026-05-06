import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Integrations } from "@/components/sections/Integrations";
import { Marquee } from "@/components/sections/Marquee";
import { Waitlist } from "@/components/sections/Waitlist";
import { FAQ } from "@/components/sections/FAQ";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Integrations />
      <Marquee />
      <Waitlist />
      <FAQ />
    </>
  );
}
