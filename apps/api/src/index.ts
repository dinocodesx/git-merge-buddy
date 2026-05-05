import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.post("/api/waitlist", async (req, res) => {
  const { email, reason, usage, improvement, pricing } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
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

    res.status(201).json(entry);
  } catch (error) {
    console.error("Waitlist submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
