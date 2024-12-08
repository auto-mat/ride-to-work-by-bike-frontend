// libraries
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { api, axios } from '../boot/axios';
import { i18n } from '../boot/i18n';
import { ApiBaseUrl } from '../components/enums/Api';
import { getApiBaseUrlWithLang } from '../utils/get_api_base_url_with_lang';

// utils
import { requestDefaultHeader } from '../utils';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';
const { apiDefaultLang, apiBase, apiBaseFeed } = rideToWorkByBikeConfig;

// types
import type { AxiosRequestHeaders, Method } from 'axios';
import type { Logger } from '../components/types/Logger';

interface ApiResponse<T> {
  data: T | null;
  success: boolean;
}

interface apiData {
  url: string;
  method: Method;
  headers: AxiosRequestHeaders;
  data?: object;
}

interface errorResponseData {
  [non_field_errors: string]: string[];
}
interface errorResponse {
  data: errorResponseData;
}

const getResponseDataErrorMessage = (error: AxiosError): string | void => {
  return hasErrorReponse(error);
};

const hasErrorReponse = (error: AxiosError): string | void => {
  if (error.hasOwnProperty('response'))
    return hasReponseData(error?.response as errorResponse);
};

const hasReponseData = (response: errorResponse): string | void => {
  if (response.hasOwnProperty('data'))
    return hasReponseDataNonFieldsErrorsKey({ data: response?.data });
};

const hasReponseDataNonFieldsErrorsKey = ({
  data,
  nonFieldErrors = 'non_field_errors',
}: {
  data: errorResponseData;
  nonFieldErrors?: string;
}): string | void => {
  if (data.hasOwnProperty(nonFieldErrors)) return data[nonFieldErrors][0];
};

/*
 * Select Axios base API URL based on the variant
 * @param {ApiBaseUrl} variant - Base URL variant
 * @param {(Logger|null)} logger - Logger instance
 * @returns {string} - Axios base API URL
 */
const getAxiosBaseApiUrl = (
  variant: ApiBaseUrl,
  logger: Logger | null,
): string => {
  logger?.debug(`Get Axios base API URL with variant <${variant}>.`);
  switch (variant) {
    case ApiBaseUrl.rest:
      logger?.debug(`Use endpoint <${apiBase}>.`);
      return `${apiBase}`;
    case ApiBaseUrl.feed:
      logger?.debug(`Use endpoint <${apiBaseFeed}>.`);
      return `${apiBaseFeed}`;
    default:
      logger?.debug(
        `Defaulting to <${ApiBaseUrl.rest}> variant in getAxiosBaseApiUrl().`,
      );
      return `${apiBase}`;
  }
};

/*
 * Inject Axios base API URL with lang (internationalization)
 * @param {string} baseUrl - Axios base API URL
 * @param {(Logger|null)} logger - Logger instance
 * @returns {void}
 */
const injectAxioBaseApiUrlWithLang = (
  baseUrl: string,
  logger: Logger | null,
): void => {
  logger?.debug(
    `Injected base API URL <${baseUrl}> with language <${i18n.global.locale}>.`,
  );
  api.defaults.baseURL = getApiBaseUrlWithLang(
    logger,
    baseUrl,
    apiDefaultLang,
    i18n,
  );
};

export const useApi = (variant: ApiBaseUrl = ApiBaseUrl.rest) => {
  const apiFetch = async <T>({
    endpoint,
    payload,
    translationKey,
    method = 'get',
    headers = requestDefaultHeader(),
    logger,
    showSuccessMessage = true,
  }: {
    endpoint: string;
    payload?: object;
    translationKey: string;
    method: Method;
    headers?: AxiosRequestHeaders;
    logger: Logger | null;
    showSuccessMessage?: boolean;
  }): Promise<ApiResponse<T>> => {
    try {
      logger?.info('Call <api()> function with parameters arguments.');
      logger?.debug(`<api()> function url parameter argument <${endpoint}>.`);
      logger?.debug(`<api()> function method parameter argument <${method}>.`);
      logger?.debug(
        `<api()> function data parameter argument <${JSON.stringify(payload)}>.`,
      );
      logger?.debug(
        `<api()> function headers parameter argument <${JSON.stringify(headers)}>.`,
      );
      // Inject Axios base API URL with lang (internationalization)
      const baseUrl = getAxiosBaseApiUrl(variant, logger);
      logger?.debug(`Base API URL <${baseUrl}>.`);
      injectAxioBaseApiUrlWithLang(baseUrl, logger);
      const startTime = performance.now();
      const data: apiData = {
        url: endpoint,
        method: method,
        headers: headers,
      };
      if (payload) {
        data.data = payload;
      }
      const response = await api<T>(data);
      const endTime = performance.now();
      logger?.info(
        `Call to <api()> function took ${(endTime - startTime) / 1000} seconds.`,
      );
      logger?.debug(`Response status HTTP code <${response.status}>.`);
      logger?.debug(
        `Response data <${response.data ? JSON.stringify(response.data, null, 2) : null}>.`,
      );

      if (response.status >= 200 && response.status < 300) {
        if (showSuccessMessage) {
          Notify.create({
            message: i18n.global.t(`${translationKey}.apiMessageSuccess`),
            color: 'positive',
          });
        }
        // Check if response data is undefined or null, indicating no body
        return {
          data: response.data !== undefined ? response.data : null,
          success: true,
        };
      } else {
        Notify.create({
          message: i18n.global.t(`${translationKey}.apiMessageError`),
          color: 'negative',
        });
        return { data: null, success: false };
      }
    } catch (error) {
      logger?.error(`Call to <api()> function raise error <${error}>.`);
      if (axios.isAxiosError(error)) {
        let errorMessage = error.message;
        if (error.response?.data)
          errorMessage += `. ${Object.values(error.response?.data).join('. ')}`;
        const apiErrorMessage = getResponseDataErrorMessage(error);
        if (apiErrorMessage) errorMessage += `. ${apiErrorMessage}`;
        Notify.create({
          message: i18n.global.t(
            `${translationKey}.apiMessageErrorWithMessage`,
            { error: errorMessage },
          ),
          color: 'negative',
        });
      } else {
        Notify.create({
          message: i18n.global.t(`${translationKey}.apiMessageError`),
          color: 'negative',
        });
      }
      return { data: null, success: false };
    }
  };

  return { apiFetch };
};
