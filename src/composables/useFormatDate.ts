// libraries
import { date } from 'quasar';

// composables
import { i18n } from 'src/boot/i18n';

// enums
enum TimeState {
  INVALID = 'INVALID',
  NOW = 'NOW',
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  PAST7DAYS = 'PAST7DAYS',
  PAST = 'PAST',
}

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
    if (!date.isValid(dateString)) return '';
    const nowStamp = new Date();
    const timeStamp = new Date(dateString);
    const state: TimeState = getTimeState({ nowStamp, timeStamp });

    switch (state) {
      case TimeState.NOW:
        return i18n.global.t('time.lessThanAnHourAgo');
      case TimeState.TODAY:
        return labelToday({ nowStamp, timeStamp });
      case TimeState.YESTERDAY:
        return labelYesterday({ timeStamp });
      case TimeState.PAST7DAYS:
        return labelPast7Days({ timeStamp });
      case TimeState.PAST:
        return date.formatDate(timeStamp, 'D. MMM., HH:mm');
      default:
        return '';
    }
  };

  /**
   * Returns the "state" based on date comparison.
   */
  function getTimeState({
    nowStamp,
    timeStamp,
  }: {
    nowStamp: Date;
    timeStamp: Date;
  }): TimeState {
    let state = TimeState.PAST;
    state =
      date.getDateDiff(nowStamp, timeStamp, 'days') < 7
        ? TimeState.PAST7DAYS
        : state;
    state =
      date.getDateDiff(nowStamp, timeStamp, 'days') === 1
        ? TimeState.YESTERDAY
        : state;
    state = date.isSameDate(nowStamp, timeStamp, 'day')
      ? TimeState.TODAY
      : state;
    state =
      date.getDateDiff(nowStamp, timeStamp, 'hours') < 1
        ? TimeState.NOW
        : state;
    return state;
  }

  /**
   * Returns a "today" label with a label for passed time.
   */
  function labelToday({
    nowStamp,
    timeStamp,
  }: {
    nowStamp: Date;
    timeStamp: Date;
  }): string {
    const hours = date.getDateDiff(nowStamp, timeStamp, 'hours');
    return i18n.global.t('time.hoursAgo', { hours: hours });
  }

  /**
   * Returns a "yesterday" label with formatted time.
   */
  function labelYesterday({ timeStamp }: { timeStamp: Date }): string {
    return `${i18n.global.t('time.yesterday')}, ${date.formatDate(timeStamp, 'HH:mm')}`;
  }

  function labelPast7Days({ timeStamp }: { timeStamp: Date }): string {
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

  return {
    formatDateTimeLabel,
  };
};
