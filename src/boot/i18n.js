import { boot } from 'quasar/wrappers';

import { createI18n } from 'vue-i18n';

import {
  csSkPluralizationRule,
  getDateTimeFormats,
  getNumberFormats,
  loadLocaleMessages,
} from '../i18n';
import { defaultLocale, fallbackLocale } from 'src/i18n/def_locale';

const messages = await loadLocaleMessages();
const datetimeFormats = getDateTimeFormats(Object.keys(messages));
const numberFormats = getNumberFormats(Object.keys(messages));

// Create I18n instance
export const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: fallbackLocale,
  globalInjection: true,
  messages: messages,
  datetimeFormats,
  numberFormats,
  pluralizationRules: {
    cs: csSkPluralizationRule,
    sk: csSkPluralizationRule,
  },
});

export default boot(({ app }) => {
  // Tell app to use the I18n instance
  app.use(i18n);
});
