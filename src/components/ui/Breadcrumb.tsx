import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type LinkHref = React.ComponentProps<typeof Link>['href'];

interface BreadcrumbProps {
  /** The pages between Accueil and the current one. */
  trail?: { href: LinkHref; label: string }[];
  /** Name of the current page. */
  current: string;
}

/** "Accueil / Actualités / Titre", above a page title. */
export default async function Breadcrumb({ trail = [], current }: BreadcrumbProps) {
  const t = await getTranslations('nav');
  const link = 'hover:text-altitude hover:underline';
  return (
    <nav aria-label={t('breadcrumb')} className="text-sm text-brume">
      <Link href="/" className={link}>
        {t('home')}
      </Link>
      {trail.map((item) => (
        <span key={item.label}>
          <span aria-hidden="true"> / </span>
          <Link href={item.href} className={link}>
            {item.label}
          </Link>
        </span>
      ))}
      <span aria-hidden="true"> / </span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}
