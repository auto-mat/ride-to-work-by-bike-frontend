// types
import type { AxiosRequestHeaders } from 'axios';
import { ConfigGlobal } from '../components/types';
import type { Countdown } from '../components/types/Countdown';

/**
 * Get global app config as lazy function allow to use
 * this TS module inside Cypress e2e tests, where global
 * app config is available via Cypress task('getAppConfig')
 * command.
 */
const getAppConfig = (): ConfigGlobal => {
  return JSON.parse(process.env.RIDE_TO_WORK_BY_BIKE_CONFIG) as ConfigGlobal;
};

interface RgbaI {
  r: number;
  g: number;
  b: number;
  a: number;
}

/*
 * Convert date time timestamp number to formated
 * date time string.
 *
 *
 * @param {number} timestamp - Number of seconds elapsed
 *                             since the epoch (midnight at the
 *                             beginning of January 1, 1970, UTC)
 * @returns {string} formatedDateTime - Formated date time string
 */
const timestampToDatetimeString = (timestamp: number): string => {
  const dateTime = new Date(timestamp * 1000);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const year = dateTime.getFullYear();
  const month = months[dateTime.getMonth()];
  const date = dateTime.getDate();
  const hour = dateTime.getHours();
  const min = dateTime.getMinutes();
  const sec = dateTime.getSeconds();
  const formatedDateTime =
    date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return formatedDateTime;
};

const bearerTokeAuth = 'Bearer';

const requestDefaultHeader = (version: string): AxiosRequestHeaders => {
  if (!version) version = getAppConfig().apiDefaultVersion;
  return {
    Accept: `application/json; version=${version}`,
  } as AxiosRequestHeaders;
};

const requestTokenHeader = {
  Authorization: `${bearerTokeAuth} `,
} as AxiosRequestHeaders;

/*
 * Convert RGBA color object definition returned from
 * hexToRgb() function to string representation
 * e.g. rgba(255, 255, 255, 0.2)
 *
 * @param {rgbai} rgba: RGBA object returned from hexToRgb() function
 * @param {boolean} getRgb: if true return RGB string intead of RGBA
 *
 * @return {string}: RGBA string e.g. rgba(255, 255, 255, 0.2)
 *                   RGB string e.g. rgba(255, 255, 255) accroding
 *                   usage of `getRgb` param val
 */
const rgbaColorObjectToString = (rgba: RgbaI, getRgb: boolean): string => {
  if (getRgb) return `rgb(${rgba['r']}, ${rgba['g']}, ${rgba['b']})`;
  return `rgba(${rgba['r']}, ${rgba['g']}, ${rgba['b']}, ${rgba['a'] / 100.0})`;
};

/*
 * Deep copy Object with simple props (not function)
 *
 * @param {Object} obj: Object to copy
 *
 * @returns {Object}: Object copy
 */
const deepObjectWithSimplePropsCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Calculate the countdown intervals
 * Returns the countdown object with days, hours, minutes and seconds
 * @param {number} timeDifferenceMs - Time difference in milliseconds
 * @returns {Countdown} - Countdown object
 */
const calculateCountdownIntervals = (timeDifferenceMs: number): Countdown => {
  // convert time difference to seconds
  const totalSeconds = Math.floor(timeDifferenceMs / 1000);
  // calculate each unit
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

// Custom form field validation error CSS class
const formFieldCustomValidationErrCssClass = 'form-field-validation-err';

/**
 * Get current date time according defined timezone
 *
 * https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 *
 * @param {Number} yourTimezoneOffset - Your time zone offset in minutes,
 *                                      with default Europe/Prague timezone
 *                                      DST offset 120 minutes value
 * @returns {Date} - Current date time according defined timezone
 */
function getCurrentDateTimeAccordingTimezone(
  yourTimezoneOffset: number = 120,
): Date {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset();
  return new Date(date.getTime() + (yourTimezoneOffset + timezoneOffset));
}

export {
  calculateCountdownIntervals,
  bearerTokeAuth,
  deepObjectWithSimplePropsCopy,
  getCurrentDateTimeAccordingTimezone,
  formFieldCustomValidationErrCssClass,
  requestDefaultHeader,
  requestTokenHeader,
  rgbaColorObjectToString,
  timestampToDatetimeString,
};
