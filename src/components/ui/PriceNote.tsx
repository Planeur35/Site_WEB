import clsx from 'clsx';

interface PriceNoteProps {
  children: React.ReactNode;
  /** Language of the text when it falls back to French on /en. */
  lang?: string;
  className?: string;
}

/** The condition of a price ("Moins de 18 ans : si scolarisé en Ille-et-Vilaine"): its own line, small and secondary. */
export default function PriceNote({ children, lang, className }: PriceNoteProps) {
  return (
    <span lang={lang} className={clsx('mt-1 block text-[0.8125rem] leading-snug font-normal text-brume', className)}>
      {children}
    </span>
  );
}
