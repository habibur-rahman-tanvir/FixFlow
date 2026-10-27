import { Worker } from "bullmq";
import { connection } from "../config/queue.js";
import { sendMail } from "../modules/email/email.module.js";

const emailWorker = new Worker(
  "email",
  async (job) => {
    const subject = "Verify your FixFlow account";
    const text = `Your FixFlow verification code is ${job.data.otp}. It expires in 5 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 24px; text-align: center; background: #f9fafb; border-radius: 12px;">
        <h2 style="color: #2563eb;">FixFlow</h2>
        <p>Use the code below to verify your email address.</p>

        <h1 style="background: #dbeafe; color: #1d4ed8; padding: 16px; letter-spacing: 8px; border-radius: 8px;">
          ${job.data.otp}
        </h1>

        <p style="color: #6b7280; font-size: 14px;">
          This code expires in 5 minutes.
        </p>
      </div>
    `;

    await sendMail({ to: job.data.email, subject, text, html });
    console.log({ otp: job.data.otp });
  },
  { connection },
);
