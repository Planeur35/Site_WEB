import clsx from 'clsx';
import { Languages } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

interface FrenchOnlyNoteProps {
  className?: string;
}

/** On /en, above a block that exists only in French: "This section is only available in French." */
export default async function FrenchOnlyNote({ className }: FrenchOnlyNoteProps) {
  const locale = await getLocale();
  const t = await getTranslations('common');
  return (
    // The block around it is marked lang="fr"; the note itself is in the page's language
    <p
      lang={locale}
      className={clsx('inline-flex items-center gap-2 rounded-xs bg-ciel px-2.5 py-1 text-sm text-brume', className)}
    >
      <Languages size={16} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />
      {t('frenchOnly')}
    </p>
  );
}
