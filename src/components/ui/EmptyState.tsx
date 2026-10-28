interface EmptyStateProps {
  children: React.ReactNode;
}

/** Shown while a section has no content in Sanity yet. */
export default function EmptyState({ children }: EmptyStateProps) {
  return <p className="border-l-2 border-sky-300 py-1 pl-4 text-slate-600">{children}</p>;
}
