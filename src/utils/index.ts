// types
import type { AxiosRequestHeaders } from 'axios';
import { ConfigGlobal } from '../components/types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);

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

const requestDefaultHeader = {
  Accept: `application/json; version=${rideToWorkByBikeConfig.apiVersion}`,
} as AxiosRequestHeaders;

const requestTokenHeader = {
  Authorization: 'Bearer ',
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
const deepObjectWithSimplePropsCopy = (obj: object): object => {
  return JSON.parse(JSON.stringify(obj));
};

export {
  deepObjectWithSimplePropsCopy,
  requestDefaultHeader,
  requestTokenHeader,
  rgbaColorObjectToString,
  timestampToDatetimeString,
};
