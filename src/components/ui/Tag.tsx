interface TagProps {
  children: React.ReactNode;
}

export default function Tag({ children }: TagProps) {
  return <span className="rounded-xs bg-horizon px-2 py-[3px] text-sm font-medium text-azur">{children}</span>;
}
