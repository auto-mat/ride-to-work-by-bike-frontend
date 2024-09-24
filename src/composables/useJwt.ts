// libraries
import { Notify } from 'quasar';

// composables
import { i18n } from '../boot/i18n';

export const useJwt = () => {
  /**
   * Get JWT expiration
   * @param token - JWT token
   * @returns - Expiration time in seconds or null
   */
  const readJwtExpiration = (token: string): number | null => {
    try {
      const { payload } = parseJwt(token);
      const decodedPayload = decodePayload(payload);
      // extract the expiration time
      const expirationTime = decodedPayload.exp;
      if (!expirationTime) {
        Notify.create({
          message: i18n.global.t('refreshTokens.messageJwtInvalidExpiration'),
          color: 'negative',
        });
        return null;
      }

      return expirationTime;
    } catch (error) {
      if (error instanceof Error) {
        Notify.create({
          message: i18n.global.t('refreshTokens.messageJwtInvalidWithMessage', {
            error: error.message,
          }),
          color: 'negative',
        });
      } else {
        Notify.create({
          message: i18n.global.t('refreshTokens.messageJwtInvalid'),
          color: 'negative',
        });
      }
      return null;
    }
  };

  /**
   * Parse JWT token
   * @param token - JWT token
   * @returns - JWT parts (header, payload, signature)
   */
  const parseJwt = (token: string) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    return {
      header: parts[0],
      payload: parts[1],
      signature: parts[2],
    };
  };

  const decodePayload = (payload: string) => {
    const jsonPayload = base64UrlDecode(payload);

    return JSON.parse(jsonPayload);
  };

  /**
   * Base64 URL decode
   * @param str - Base64 URL encoded string
   * @returns - Decoded string
   */
  const base64UrlDecode = (str: string): string => {
    // replace URL-safe characters with Base64 standard characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // pad string with '=' characters to make the length a multiple of 4
    const padding = 4 - (base64.length % 4);
    if (padding !== 4) {
      base64 += '='.repeat(padding);
    }
    // decode Base64
    const decodedData = atob(base64);

    return decodedData;
  };

  return {
    readJwtExpiration,
    parseJwt,
    decodePayload,
    base64UrlDecode,
  };
};
