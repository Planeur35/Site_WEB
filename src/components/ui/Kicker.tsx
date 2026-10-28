import clsx from 'clsx';

interface KickerProps {
  children: React.ReactNode;
  light?: boolean;
}

/** Small spaced capitals above a title. */
export default function Kicker({ children, light = false }: KickerProps) {
  return (
    <p
      className={clsx(
        'mb-3 text-xs font-medium uppercase tracking-[0.3em]',
        light ? 'text-white/85' : 'text-sky-800',
      )}
    >
      {children}
    </p>
  );
}
