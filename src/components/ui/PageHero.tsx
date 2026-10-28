import Kicker from '@/components/ui/Kicker';
import SanityPhoto from '@/components/ui/SanityPhoto';
import SkyVisual from '@/components/ui/SkyVisual';
import type { SanityImage } from '@/lib/sanity/types';

interface PageHeroProps {
  kicker: string;
  title: string;
  /** Which sky gradient to draw when there is no photo. */
  variant?: number;
  image?: SanityImage;
}

export default function PageHero({ kicker, title, variant = 0, image }: PageHeroProps) {
  return (
    <div className="relative h-[52vh] min-h-[300px] overflow-hidden">
      {image?.asset ? (
        <SanityPhoto image={image} className="absolute! inset-0" priority />
      ) : (
        <SkyVisual variant={variant} />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-sky-950/55 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-12 sm:px-6 md:px-8">
        <Kicker light>{kicker}</Kicker>
        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">{title}</h1>
      </div>
    </div>
  );
}
