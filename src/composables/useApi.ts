// libraries
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { api, axios } from '../boot/axios';
import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';
const { apiVersion, apiDefaultLang, apiBase } = rideToWorkByBikeConfig;

// types
import type { AxiosRequestHeaders, Method } from 'axios';
import type { Logger } from '../components/types/Logger';

interface ApiResponse<T> {
  data: T | null;
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
 * Inject Axios base API URL with lang (internationalization)
 * @param {(Logger|null)} logger - Logger instance
 * @returns {void}
 */
const injectAxioBaseApiUrlWithLang = (logger: Logger | null): void => {
  api.defaults.baseURL = getApiBaseUrlWithLang(logger, apiBase, apiDefaultLang);
};

/*
 * Localization REST API with injecting
 * API base URL with lang different from the
 * default lang (cs) and sk lang
 *
 * Example:
 *
 * https://test.dopracenakole.cz/en/rest/
 *
 * And reset back injected API base URL for default cs lang and sk lang.
 *
 * https://test.dopracenakole.cz/rest/
 *
 * @param {(Logger | null)} logger - Logger instance
 * @param {string} apiBase - API base URL
 * @param {string} apiDefaultLang - API default language
 * @returns {string} - API base URL with language (internationalization)
 */
export const getApiBaseUrlWithLang = (
  logger: Logger | null,
  apiBase: string,
  apiDefaultLang: string,
): string => {
  // Use same API default cs lang for sk lang
  if (![apiDefaultLang, 'sk'].includes(i18n.global.locale)) {
    logger?.info(
      'Inject Axios base API URL with language (internationalization).',
    );
    const apiBaseUrl = new URL(apiBase);
    logger?.debug(`Available locales <${i18n.global.availableLocales}>.`);
    logger?.debug(
      `Injected base API URL <${api.defaults.baseURL}> with language <${i18n.global.locale}>.`,
    );
    return `${apiBaseUrl.origin}/${i18n.global.locale}${apiBaseUrl.pathname}`;
  } else {
    logger?.debug(
      `Reset injected base API URL <${api.defaults.baseURL}> to default language <${apiDefaultLang}>.`,
    );
    return apiBase;
  }
};

export const useApi = () => {
  const apiFetch = async <T>({
    endpoint,
    payload,
    translationKey,
    method = 'get',
    headers = {
      Accept: `application/json; version=${apiVersion}`,
    } as AxiosRequestHeaders,
    logger,
    showSuccessMessage = true,
  }: {
    endpoint: string;
    payload: object;
    translationKey: string;
    method: Method;
    headers?: AxiosRequestHeaders;
    logger: Logger | null;
    showSuccessMessage?: boolean;
  }): Promise<ApiResponse<T>> => {
    try {
      logger?.debug('Call <api()> function with parmeters arguments.');
      logger?.debug(`<api()> function url parameter argument <${endpoint}>.`);
      logger?.debug(`<api()> function method parameter argument <${method}>.`);
      logger?.debug(
        `<api()> function data parameter argument <${JSON.stringify(payload)}>.`,
      );
      logger?.debug(
        `<api()> function headers parameter argument <${JSON.stringify(headers)}>.`,
      );
      // Inject Axios base API URL with lang (internationalization)
      injectAxioBaseApiUrlWithLang(logger);
      const startTime = performance.now();
      const response = await api<T>({
        url: endpoint,
        method: method,
        data: payload,
        headers,
      });
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
        return { data: response.data };
      } else {
        Notify.create({
          message: i18n.global.t(`${translationKey}.apiMessageError`),
          color: 'negative',
        });
        return { data: null };
      }
    } catch (error) {
      logger?.error(`Call to <api()> function raise error <${error}>.`);
      if (axios.isAxiosError(error)) {
        let errorMessage = error.message;
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
      return { data: null };
    }
  };

  return { apiFetch };
};
