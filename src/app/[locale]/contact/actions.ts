'use server';

import { sendContactEmail } from '@/lib/email';

export type ContactFormState = {
  success: boolean;
  errors?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  message?: string;
} | null;

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name') as string | null;
  const email = formData.get('email') as string | null;
  const subject = formData.get('subject') as string | null;
  const message = formData.get('message') as string | null;

  const errors: Record<string, string> = {};

  if (!name || name.trim() === '') {
    errors.name = 'required';
  }

  if (!email || email.trim() === '') {
    errors.email = 'required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'invalidEmail';
  }

  if (!subject || subject.trim() === '') {
    errors.subject = 'required';
  }

  if (!message || message.trim() === '') {
    errors.message = 'required';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    await sendContactEmail({
      name: name!.trim(),
      email: email!.trim(),
      subject: subject!.trim(),
      message: message!.trim(),
    });

    return { success: true };
  } catch {
    return { success: false, message: 'error' };
  }
}
