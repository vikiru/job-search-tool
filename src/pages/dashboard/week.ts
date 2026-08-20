import { endOfWeek, format, startOfWeek } from 'date-fns';

export function getCurrentWeekRange(date = new Date()) {
  return {
    weekEnd: format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    weekStart: format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  };
}
