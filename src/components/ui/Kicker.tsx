import clsx from 'clsx';

interface KickerProps {
  children: React.ReactNode;
  className?: string;
}

/** Orange eyebrow above a title, in sentence case. Le club passes "01", "02"… */
export default function Kicker({ children, className }: KickerProps) {
  return (
    <p className={clsx('mb-3 font-display text-[0.9375rem] font-semibold text-balise lg:text-base', className)}>
      {children}
    </p>
  );
}
