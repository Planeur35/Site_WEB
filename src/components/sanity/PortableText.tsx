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
      const href = value?.href || '';
      const isExternal = href.startsWith('http');
      return (
        <a href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      );
    },
  },
};

interface PortableTextProps {
  value: Parameters<typeof SanityPortableText>[0]['value'] | undefined;
  className?: string;
}

/** Text written in Sanity, styled by `.prose-piv` in globals.css. */
export default function PortableText({ value, className }: PortableTextProps) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  return (
    <div className={clsx('prose-piv', className)}>
      <SanityPortableText value={value} components={components} />
    </div>
  );
}
