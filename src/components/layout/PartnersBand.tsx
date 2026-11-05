import { getTranslations } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PartnerLogo from '@/components/ui/PartnerLogo';
import type { Partner } from '@/lib/sanity/types';
import HideOnPaths from './HideOnPaths';

interface PartnersBandProps {
  partners: Partner[];
}

/** Partners' logos just above the footer, on every page but the association page (which lists them in full). */
export default async function PartnersBand({ partners }: PartnersBandProps) {
  if (partners.length === 0) return null;
  const t = await getTranslations('partners');

  return (
    <HideOnPaths paths={['/association']}>
      <section aria-labelledby="partners-band" className="border-t border-horizon bg-blanc">
        <Container className="py-10 lg:py-12">
          <h2 id="partners-band" className="text-[0.9375rem] font-semibold text-brume">
            {t('bandTitle')}
          </h2>
          <ul className="mt-6 grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-8 sm:flex sm:flex-wrap sm:justify-start sm:gap-x-12">
            {partners.map((partner) => (
              <li key={partner._id}>
                <PartnerLogo partner={partner} linkLabel={t('visit', { name: partner.name })} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </HideOnPaths>
  );
}
