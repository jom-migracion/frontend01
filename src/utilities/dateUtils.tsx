import { startOfDay, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parse, isValid } from 'date-fns';

export const normalizeDate = (date: string | Date | null | undefined): string | null => {
  if (!date) return null;
  let parsedDate: Date;
  if (typeof date === 'string') {
    parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDate)) return null;
  } else if (date instanceof Date && isValid(date)) {
    parsedDate = date;
  } else {
    return null;
  }

  return format(startOfDay(parsedDate), 'yyyy-MM-dd');
};

export const formatDate = (date: string | Date | null | undefined, forDisplay: boolean = false) => {
  if (!date) return '';
  let parsedDate: Date;
  if (typeof date === 'string') {
    parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDate)) return '';
  } else if (date instanceof Date && isValid(date)) {
    parsedDate = date;
  } else {
    return '';
  }
  if (forDisplay) {
    return format(parsedDate, 'dd MMM yyyy', { locale: es });
  }

  return format(parsedDate, 'yyyy-MM-dd');
};
