import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReminderEmailData {
  to: string;
  companyName: string;
  jobTitle: string;
  expirationDate: Date;
  daysRemaining: number;
  applicationId: number;
}

export async function sendReminderEmail(data: ReminderEmailData) {
  const { to, companyName, jobTitle, expirationDate, daysRemaining, applicationId } = data;
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const applicationUrl = `${baseUrl}/applications?id=${applicationId}`;

  const subject = daysRemaining <= 0 
    ? `Application expired: ${jobTitle} at ${companyName}`
    : `Reminder: ${jobTitle} at ${companyName} expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`;

  const text = daysRemaining <= 0
    ? `Your application for ${jobTitle} at ${companyName} has expired on ${expirationDate.toLocaleDateString()}.\n\nView application: ${applicationUrl}`
    : `Your application for ${jobTitle} at ${companyName} will expire in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} (${expirationDate.toLocaleDateString()}).\n\nView application: ${applicationUrl}`;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Nexlink <noreply@nexlink.app>",
      to,
      subject,
      text,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send reminder email:", error);
    return { success: false, error };
  }
}
