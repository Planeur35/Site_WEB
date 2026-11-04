import clsx from 'clsx';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

/** The page's content width: 1280 px, with 20 px gutters on a phone. */
export default function Container({ className, children }: ContainerProps) {
  return <div className={clsx('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10', className)}>{children}</div>;
}
