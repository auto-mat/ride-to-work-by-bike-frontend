// types
import type { AxiosRequestHeaders } from 'axios';
import { ConfigGlobal } from '../components/types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);

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

export { requestDefaultHeader, requestTokenHeader, timestampToDatetimeString };
