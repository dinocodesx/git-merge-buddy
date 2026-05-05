export interface FAQItem {
  q: string;
  a: string;
}

export const FAQS: FAQItem[] = [
  {
    q: "How does Git Merge Buddy compare to GitHub Copilot?",
    a: "Copilot suggests code while you write. Git Merge Buddy acts as the senior architect who reviews your finished PR, looking for high-level flaws, security risks, and architectural drift.",
  },
  {
    q: "Does Git Merge Buddy store my source code?",
    a: "No. We analyze code in a secure, transient environment. Once the analysis is complete, your data is wiped from our memory.",
  },
  {
    q: "Can I use it with private repositories?",
    a: "Absolutely. Our Pro and Enterprise plans allow seamless integration with private GitHub, GitLab, and Bitbucket repositories.",
  },
  {
    q: "How do I customize the rules?",
    a: "You can drop a .gitmergebuddy.yaml file into your repo root. Define your strictness, focus areas, and even specific patterns to ignore.",
  },
  {
    q: "What languages do you support?",
    a: "We support Python, JavaScript, TypeScript, Go, Rust, Java, and C++. We're adding new languages every month.",
  },
  {
    q: "Does it work with existing CI/CD pipelines?",
    a: "Yes. Git Merge Buddy can be triggered via GitHub Actions, GitLab CI, Bitbucket Pipelines, or our stand-alone CLI tool.",
  },
  {
    q: "How accurate is the security scan?",
    a: "Our scans cover the full OWASP Top 10 and use taint analysis to find vulnerabilities that standard linters miss.",
  },
  {
    q: "Can it auto-approve PRs?",
    a: "Yes, you can configure 'Auto-Approve' for PRs that meet specific non-critical criteria, like documentation changes.",
  },
  {
    q: "What's the pricing for huge teams?",
    a: "Our Enterprise plan is custom-built for large scale. Contact us for flat-rate organization-wide licensing.",
  },
  {
    q: "Can I explain my code to the bot?",
    a: "Yes! You can reply to any comment made by Git Merge Buddy to clarify your approach or ask for a refactored alternative.",
  },
  {
    q: "Does it find performance bottlenecks?",
    a: "Yes, our engine identifies O(n²) loops, redundant API calls, and excessive re-renders in frontend code.",
  },
  {
    q: "Can I self-host Git Merge Buddy?",
    a: "The Enterprise plan includes a self-hosted agent option for teams with strict data residency requirements.",
  },
  {
    q: "How long does a review take?",
    a: "Most reviews are completed in 30-90 seconds, depending on the size of the PR.",
  },
  {
    q: "Does it integrate with Slack?",
    a: "Yes, you can get instant review summaries and critical alerts directly in your Slack or Discord channels.",
  },
  {
    q: "Is there a free trial?",
    a: "Our Solo plan starts at just $5, but we offer a 14-day free trial of our Pro features for all new accounts.",
  },
];
