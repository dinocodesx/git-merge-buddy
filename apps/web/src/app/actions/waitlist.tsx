"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { WaitlistFormData } from "@/types/Waitlist";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlist(data: WaitlistFormData) {
  const { email, reason, usage, improvement, pricing } = data;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: { email },
    });

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

    // Send welcome email only to new users
    if (!existingEntry && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Git Merge Buddy <waitlist@git.dinocodes.in>",
          to: email,
          subject: "Welcome to the Future of Code Reviews",
          react: <WelcomeEmail />,
        });
      } catch (emailError) {
        // Log the error but don't fail the submission
        console.error("Failed to send welcome email:", emailError);
      }
    }

    return { success: true, data: entry };
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return { error: "Failed to join waitlist. Please try again." };
  }
}
