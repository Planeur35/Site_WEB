import {
  PortableText as SanityPortableText,
  type PortableTextComponents,
} from '@portabletext/react';
import Image from 'next/image';
import clsx from 'clsx';
import { imageDimensions, urlFor } from '@/lib/sanity/image';

interface PortableTextImageValue {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

interface PortableTextLinkValue {
  _type: 'link';
  href: string;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: PortableTextImageValue }) => {
      if (!value?.asset) return null;
      const { width, height } = imageDimensions(value.asset._ref);
      return (
        <figure>
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ''}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 768px"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: PortableTextLinkValue }) => {
      const href = sitePath(value?.href || '');
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      );
    },
  },
};

/**
 * Links typed in the Studio to the site's own pages (planeur35.org, the Vercel address or a preview)
 * become plain paths, so they open in the same tab and follow the site wherever it is hosted.
 */
const OWN_HOST = /^https?:\/\/(?:www\.)?(?:planeur35\.org|piv-sigma\.vercel\.app|piv-[a-z0-9-]+-hamidsefatis-projects\.vercel\.app)(?=[/?#]|$)/i;

function sitePath(href: string): string {
  return OWN_HOST.test(href) ? href.replace(OWN_HOST, '') || '/' : href;
}

interface PortableTextProps {
  value: Parameters<typeof SanityPortableText>[0]['value'] | undefined;
  className?: string;
  /** "fr" when an English page shows the French text (see `isFrenchFallback`). */
  lang?: string;
}

/** Text written in Sanity, styled by `.prose-piv` in globals.css. */
export default function PortableText({ value, className, lang }: PortableTextProps) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  return (
    <div lang={lang} className={clsx('prose-piv', className)}>
      <SanityPortableText value={value} components={components} />
    </div>
  );
}
