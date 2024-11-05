import { boot } from 'quasar/wrappers';

import { createI18n } from 'vue-i18n';

import { datetimeFormats } from '../utils/datetime_formats';

import { loadLocaleMessages } from '../i18n';
import { defaultLocale, fallbackLocale } from 'src/i18n/def_locale';

// Create I18n instance
export const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: fallbackLocale,
  globalInjection: true,
  messages: loadLocaleMessages(),
  datetimeFormats,
});

export default boot(({ app }) => {
  // Tell app to use the I18n instance
  app.use(i18n);
});
