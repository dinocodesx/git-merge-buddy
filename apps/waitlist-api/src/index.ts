import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const port = process.env.PORT || 3002;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3001",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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
