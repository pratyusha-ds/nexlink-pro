/*
  Warnings:

  - The values [REMOTE,ON_SITE,HYBRID] on the enum `ApplicationType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `mode` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'ON_SITE', 'HYBRID');

-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationType_new" AS ENUM ('REGULAR', 'INTERNSHIP');
ALTER TABLE "applications" ALTER COLUMN "type" TYPE "ApplicationType_new" USING ("type"::text::"ApplicationType_new");
ALTER TYPE "ApplicationType" RENAME TO "ApplicationType_old";
ALTER TYPE "ApplicationType_new" RENAME TO "ApplicationType";
DROP TYPE "public"."ApplicationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "mode" "WorkMode" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reminders" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "cached_jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logo" TEXT,
    "cachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cached_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "enable" BOOLEAN NOT NULL,
    "interval" INTEGER NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reminders_applicationId_key" ON "reminders"("applicationId");

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
