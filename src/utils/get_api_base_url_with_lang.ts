import type { Composer, I18n } from 'vue-i18n';
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
  i18n: I18n | string,
): string => {
  if (typeof i18n !== 'string') {
    // correctly type the global i18n object
    const globalI18n = i18n.global as unknown as Composer;
    // Use same API default cs lang for sk lang
    if (![apiDefaultLang, 'sk'].includes(globalI18n.locale.value)) {
      logger?.info(
        'Inject Axios base API URL with language (internationalization).',
      );
      const apiBaseUrl = new URL(apiBase);
      logger?.debug(`Available locales <${globalI18n.availableLocales}>.`);
      logger?.debug(
        `Injected base API URL with language <${globalI18n.locale.value}>.`,
      );
      return `${apiBaseUrl.origin}/${globalI18n.locale.value}${apiBaseUrl.pathname}`;
    } else {
      logger?.debug(
        `Reset injected base API URL to default language <${apiDefaultLang}>.`,
      );
      return apiBase;
    }
  } else {
    /**
     * Required for localization REST API URL during e2e tests for
     * intercepting API before visiting app URL page when i18n locale
     * instance is not available for getting current lang
     */
    if (![apiDefaultLang, 'sk'].includes(i18n as string)) {
      const apiBaseUrl = new URL(apiBase);
      return `${apiBaseUrl.origin}/${i18n}${apiBaseUrl.pathname}`;
    } else {
      return apiBase;
    }
  }
};
