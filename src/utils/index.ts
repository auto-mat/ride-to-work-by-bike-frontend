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

const requestDefaultHeader = (): AxiosRequestHeaders => {
  return {
    Accept: `application/json; version=${getAppConfig().apiVersion}`,
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
 *
 * @return {string}: RGBA string e.g. rgba(255, 255, 255, 0.2)
 */
const rgbaColorObjectToString = (rgba: RgbaI): string => {
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

export {
  calculateCountdownIntervals,
  bearerTokeAuth,
  deepObjectWithSimplePropsCopy,
  requestDefaultHeader,
  requestTokenHeader,
  rgbaColorObjectToString,
  timestampToDatetimeString,
};
