import Image from 'next/image';
import Kicker from '@/components/ui/Kicker';
import { urlFor } from '@/lib/sanity/image';
import type { Partner } from '@/lib/sanity/types';

interface PartnersPanelProps {
  partners: Partner[];
  kicker: string;
  title: string;
}

/** Box listing the partners: logo with the name of the organisation under it (the name alone until a logo is added). */
export default function PartnersPanel({ partners, kicker, title }: PartnersPanelProps) {
  if (partners.length === 0) return null;

  return (
    <section aria-labelledby="partners-title" className="border border-sky-900/10 bg-ciel p-5 md:p-6">
      <Kicker>{kicker}</Kicker>
      <h2 id="partners-title" className="font-serif text-2xl leading-tight text-sky-950">
        {title}
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
        {partners.map((partner) => {
          const tile = (
            <>
              {partner.logo?.asset && (
                <span className="relative block h-16 w-full">
                  <Image src={urlFor(partner.logo).width(480).url()} alt="" fill sizes="160px" className="object-contain" />
                </span>
              )}
              <span className="text-xs leading-snug text-slate-700">{partner.name}</span>
            </>
          );
          const tileClass = 'flex h-full flex-col items-center justify-center gap-2 border border-sky-900/10 bg-white p-3 text-center';
          return (
            <li key={partner._id}>
              {partner.url ? (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
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
