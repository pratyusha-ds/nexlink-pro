-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPLIED', 'BEING_PROCESSED', 'WAITING_FOR_INTERVIEW', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('REMOTE', 'ON_SITE', 'HYBRID');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "middleName" TEXT;

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "website" TEXT,
    "jobUrl" TEXT,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" "ApplicationType" NOT NULL,
    "notes" TEXT,
    "interviewDnT" TIMESTAMP(3),
    "salary" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
