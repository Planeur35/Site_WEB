import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import Kicker from '@/components/ui/Kicker';
import SanityPhoto from '@/components/ui/SanityPhoto';
import type { SanityImage } from '@/lib/sanity/types';

interface PageHeroProps {
  kicker: string;
  title: string;
  /** Lead paragraph: on the right of the title, or under it when there is an `aside`. */
  lead?: string;
  image?: SanityImage;
  /** A panel on the right of the title (the price panel); on phones it comes after the photo. */
  aside?: React.ReactNode;
  /** Name of the page in the breadcrumb, when it differs from the title. */
  crumb?: string;
}

const titleClass = 'font-display text-[2.75rem] leading-[1.03] font-semibold tracking-titre text-balance text-azur lg:text-h1';
const leadClass = 'text-[1.1875rem] leading-[1.55] text-texte lg:text-lead';

/** Page header on white: breadcrumb, title and lead, then the photo below (never text over the photo). */
export default async function PageHero({ kicker, title, lead, image, aside, crumb }: PageHeroProps) {
  const t = await getTranslations('nav');
  const photo = image?.asset ? (
    <SanityPhoto image={image} className="h-[clamp(280px,38vw,540px)]" sizes="(max-width: 1280px) 100vw, 1200px" priority />
  ) : null;

  return (
    <Container className="pt-12 lg:pt-16">
      <nav aria-label={t('breadcrumb')} className="mb-7 text-sm text-brume">
        <Link href="/" className="hover:text-altitude hover:underline">
          {t('home')}
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{crumb ?? title}</span>
      </nav>

      {aside ? (
        // Text, photo, panel in reading order; from lg the panel moves up beside the text
        <div className="grid gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:items-end lg:gap-x-16 lg:gap-y-12">
          <div>
            <Kicker>{kicker}</Kicker>
            <h1 className={titleClass}>{title}</h1>
            {lead && <p className={`mt-6 max-w-[640px] ${leadClass}`}>{lead}</p>}
          </div>
          {photo && <div className="lg:col-span-2 lg:row-start-2">{photo}</div>}
          <div className="lg:col-start-2 lg:row-start-1">{aside}</div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-end gap-x-16 gap-y-6">
            <div className="flex-[999_1_560px]">
              <Kicker>{kicker}</Kicker>
              <h1 className={titleClass}>{title}</h1>
            </div>
            {lead && (
              <div className="flex-[1_1_340px]">
                <p className={leadClass}>{lead}</p>
              </div>
            )}
          </div>
          {photo && <div className="mt-12">{photo}</div>}
        </>
      )}
    </Container>
  );
}
