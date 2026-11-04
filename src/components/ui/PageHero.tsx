import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import Kicker from '@/components/ui/Kicker';
import SanityPhoto from '@/components/ui/SanityPhoto';
import type { SanityImage } from '@/lib/sanity/types';

interface PageHeroProps {
  kicker: string;
  title: string;
  /** Lead paragraph on the right of the title. */
  lead?: string;
  image?: SanityImage;
  /** Replaces the lead on the right, e.g. the price panel. */
  aside?: React.ReactNode;
  /** Defaults to Accueil / title. */
  breadcrumb?: React.ReactNode;
}

/** Page header on white: breadcrumb, title and lead, then the photo below (never text over the photo). */
export default async function PageHero({ kicker, title, lead, image, aside, breadcrumb }: PageHeroProps) {
  const t = await getTranslations('nav');
  return (
    <Container className="pt-12 lg:pt-16">
      <nav aria-label={t('breadcrumb')} className="mb-7 text-sm text-brume">
        {breadcrumb ?? (
          <>
            <Link href="/" className="hover:text-altitude hover:underline">
              {t('home')}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{title}</span>
          </>
        )}
      </nav>
      <div className="flex flex-wrap items-end gap-x-16 gap-y-6">
        <div className="flex-[999_1_560px]">
          <Kicker>{kicker}</Kicker>
          <h1 className="font-display text-[2.75rem] leading-[1.03] font-semibold tracking-titre text-azur lg:text-h1">
            {title}
          </h1>
        </div>
        {(aside || lead) && (
          <div className="flex-[1_1_340px]">
            {aside ?? <p className="text-[1.1875rem] leading-[1.55] text-texte lg:text-lead">{lead}</p>}
          </div>
        )}
      </div>
      {image?.asset && (
        <SanityPhoto image={image} className="mt-12 h-[clamp(280px,38vw,540px)]" sizes="(max-width: 1280px) 100vw, 1200px" priority />
      )}
    </Container>
  );
}
