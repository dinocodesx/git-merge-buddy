export const TermsPage = () => (
  <div className="min-h-[70vh] bg-zinc-900 p-8 md:p-24 text-white">
    <div className="max-w-4xl mx-auto space-y-12">
      <h1 className="text-5xl md:text-8xl tracking-tighter text-primary uppercase font-space font-bold">
        Terms of Service
      </h1>
      <div className="space-y-8 opacity-80 font-work text-lg leading-relaxed whitespace-pre-wrap">
        {`By using Git Merge Buddy, you agree to:

- Use the service for legal development purposes.
- Not attempt to reverse engineer the AI engine.
- Pay the subscription fees associated with your chosen plan.
- Respect the intellectual property of the service and its providers.
- Maintain the confidentiality of your account and access tokens.
- Comply with all applicable laws and regulations.`}
      </div>
    </div>
  </div>
);
