'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { submitContactForm, type ContactFormState } from '@/app/[locale]/contact/actions';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6" noValidate>
      {/* Success message */}
      {state?.success && (
        <div
          className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800"
          role="status"
        >
          {t('success')}
        </div>
      )}

      {/* General error message */}
      {state && !state.success && state.message && (
        <div
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800"
          role="alert"
        >
          {t('error')}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-primary mb-1.5">
          {t('name')} <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!state?.errors?.name}
          aria-describedby={state?.errors?.name ? 'name-error' : undefined}
          disabled={isPending}
          className="border border-border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {state?.errors?.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {t(state.errors.name as 'required' | 'invalidEmail')}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-primary mb-1.5">
          {t('email')} <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={!!state?.errors?.email}
          aria-describedby={state?.errors?.email ? 'email-error' : undefined}
          disabled={isPending}
          className="border border-border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {state?.errors?.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {t(state.errors.email as 'required' | 'invalidEmail')}
          </p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-primary mb-1.5">
          {t('subject')} <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!state?.errors?.subject}
          aria-describedby={state?.errors?.subject ? 'subject-error' : undefined}
          disabled={isPending}
          className="border border-border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {state?.errors?.subject && (
          <p id="subject-error" className="mt-1 text-sm text-red-600">
            {t(state.errors.subject as 'required' | 'invalidEmail')}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-primary mb-1.5">
          {t('message')} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          aria-required="true"
          aria-invalid={!!state?.errors?.message}
          aria-describedby={state?.errors?.message ? 'message-error' : undefined}
          disabled={isPending}
          className="border border-border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition resize-y disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {state?.errors?.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600">
            {t(state.errors.message as 'required' | 'invalidEmail')}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? t('sending') : t('send')}
      </Button>
    </form>
  );
}
