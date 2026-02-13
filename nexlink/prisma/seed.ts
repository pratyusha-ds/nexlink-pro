const { PrismaClient } = require("../src/generated/prisma");
const { PrismaNeon } = require("@prisma/adapter-neon");
const { neonConfig } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const path = require("path");
const ws = require("ws");

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning database...");
  await prisma.application.deleteMany();

  console.log("Seeding all fields for Application model...");

  await prisma.application.createMany({
    data: [
      {
        companyName: "Google",
        jobTitle: "Software Engineer",
        status: "WAITING_FOR_INTERVIEW",
        type: "REMOTE",
        location: "Mountain View, CA",
        email: "hiring@google.com",
        description: "Full-stack role focusing on Next.js internal tools.",
        website: "https://google.com",
        jobUrl: "https://www.google.com/about/careers/applications",
        notes: "Referral from John Doe. Need to brush up on LeetCode.",
        salary: "$180,000 - $220,000",
        logoUrl: "https://logo.clearbit.com/google.com",
        interviewDnT: new Date("2026-03-15T14:00:00Z"),
      },
      {
        companyName: "Meta",
        jobTitle: "Frontend Developer",
        status: "APPLIED",
        type: "HYBRID",
        location: "Menlo Park, CA",
        email: "careers@meta.com",
        description: "React specialist for the Reality Labs team.",
        website: "https://meta.com",
        jobUrl: "https://www.metacareers.com/jobs/12345",
        notes: "Applied via LinkedIn. Recruiter reached out 2 days later.",
        salary: "$165,000",
        logoUrl: "https://logo.clearbit.com/meta.com",
        interviewDnT: null,
      },
      {
        companyName: "Amazon",
        jobTitle: "Backend Dev",
        status: "BEING_PROCESSED",
        type: "ON_SITE",
        location: "Seattle, WA",
        email: "aws-hiring@amazon.com",
        description: "Scale distributed systems for AWS S3.",
        website: "https://amazon.com",
        jobUrl: "https://amazon.jobs/en/jobs/backend-dev",
        notes: "Passed the initial OA (Online Assessment).",
        salary: "$150k + Stocks",
        logoUrl: "https://logo.clearbit.com/amazon.com",
        interviewDnT: new Date("2026-02-28T10:30:00Z"),
      },
      {
        companyName: "Netflix",
        jobTitle: "UI Engineer",
        status: "REJECTED",
        type: "REMOTE",
        location: "Los Gatos, CA",
        email: "talent@netflix.com",
        description: "Improving the TV browsing experience.",
        website: "https://netflix.com",
        jobUrl: "https://jobs.netflix.com/jobs/999",
        notes: "Rejected after final round. Culture fit was the feedback.",
        salary: "Top of Market",
        logoUrl: "https://logo.clearbit.com/netflix.com",
        interviewDnT: new Date("2026-01-20T09:00:00Z"),
      },
      {
        companyName: "Apple",
        jobTitle: "iOS Developer",
        status: "PENDING",
        type: "ON_SITE",
        location: "Cupertino, CA",
        email: "recruiting@apple.com",
        description: "SwiftUI and VisionPro development.",
        website: "https://apple.com",
        jobUrl: "https://www.apple.com/jobs/us/ios-dev",
        notes: "Portfolio was highly praised.",
        salary: "Competitive",
        logoUrl: "https://logo.clearbit.com/apple.com",
        interviewDnT: null,
      },
    ],
  });

  console.log("All fields seeded successfully");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
