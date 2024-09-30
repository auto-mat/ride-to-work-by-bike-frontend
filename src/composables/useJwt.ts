// libraries
import { Notify } from 'quasar';

// composables
import { i18n } from '../boot/i18n';

// types
interface JwtParts {
  header: string;
  payload: string;
  signature: string;
}

export const useJwt = () => {
  /**
   * Get JWT expiration time
   * @param {string} token - JWT token
   * @return {number | null} Expiration time in seconds or null if invalid
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
      return expirationTime as number;
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
   * Parse JWT token into parts
   * @param {string} token - JWT token string
   * @return {JwtParts} Object (header, payload, signature) - token parts
   * @throws {Error} If the token format is invalid
   */
  const parseJwt = (token: string): JwtParts => {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error(i18n.global.t('refreshTokens.messageJwtInvalidFormat'));
    }
    return {
      header: parts[0],
      payload: parts[1],
      signature: parts[2],
    };
  };

  /**
   * Decode JWT payload
   * @param {string} payload - Base64Url encoded JWT payload
   * @return {Record<string, unknown>} Decoded payload as a JavaScript object
   */
  const decodePayload = (payload: string): Record<string, unknown> => {
    const jsonPayload = base64UrlDecode(payload);
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  };

  /**
   * Decode a Base64Url encoded string
   * @param {string} str - Base64Url encoded string
   * @return {string} Decoded string
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
