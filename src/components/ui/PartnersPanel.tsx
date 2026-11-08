import Image from 'next/image';
import Kicker from '@/components/ui/Kicker';
import { urlFor } from '@/lib/sanity/image';
import type { Partner } from '@/lib/sanity/types';

interface PartnersPanelProps {
  partners: Partner[];
  kicker: string;
  title: string;
}

/** Side band listing the partners with their logos (the name stands in until a logo is added). */
export default function PartnersPanel({ partners, kicker, title }: PartnersPanelProps) {
  if (partners.length === 0) return null;

  return (
    <section aria-labelledby="partners-title" className="border border-sky-900/10 bg-ciel p-6">
      <Kicker>{kicker}</Kicker>
      <h2 id="partners-title" className="font-serif text-2xl leading-tight text-sky-950">
        {title}
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-3">
        {partners.map((partner) => {
          const tile = partner.logo?.asset ? (
            <span className="relative block h-16 w-full">
              <Image src={urlFor(partner.logo).width(480).url()} alt={partner.name} fill sizes="160px" className="object-contain" />
            </span>
          ) : (
            <span className="text-center text-xs leading-snug text-slate-700">{partner.name}</span>
          );
          const tileClass = 'flex min-h-20 items-center justify-center border border-sky-900/10 bg-white p-3';
          return (
            <li key={partner._id}>
              {partner.url ? (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={partner.name}
                  className={`${tileClass} transition-colors hover:border-sky-400`}
                >
                  {tile}
                </a>
              ) : (
                <div className={tileClass}>{tile}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
