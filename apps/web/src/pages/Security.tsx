export const SecurityPage = () => (
  <div className="min-h-[70vh] bg-zinc-900 p-8 md:p-24 text-white">
    <div className="max-w-4xl mx-auto space-y-12">
      <h1 className="text-5xl md:text-8xl tracking-tighter text-primary uppercase font-space font-bold">
        Security Policy
      </h1>
      <div className="space-y-8 opacity-80 font-work text-lg leading-relaxed whitespace-pre-wrap">
        {`Git Merge Buddy's security infrastructure is built on:

- End-to-end encryption for all data in transit.
- SOC 2 Type II compliant hosting providers.
- Regular penetration testing by independent security firms.
- Immediate revocation of tokens post-analysis.
- Automated vulnerability scanning of our own infrastructure.
- Strict access controls and audit logging for internal systems.`}
      </div>
    </div>
  </div>
);
