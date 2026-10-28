// Dates are shown in the club's time zone, whatever the server's.
const TIME_ZONE = 'Europe/Paris';

const intlLocale = (locale: string) => (locale === 'en' ? 'en-GB' : 'fr-FR');

const format = (iso: string, locale: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(intlLocale(locale), { timeZone: TIME_ZONE, ...options }).format(new Date(iso));

export const formatDate = (iso: string, locale: string) => format(iso, locale, { dateStyle: 'long' });
export const formatMonthYear = (iso: string, locale: string) => format(iso, locale, { month: 'long', year: 'numeric' });
export const formatDayNumber = (iso: string, locale: string) => format(iso, locale, { day: 'numeric' });
export const formatMonthShort = (iso: string, locale: string) => format(iso, locale, { month: 'short' });
export const formatWeekday = (iso: string, locale: string) => format(iso, locale, { weekday: 'long' });

/** "14:30", or an empty string for an event without a time (midnight). */
export function formatTime(iso: string, locale: string): string {
  const time = format(iso, locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  return time === '00:00' ? '' : time;
}

/** Start of today in UTC, for "upcoming events" queries. */
export function startOfToday(): string {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
}
