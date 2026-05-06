import { InfoLayout } from "@/components/layout/InfoLayout";

export default function PrivacyPage() {
  return (
    <InfoLayout title="Privacy Policy">
      {`Your privacy is our priority. We collect minimal data required for PR analysis.

- We do not store your source code permanently.
- Code snippets are cached only during the analysis period (max 2 hours).
- We never share your codebase with third parties.
- All data is encrypted at rest and in transit.
- We use industry-standard security protocols to protect your information.`}
    </InfoLayout>
  );
}
