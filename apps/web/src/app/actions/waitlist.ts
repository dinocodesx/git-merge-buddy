"use server";

import { prisma } from "@/lib/prisma";
import { WaitlistFormData } from "@/types/Waitlist";

export async function joinWaitlist(data: WaitlistFormData) {
  const { email, reason, usage, improvement, pricing } = data;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const entry = await prisma.waitlistEntry.upsert({
      where: { email },
      update: {
        reason,
        usage,
        improvement,
        pricing,
      },
      create: {
        email,
        reason,
        usage,
        improvement,
        pricing,
      },
    });

    return { success: true, data: entry };
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return { error: "Failed to join waitlist. Please try again." };
  }
}
