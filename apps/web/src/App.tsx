import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingPage } from "@/pages/LandingPage";
import { DocsPage } from "@/pages/DocsPage";
import { PricingPage } from "@/pages/PricingPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";
import { SecurityPage } from "@/pages/SecurityPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen selection:bg-primary selection:text-black transition-colors bg-zinc-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/security-policy" element={<SecurityPage />} />
        </Routes>
        <Footer />
        <div className="bg-black border-t-4 border-primary py-10 overflow-hidden pointer-events-none select-none">
          <h2 className="text-[20vw] font-space font-black text-primary leading-none tracking-tighter opacity-10 whitespace-nowrap -mb-10 text-center uppercase">
            Git Merge Buddy
          </h2>
        </div>
      </div>
    </BrowserRouter>
  );
}
