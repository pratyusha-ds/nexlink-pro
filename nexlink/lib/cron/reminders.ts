import { db } from "../prisma";
import { sendReminderEmail } from "../email";

export interface ReminderResult {
  applicationId: number;
  sent: boolean;
  error?: string;
}

function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getDaysUntilExpiration(expirationDate: Date): number {
  const today = getStartOfDay(new Date());
  const expiration = getStartOfDay(new Date(expirationDate));
  const diffTime = expiration.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function shouldSendReminder(
  expirationDate: Date,
  reminderInterval: number,
  lastSentAt: Date | null
): { shouldSend: boolean; daysRemaining: number } {
  const daysRemaining = getDaysUntilExpiration(expirationDate);
  
  if (daysRemaining > reminderInterval) {
    return { shouldSend: false, daysRemaining };
  }

  if (lastSentAt) {
    const lastSentDay = getStartOfDay(lastSentAt);
    const today = getStartOfDay(new Date());
    if (lastSentDay.getTime() === today.getTime()) {
      return { shouldSend: false, daysRemaining };
    }
  }

  return { shouldSend: true, daysRemaining };
}

export async function processReminders(): Promise<{
  processed: number;
  sent: number;
  results: ReminderResult[];
}> {
  const applications = await db.application.findMany({
    where: {
      enableReminder: true,
      expirationDate: { not: null },
      user: {
        reminders: true,
      },
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      reminders: true,
    },
  });

  const results: ReminderResult[] = [];
  let sentCount = 0;

  for (const application of applications) {
    const { shouldSend, daysRemaining } = shouldSendReminder(
      application.expirationDate!,
      application.reminderInterval,
      application.reminders[0]?.lastSentAt ?? null
    );

    if (!shouldSend) {
      continue;
    }

    const emailResult = await sendReminderEmail({
      to: application.user.email,
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      expirationDate: application.expirationDate!,
      daysRemaining,
      applicationId: application.id,
    });

    if (emailResult.success) {
      await db.reminder.upsert({
        where: { applicationId: application.id },
        create: {
          applicationId: application.id,
          lastSentAt: new Date(),
          nextSendAt: null,
        },
        update: {
          lastSentAt: new Date(),
        },
      });

      sentCount++;
      results.push({ applicationId: application.id, sent: true });
    } else {
      results.push({
        applicationId: application.id,
        sent: false,
        error: "Failed to send email",
      });
    }
  }

  return {
    processed: applications.length,
    sent: sentCount,
    results,
  };
}
