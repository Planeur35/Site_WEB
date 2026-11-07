import clsx from 'clsx';
import Container from '@/components/ui/Container';
import Kicker from '@/components/ui/Kicker';
import TextLink from '@/components/ui/TextLink';

type TextLinkHref = React.ComponentProps<typeof TextLink>['href'];

interface SectionProps {
  id?: string;
  kicker?: string;
  title: string;
  sub?: string;
  /** Link shown on the right of the title ("Toutes les actualités"). */
  action?: { href: TextLinkHref | string; label: string; external?: boolean };
  /** Full-width pale sky background. */
  band?: boolean;
  children: React.ReactNode;
}

export default function Section({ id, kicker, title, sub, action, band = false, children }: SectionProps) {
  return (
    <section id={id} className={clsx('scroll-mt-36 py-16 lg:py-28', band && 'bg-ciel')}>
      <Container>
        <div className={clsx(action && 'flex flex-wrap items-end justify-between gap-x-8 gap-y-4')}>
          <div>
            {kicker && <Kicker>{kicker}</Kicker>}
            <h2 className="font-display text-[1.875rem] leading-[1.12] font-semibold text-azur lg:text-h2">{title}</h2>
            {sub && <p className="mt-4 max-w-[640px] text-[1.1875rem] leading-[1.55] text-texte lg:text-lead">{sub}</p>}
          </div>
          {action && (
            <TextLink href={action.href} external={action.external}>
              {action.label}
            </TextLink>
          )}
        </div>
        <div className="mt-7 lg:mt-12">{children}</div>
      </Container>
    </section>
  );
}
