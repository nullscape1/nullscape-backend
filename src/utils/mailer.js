import nodemailer from 'nodemailer';

let transporter;
export function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) {
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const tx = getTransporter();
  if (!tx) return;
  const from = process.env.SMTP_FROM || 'No-Reply <no-reply@example.com>';
  await tx.sendMail({ from, to, subject, text, html });
}



