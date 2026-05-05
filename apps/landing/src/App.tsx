import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { LandingPage } from "./pages/LandingPage";
import { DocsPage } from "./pages/DocsPage";
import { PricingPage } from "./pages/PricingPage";
import { LegalPage } from "./pages/LegalPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen selection:bg-primary selection:text-black transition-colors bg-zinc-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/privacy"
            element={
              <LegalPage
                title="Privacy Policy"
                content={`Your privacy is our priority. We collect minimal data required for PR analysis.
                        - We do not store your source code permanently.
                        - Code snippets are cached only during the analysis period (max 2 hours).
                        - We never share your codebase with third parties.`}
              />
            }
          />
          <Route
            path="/terms"
            element={
              <LegalPage
                title="Terms of Service"
                content={`By using Git Merge Buddy, you agree to:
                        - Use the service for legal development purposes.
                        - Not attempt to reverse engineer the AI engine.
                        - Pay the subscription fees associated with your chosen plan.`}
              />
            }
          />
          <Route
            path="/security-policy"
            element={
              <LegalPage
                title="Security Policy"
                content={`Git Merge Buddy's security infrastructure is built on:
                        - End-to-end encryption for all data in transit.
                        - SOC 2 Type II compliant hosting providers.
                        - Regular penetration testing.
                        - Immediate revocation of tokens post-analysis.`}
              />
            }
          />
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
