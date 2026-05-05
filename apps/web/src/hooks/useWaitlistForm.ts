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

  const nextStep = () => {
    // Basic validation before moving forward
    if (step === 0) {
      if (!formData.email) {
        setError("Email is required");
        return;
      }
      if (!isValidEmail(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }
    }
    
    if (step === 1 && (!formData.reason || !formData.usage)) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

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

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to join waitlist. Please try again.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setError("Network error. Please check your connection and try again.");
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
