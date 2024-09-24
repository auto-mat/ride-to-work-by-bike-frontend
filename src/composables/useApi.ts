// libraries
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { api } from '../boot/axios';
import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';
const { apiVersion } = rideToWorkByBikeConfig;

// types
import type { AxiosRequestHeaders, Method } from 'axios';
import type { Logger } from '../components/types/Logger';

interface ApiResponse<T> {
  data: T | null;
}

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
    payload: unknown;
    translationKey: string;
    method: Method;
    headers?: AxiosRequestHeaders;
    logger: Logger | null;
    showSuccessMessage?: boolean;
  }): Promise<ApiResponse<T>> => {
    try {
      const response = await api<T>({
        url: endpoint,
        method: method,
        data: payload,
        headers,
      });

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
      if (logger) {
        logger.error(error as string);
      }
      if (error instanceof AxiosError || error instanceof Error) {
        Notify.create({
          message: i18n.global.t(
            `${translationKey}.apiMessageErrorWithMessage`,
            { error: error.message },
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
