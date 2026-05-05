export interface WaitlistFormData {
  email: string;
  reason: string;
  usage: string;
  improvement: string;
  pricing: string;
}

export interface WaitlistStep {
  title: string;
  description: string;
  content: React.ReactNode;
}
