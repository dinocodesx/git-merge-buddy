import { useState } from "react";
import { WaitlistFormData } from "@/types/Waitlist";

export const useWaitlistForm = (onSuccess: () => void) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: "",
    reason: "",
    usage: "",
    improvement: "",
    pricing: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof WaitlistFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep = (currentStep: number): string | null => {
    if (currentStep === 0) {
      if (!formData.email) return "Email is required";
      if (!isValidEmail(formData.email)) return "Please enter a valid email address";
    }
    
    if (currentStep === 1 && (!formData.reason || !formData.usage)) {
      return "Please fill in all fields";
    }

    return null;
  };

  const nextStep = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";

    try {
      const response = await fetch(`${apiUrl}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to join waitlist. Please try again.");
      }

      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error. Please check your connection and try again.";
      console.error("Submission failed:", err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    formData,
    updateField,
    nextStep,
    prevStep,
    submitForm,
    isSubmitting,
    error,
    setStep,
  };
};
