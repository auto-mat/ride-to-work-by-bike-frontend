import type { I18n } from 'vue-i18n';
import type { Logger } from '../components/types/Logger';

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
  i18n: I18n,
): string => {
  // Use same API default cs lang for sk lang
  if (![apiDefaultLang, 'sk'].includes(i18n.global.locale as string)) {
    logger?.info(
      'Inject Axios base API URL with language (internationalization).',
    );
    const apiBaseUrl = new URL(apiBase);
    logger?.debug(`Available locales <${i18n.global.availableLocales}>.`);
    logger?.debug(
      `Injected base API URL with language <${i18n.global.locale}>.`,
    );
    return `${apiBaseUrl.origin}/${i18n.global.locale}${apiBaseUrl.pathname}`;
  } else {
    logger?.debug(
      `Reset injected base API URL to default language <${apiDefaultLang}>.`,
    );
    return apiBase;
  }
};
