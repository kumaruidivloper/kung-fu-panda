import { MONTH, DATE_MONTH_FORMAT, TODAY, TOMORROW } from './constants';
/**
 * Format a date in MM DD, YYYY format
 * @param {string} dateTime, takes date in YYYY-MM-DDTHH:MM:SSZ format
 * @param {string} format, takes format input
 * @returns {string}, date in MM DD, YYYY format
 */
export function dateFormatter(dateTime, format = DATE_MONTH_FORMAT) {
  if (dateTime) {
    const date = new Date(dateTime.length <= 11 ? `${dateTime}T12:00:00Z` : dateTime);
    if (format === DATE_MONTH_FORMAT) {
      return `${MONTH[date.getMonth()]} ${date.getDate()}`;
    }
    return `${MONTH[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  return null;
}

/**
 * Method to find the input date is today or tomorrow
 * @param {string} date date
 * @returns {string}, today or tomorrow or date in MM DD, YYYY format
 */
export function pickupDayInfo(date) {
  if (!date) {
    return 'NA';
  }

  const pickupDate = new Date(date);
  if (new Date().getDate() === pickupDate.getDate()) {
    return TODAY;
  }

  const tomorrowDate = new Date(date + 24 * 60 * 60 * 1000); //eslint-disable-line
  if (pickupDate.getDate() === tomorrowDate.getDate()) {
    return TOMORROW;
  }

  return dateFormatter(date, DATE_MONTH_FORMAT);
}

/**
 * Method will return the date by the number days count
 * @param {*} date
 * @param {*} daysCount
 */
export function getDateByNumber(date, daysCount) {
  if (!date) {
    return '';
  }
  const nexDate = new Date(date);
  const newDate = new Date(nexDate.setTime(nexDate.getTime() + daysCount * 86400000)); //eslint-disable-line
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
  const dateEx = newDate.getDate();
  const lastDate = MONTH[month]
    .concat(' ')
    .concat(dateEx)
    .concat(', ')
    .concat(year);
  return lastDate;
}

/**
 * Method will return true if passed in string is a date.
 * @param {string} date
 */
const isDateString = val => typeof val === 'string' && new Date(val) instanceof Date && !Number.isNaN(new Date(val).valueOf());

/**
 * Method will return true if passed in value is a date.
 * @param {string|Date} date
 */
export const isDate = val => (val instanceof Date && !Number.isNaN(val.valueOf())) || isDateString(val);
