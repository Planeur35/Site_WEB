import { Route } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface AnecdoteProps {
  title?: string;
  text?: string;
}

/** A callout in a long read (club history, flight stories): label, title and a short text. */
export default async function Anecdote({ title, text }: AnecdoteProps) {
  const t = await getTranslations('club');
  return (
    <aside aria-label={t('anecdote')} className="w-full rounded-md bg-ciel p-[22px] lg:px-9 lg:py-8">
      <p className="flex items-center gap-2 font-display text-sm font-semibold text-balise lg:text-[0.9375rem]">
        <Route size={18} strokeWidth={2} aria-hidden="true" />
        {t('anecdote')}
      </p>
      {title && (
        <h3 className="mt-3 font-display text-xl leading-[1.25] font-semibold text-azur lg:text-[1.375rem]">{title}</h3>
      )}
      {text && <p className="mt-3 text-[1.0625rem] leading-[1.65] text-texte">{text}</p>}
    </aside>
  );
}
