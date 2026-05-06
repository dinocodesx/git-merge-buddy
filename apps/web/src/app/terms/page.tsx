import { InfoLayout } from "@/components/layout/InfoLayout";

export default function TermsPage() {
  return (
    <InfoLayout title="Terms of Service">
      {`By using Git Merge Buddy, you agree to:

- Use the service for legal development purposes.
- Not attempt to reverse engineer the AI engine.
- Pay the subscription fees associated with your chosen plan.
- Respect the intellectual property of the service and its providers.
- Maintain the confidentiality of your account and access tokens.
- Comply with all applicable laws and regulations.`}
    </InfoLayout>
  );
}
