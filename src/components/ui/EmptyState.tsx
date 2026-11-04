import { getTranslations } from 'next-intl/server';
import FlightTrace from '@/components/ui/FlightTrace';
import TextLink from '@/components/ui/TextLink';

type TextLinkHref = React.ComponentProps<typeof TextLink>['href'];

interface EmptyStateProps {
  /** Defaults to "Bientôt ici". */
  title?: string;
  action?: { href: TextLinkHref; label: string };
  /** Seeds the trace; any stable string. */
  seed?: string;
  children?: React.ReactNode;
}

/** Shown while a section has no content in Sanity yet: a sky with a flight trace and a short message. */
export default async function EmptyState({ title, action, seed = 'bientot', children }: EmptyStateProps) {
  const t = await getTranslations('club');
  return (
    <div className="relative flex h-60 items-center overflow-hidden rounded-md px-6 lg:h-[300px] lg:px-12">
      <FlightTrace seed={seed} align="right" className="absolute! inset-0" />
      <div className="relative max-w-[360px]">
        <p className="font-display text-[2rem] leading-tight font-semibold text-azur">{title ?? t('emptyTitle')}</p>
        {children && <p className="mt-2 text-texte">{children}</p>}
        {action && (
          <TextLink href={action.href} className="mt-2">
            {action.label}
          </TextLink>
        )}
      </div>
    </div>
  );
}
