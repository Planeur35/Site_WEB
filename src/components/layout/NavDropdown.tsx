"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/components/layout/navItems";

/** Delay before a hover opens or closes the panel, so a passing pointer does nothing. */
const HOVER_INTENT_MS = 120;

interface NavDropdownProps {
  item: NavItem;
  /** `page` on the page itself, `true` on one of its sub-pages. */
  current?: "page" | "true";
  /** Show each row's position (the club page sections). */
  numbered?: boolean;
}

/**
 * A top-bar entry with a drop-down: the label links to the page, the chevron
 * button toggles the panel. The panel also opens on hover and on keyboard focus.
 */
export default function NavDropdown({ item, current, numbered = false }: NavDropdownProps) {
  const t = useTranslations("nav");
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Set when Escape sends focus back to the button, so that focus does not reopen the panel
  const ignoreNextFocus = useRef(false);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const hoverTo = (next: boolean) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(next), HOVER_INTENT_MS);
  };

  const rows = () => Array.from(wrapperRef.current?.querySelectorAll<HTMLAnchorElement>("[data-nav-row]") ?? []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      ignoreNextFocus.current = true;
      buttonRef.current?.focus();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const list = rows();
    const index = list.indexOf(document.activeElement as HTMLAnchorElement);
    if (index === -1) {
      // From the label or the button: open, then go to the first or last row
      const focusEnd = () => (e.key === "ArrowDown" ? rows()[0] : rows().at(-1))?.focus();
      if (open) focusEnd();
      else {
        // Rows are not focusable until the panel is visible
        setOpen(true);
        requestAnimationFrame(focusEnd);
      }
      return;
    }
    const next = index + (e.key === "ArrowDown" ? 1 : -1);
    if (next < 0) buttonRef.current?.focus();
    else list[Math.min(next, list.length - 1)].focus();
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center"
      onPointerEnter={(e) => e.pointerType === "mouse" && hoverTo(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && hoverTo(false)}
      onFocus={(e) => {
        if (ignoreNextFocus.current) {
          ignoreNextFocus.current = false;
          return;
        }
        // Keyboard focus only: a mouse click on the button already toggles it
        if (e.target.matches(":focus-visible")) setOpen(true);
      }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={onKeyDown}
    >
      <Link
        href={item.href}
        aria-current={current}
        className={clsx(
          "inline-flex h-11 items-center rounded-sm pl-3.5 text-base whitespace-nowrap decoration-balise decoration-2 underline-offset-[10px] transition-colors duration-150",
          current ? "font-semibold text-azur underline" : "font-medium text-nuit hover:text-azur",
        )}
      >
        {t(item.key)}
      </Link>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("submenu", { label: t(item.key) })}
        onClick={() => {
          clearTimeout(hoverTimer.current);
          setOpen((was) => !was);
        }}
        className="inline-flex h-11 w-8 cursor-pointer items-center justify-center rounded-sm text-nuit hover:text-azur"
      >
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={clsx("transition-transform duration-150 ease-planeur", open && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        className={clsx(
          "absolute top-full left-0 z-50 pt-2 transition duration-150 ease-planeur",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <ul className="flex w-[420px] flex-col rounded-md bg-blanc p-3 shadow-flottant">
          {item.children?.map((child, i) => (
            <li key={child.key}>
              <Link
                href={child.href}
                data-nav-row
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center justify-between rounded-sm px-3 text-[0.9375rem] text-nuit transition-colors duration-150 hover:bg-ciel hover:text-azur focus-visible:bg-ciel"
              >
                {t(child.key)}
                {numbered && (
                  <span className="text-[0.8125rem] text-brume" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
