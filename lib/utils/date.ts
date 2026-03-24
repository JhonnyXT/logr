import {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  differenceInDays,
  isToday,
  isSameDay,
  startOfWeek,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

export {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  differenceInDays,
  isToday,
  isSameDay,
  startOfWeek,
  parseISO,
};

export function formatDate(date: Date | string, pattern = "PP"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: es });
}

export function getYearDays(year: number): Date[] {
  return eachDayOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1)),
  });
}

export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
