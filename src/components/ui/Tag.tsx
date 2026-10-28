interface TagProps {
  children: React.ReactNode;
}

export default function Tag({ children }: TagProps) {
  return (
    <span className="border border-sky-500/40 px-2 py-0.5 text-xs uppercase tracking-[0.15em] text-sky-900">
      {children}
    </span>
  );
}
