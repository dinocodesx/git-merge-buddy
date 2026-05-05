export const PrivacyPage = () => (
  <div className="min-h-[70vh] bg-zinc-900 p-8 md:p-24 text-white">
    <div className="max-w-4xl mx-auto space-y-12">
      <h1 className="text-5xl md:text-8xl tracking-tighter text-primary uppercase font-space font-bold">
        Privacy Policy
      </h1>
      <div className="space-y-8 opacity-80 font-work text-lg leading-relaxed whitespace-pre-wrap">
        {`Your privacy is our priority. We collect minimal data required for PR analysis.

- We do not store your source code permanently.
- Code snippets are cached only during the analysis period (max 2 hours).
- We never share your codebase with third parties.
- All data is encrypted at rest and in transit.
- We use industry-standard security protocols to protect your information.`}
      </div>
    </div>
  </div>
);
