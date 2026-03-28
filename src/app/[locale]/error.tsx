"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionContainer from "@/components/ui/SectionContainer";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  const tCommon = useTranslations("common");

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg">
      <SectionContainer className="text-center py-20">
        {/* Warning icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-primary/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-3xl md:text-4xl font-bold text-primary">
          {t("title")}
        </h1>

        {/* Description */}
        <p className="mt-4 text-lg text-muted max-w-md mx-auto">
          {t("description")}
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-2 text-sm text-muted/60 font-mono">
            {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" onClick={reset}>
            {t("tryAgain")}
          </Button>
          <Button variant="secondary" size="lg" href="/">
            {tCommon("backToHome")}
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
}
