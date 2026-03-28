import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/metadata';
import Hero from '@/components/ui/Hero';
import SectionContainer from '@/components/ui/SectionContainer';
import Gallery from '@/components/ui/Gallery';
import { client } from '@/lib/sanity/client';
import { allGalleryImagesQuery } from '@/lib/sanity/queries';
import { localize } from '@/lib/sanity/localize';
import { urlFor } from '@/lib/sanity/image';
import type { GalleryImage } from '@/lib/sanity/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'fr'
      ? "Galerie photos \u2014 Planeurs d'Ille-et-Vilaine"
      : "Photo gallery \u2014 Planeurs d'Ille-et-Vilaine",
    description: locale === 'fr'
      ? "Galerie photos du club de vol \u00e0 voile : planeurs, paysages bretons, vie du club et \u00e9v\u00e9nements."
      : 'Soaring club photo gallery: gliders, Breton landscapes, club life, and events.',
    locale,
    pathname: '/galerie',
  });
}

export const revalidate = 60;

interface TransformedImage {
  src: string;
  alt: string;
  caption?: string;
}

const placeholderColors = [
  'from-sky-200 to-sky-300',
  'from-blue-200 to-blue-300',
  'from-indigo-200 to-indigo-300',
  'from-cyan-200 to-cyan-300',
  'from-teal-200 to-teal-300',
  'from-emerald-200 to-emerald-300',
  'from-sky-300 to-blue-200',
  'from-blue-300 to-indigo-200',
  'from-indigo-300 to-cyan-200',
  'from-cyan-300 to-teal-200',
  'from-teal-300 to-emerald-200',
  'from-emerald-300 to-sky-200',
];

async function getGalleryImages(locale: string): Promise<TransformedImage[]> {
  try {
    const images: GalleryImage[] = await client.fetch(allGalleryImagesQuery);
    if (images && images.length > 0) {
      return images.map((img) => ({
        src: urlFor(img.image).width(800).height(600).auto('format').url(),
        alt: localize(img.caption, locale) || '',
        caption: localize(img.caption, locale) || undefined,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const images = await getGalleryImages(locale);

  return <GalleryPageContent locale={locale} images={images} />;
}

function GalleryPageContent({
  locale,
  images,
}: {
  locale: string;
  images: TransformedImage[];
}) {
  const tNav = useTranslations('nav');
  const tGallery = useTranslations('gallery');

  const hasImages = images.length > 0;

  return (
    <div>
      <Hero
        title={tNav('gallery')}
        subtitle={tGallery('heroSubtitle')}
      />

      <section className="py-16">
        <SectionContainer>
          {hasImages ? (
            <Gallery images={images} />
          ) : (
            <>
              <p className="text-center text-muted mb-8">
                {tGallery('noImages')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => {
                  const captions =
                    locale === 'fr'
                      ? [
                          'Decollage au treuil',
                          'Vol au-dessus de la campagne bretonne',
                          'Preparation du planeur',
                          'Vue du cockpit',
                          'Atterrissage en douceur',
                          'Briefing avant le vol',
                          'Le hangar du club',
                          'Vol en thermique',
                          'Coucher de soleil sur la piste',
                          'Journee portes ouvertes',
                          'Formation en biplace',
                          'La flotte au complet',
                        ]
                      : [
                          'Winch launch',
                          'Flying over the Breton countryside',
                          'Glider preparation',
                          'Cockpit view',
                          'Smooth landing',
                          'Pre-flight briefing',
                          'The club hangar',
                          'Thermal soaring',
                          'Sunset over the runway',
                          'Open day',
                          'Tandem training flight',
                          'The full fleet',
                        ];

                  return (
                    <div
                      key={i}
                      className={`aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${placeholderColors[i]} flex flex-col items-center justify-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 text-white/50 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
                        />
                      </svg>
                      <p className="text-white/70 text-sm font-medium px-4 text-center">
                        {captions[i]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SectionContainer>
      </section>
    </div>
  );
}
