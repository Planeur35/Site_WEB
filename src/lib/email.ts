import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return resend.emails.send({
    from: 'Site PIV <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL || 'contact@planeur35.org',
    replyTo: data.email,
    subject: `[Contact PIV] ${data.subject}`,
    text: `Nom: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
  });
}
