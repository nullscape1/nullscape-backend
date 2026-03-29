import { Inquiry } from '../models/Inquiry.js';
import { sendMail } from '../utils/mailer.js';
import logger from '../utils/logger.js';

/**
 * Create an inquiry and send optional admin notification + auto-reply.
 * Business logic lives here; route handler only calls this and sets HTTP response.
 */
export async function createInquiry(payload) {
  const inquiry = await Inquiry.create(payload);

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    sendMail({
      to: adminEmail,
      subject: `New inquiry: ${inquiry.type} from ${inquiry.name || inquiry.email}`,
      text: `Type: ${inquiry.type}\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone}\nMessage: ${inquiry.message}`,
    }).catch((mailErr) => logger.warn('Inquiry admin notification failed', { error: mailErr.message }));
  }

  if (inquiry.email && process.env.INQUIRY_AUTOREPLY_SUBJECT) {
    sendMail({
      to: inquiry.email,
      subject: process.env.INQUIRY_AUTOREPLY_SUBJECT,
      text: process.env.INQUIRY_AUTOREPLY_TEXT || 'Thank you for contacting us. We will get back to you soon.',
    }).catch((mailErr) => logger.warn('Inquiry auto-reply failed', { error: mailErr.message }));
  }

  return inquiry;
}
