import { getTranslations } from 'next-intl/server';
import { formatDayNumber, formatMonthShort, formatTime, formatWeekday } from '@/lib/format';
import { localize } from '@/lib/sanity/localize';
import type { ClubEvent } from '@/lib/sanity/types';

interface AgendaItemProps {
  event: ClubEvent;
  locale: string;
}

/** One upcoming event: a date tile, then the title, day, time and place. */
export default async function AgendaItem({ event, locale }: AgendaItemProps) {
  const t = await getTranslations('news');
  const day = formatDayNumber(event.startDate, locale);
  const month = formatMonthShort(event.startDate, locale);
  const endDay = event.endDate ? formatDayNumber(event.endDate, locale) : undefined;
  const endMonth = event.endDate ? formatMonthShort(event.endDate, locale) : undefined;
  // Several days: "3–7", with both months when it spans two ("avr.–mai")
  const multiDay = endDay !== undefined && (endDay !== day || endMonth !== month);
  const time = formatTime(event.startDate, locale);
  const description = localize(event.description, locale);

  return (
    <li className="grid grid-cols-[72px_1fr] gap-[18px] rounded-md bg-ciel p-[18px]">
      <time
        dateTime={event.startDate}
        className="flex size-[72px] flex-col items-center justify-center rounded-sm bg-blanc text-center"
      >
        <span className={`font-display leading-none font-semibold text-azur tabular-nums ${multiDay ? 'text-[1.375rem]' : 'text-[1.875rem]'}`}>
          {multiDay ? `${day}–${endDay}` : day}
        </span>
        <span className="mt-1 text-[0.8125rem] font-semibold text-balise">
          {multiDay && endMonth !== month ? `${month}–${endMonth}` : month}
        </span>
      </time>
      <div className="min-w-0">
        <h3 className="font-display text-lg leading-snug font-semibold text-azur">{localize(event.title, locale)}</h3>
        <p className="mt-1 text-sm text-texte first-letter:uppercase">
          {formatWeekday(event.startDate, locale)}
          {time && ` · ${t('at', { time })}`}
          {event.location && ` · ${event.location}`}
        </p>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-brume">{description}</p>}
      </div>
    </li>
  );
}
