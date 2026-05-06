import { InfoLayout } from "@/components/layout/InfoLayout";

export default function SecurityPage() {
  return (
    <InfoLayout title="Security Policy">
      {`Git Merge Buddy's security infrastructure is built on:

- End-to-end encryption for all data in transit.
- SOC 2 Type II compliant hosting providers.
- Regular penetration testing by independent security firms.
- Immediate revocation of tokens post-analysis.
- Automated vulnerability scanning of our own infrastructure.
- Strict access controls and audit logging for internal systems.`}
    </InfoLayout>
  );
}
