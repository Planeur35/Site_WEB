import Kicker from '@/components/ui/Kicker';

interface SectionProps {
  id?: string;
  kicker?: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}

export default function Section({ id, kicker, title, sub, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16 sm:px-6 md:px-8 md:py-24">
      <div>
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2 className="font-serif text-3xl leading-[1.1] tracking-tight text-sky-950 md:text-[2.6rem]">{title}</h2>
        {sub && <p className="mt-4 max-w-xl leading-relaxed text-slate-600">{sub}</p>}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
