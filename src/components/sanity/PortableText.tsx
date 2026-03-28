'use client';

import {
  PortableText as SanityPortableText,
  type PortableTextComponents,
} from '@portabletext/react';
import { urlFor } from '@/lib/sanity/image';

interface PortableTextImageValue {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

interface PortableTextLinkValue {
  _type: 'link';
  href: string;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: PortableTextImageValue }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <img
            src={urlFor(value).width(1200).auto('format').url()}
            alt={value.alt || ''}
            className="w-full rounded-lg"
            loading="lazy"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: PortableTextLinkValue }) => {
      const href = value?.href || '';
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          className="text-blue-600 underline hover:text-blue-800 transition-colors"
          {...(isExternal
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-10 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-6 mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold mt-4 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};

interface PortableTextProps {
  value: Parameters<typeof SanityPortableText>[0]['value'];
  className?: string;
}

export default function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null;

  return (
    <div className={className || 'prose prose-lg max-w-none'}>
      <SanityPortableText value={value} components={components} />
    </div>
  );
}
