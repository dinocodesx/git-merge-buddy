import { useState } from "react";
import { WaitlistFormData } from "@/types/Waitlist";
import { joinWaitlist } from "@/app/actions/waitlist";

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

  const validateEmailStep = () => {
    if (!formData.email) return "Email is required";
    if (!isValidEmail(formData.email))
      return "Please enter a valid email address";
    return null;
  };

  const validateDetailsStep = () => {
    if (!formData.reason || !formData.usage) {
      return "Please fill in all fields";
    }
    return null;
  };

  const validateStep = (currentStep: number): string | null => {
    switch (currentStep) {
      case 0:
        return validateEmailStep();
      case 1:
        return validateDetailsStep();
      default:
        return null;
    }
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

    try {
      const result = await joinWaitlist(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Network error. Please check your connection and try again.";
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
