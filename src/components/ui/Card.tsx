import clsx from "clsx";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface CardProps {
  image?: string;
  imageAlt?: string;
  title: string;
  description?: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Card({
  image,
  imageAlt,
  title,
  description,
  href,
  children,
  className,
}: CardProps) {
  const content = (
    <>
      {image && (
        <div className="relative aspect-video bg-gray-100">
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-primary">{title}</h3>
        {description && (
          <p className="text-muted text-sm mt-2">{description}</p>
        )}
        {children}
      </div>
    </>
  );

  const wrapperClasses = clsx(
    "rounded-xl overflow-hidden bg-white shadow-sm border border-border",
    "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    className
  );

  if (href) {
    return (
      <Link href={href as never} className={clsx(wrapperClasses, "block cursor-pointer")}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClasses}>{content}</div>;
}
