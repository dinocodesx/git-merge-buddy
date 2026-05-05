import React from "react";
import { Hero } from "../components/landing/sections/Hero";
import { Features } from "../components/landing/sections/Features";
import { Integrations } from "../components/landing/sections/Integrations";
import { Waitlist } from "../components/landing/sections/Waitlist";
import { FAQ } from "../components/landing/sections/FAQ";
import { Marquee } from "../components/layout/Marquee";

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
