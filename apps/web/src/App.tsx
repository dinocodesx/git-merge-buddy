import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { LandingPage } from "@/pages/Home";
import { DocsPage } from "@/pages/Docs";
import { PricingPage } from "@/pages/Pricing";
import { PrivacyPage } from "@/pages/Privacy";
import { TermsPage } from "@/pages/Terms";
import { SecurityPage } from "@/pages/Security";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
      </div>
    </BrowserRouter>
  );
}
