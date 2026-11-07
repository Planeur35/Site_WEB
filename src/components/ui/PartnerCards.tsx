import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import PartnerLogo from '@/components/ui/PartnerLogo';
import { isFrenchFallback, localize } from '@/lib/sanity/localize';
import type { Partner } from '@/lib/sanity/types';

interface PartnerCardsProps {
  partners: Partner[];
  locale: string;
  /** On a pale sky band the cards are plain white; on white they get a hairline. */
  onBand?: boolean;
}

/** One card per partner: logo, name and role. Used on the home page and the association page. */
export default async function PartnerCards({ partners, locale, onBand = false }: PartnerCardsProps) {
  const t = await getTranslations('partners');
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {partners.map((partner) => {
        const role = localize(partner.role, locale);
        return (
          <li
            key={partner._id}
            className={clsx('flex min-w-0 flex-col gap-3 rounded-md bg-blanc p-4 lg:gap-4 lg:p-6', !onBand && 'inset-ring inset-ring-horizon')}
          >
            <div className="flex h-16 items-center lg:h-28">
              <PartnerLogo partner={partner} size="card" linkLabel={t('visit', { name: partner.name })} />
            </div>
            <div>
              <p className="text-[0.9375rem] font-semibold text-azur lg:text-base">{partner.name}</p>
              {role && (
                <p
                  lang={isFrenchFallback(partner.role, locale) ? 'fr' : undefined}
                  className="mt-1 text-sm leading-[1.45] text-texte lg:text-[0.9375rem] lg:leading-[1.5]"
                >
                  {role}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
