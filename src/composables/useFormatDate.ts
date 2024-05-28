// libraries
import { date } from 'quasar';

// composables
import { i18n } from 'src/boot/i18n';

export const useFormatDate = () => {
  /**
   * Returns a label for a given date relative to the current date.
   *
   * It only accepts past dates. Returns empty string for future dates.
   * If given date is the same as today, the label will show
   * "X hours ago".
   * If given date is within 7 days of the current date, the label will show
   * "Yesterday", or the name of the day of the week and time.
   * Otherwise, the label will show the date in the format "D. MMM". and time.
   *
   * Used for forum post list.
   *
   * @param dateString - The date string to be formatted
   * @return The formatted date name
   */
  const formatDateTimeLabel = (dateString: string): string => {
    const timeStamp = new Date(dateString);
    const nowStamp = new Date();

    if (!date.isValid(dateString)) {
      return '';
    }
    const isPast = timeStamp.getTime() < nowStamp.getTime();
    if (!isPast) {
      return '';
    }

    // today
    if (date.isSameDate(timeStamp, nowStamp, 'day')) {
      const hours = date.getDateDiff(nowStamp, timeStamp, 'hours');
      return i18n.global.t('time.hoursAgo', { hours: hours });
    }

    // past 7 days
    if (date.getDateDiff(nowStamp, timeStamp, 'days') < 7) {
      // see https://quasar.dev/quasar-utils/date-utils#format-for-display
      return date.formatDate(timeStamp, 'dddd, HH:mm', {
        days: [
          i18n.global.t('time.monday'),
          i18n.global.t('time.tuesday'),
          i18n.global.t('time.wednesday'),
          i18n.global.t('time.thursday'),
          i18n.global.t('time.friday'),
          i18n.global.t('time.saturday'),
          i18n.global.t('time.sunday'),
        ],
      });
    }

    return date.formatDate(timeStamp, 'D. MMM. HH:mm');
  };

  return {
    formatDateTimeLabel,
  };
};
