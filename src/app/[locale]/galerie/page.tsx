import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import EmptyState from '@/components/ui/EmptyState';
import Gallery from '@/components/ui/Gallery';
import SitePageHero from '@/components/ui/SitePageHero';
import Section from '@/components/ui/Section';
import { sanityFetch } from '@/lib/sanity/fetch';
import { urlFor } from '@/lib/sanity/image';
import { localize } from '@/lib/sanity/localize';
import { allGalleryImagesQuery } from '@/lib/sanity/queries';
import type { GalleryImage } from '@/lib/sanity/types';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.gallery' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/galerie' });
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('gallery');

  const images = (await sanityFetch<GalleryImage[]>(allGalleryImagesQuery, []))
    .filter((img) => img.image?.asset)
    .map((img) => {
      const caption = localize(img.caption, locale);
      return {
        src: urlFor(img.image).width(1600).url(),
        alt: img.image.alt || caption || '',
        caption,
      };
    });

  return (
    <>
      <SitePageHero page="gallery" kicker={t('heroKicker')} title={t('heroTitle')} variant={1} />
      <Section kicker={t('kicker')} title={t('title')}>
        {images.length > 0 ? <Gallery images={images} /> : <EmptyState>{t('empty')}</EmptyState>}
      </Section>
    </>
  );
}
