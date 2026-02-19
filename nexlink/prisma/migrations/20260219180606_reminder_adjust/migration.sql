/*
  Warnings:

  - You are about to drop the column `enable` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `reminders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "enableReminder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expirationDate" TIMESTAMP(3),
ADD COLUMN     "reminderInterval" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "reminders" DROP COLUMN "enable",
DROP COLUMN "interval",
ADD COLUMN     "lastSentAt" TIMESTAMP(3),
ADD COLUMN     "nextSendAt" TIMESTAMP(3);
