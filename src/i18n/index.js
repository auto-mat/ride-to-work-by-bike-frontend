import { rideToWorkByBikeConfig } from '../boot/global_vars';

export const loadLocaleMessages = async () => {
  const localesFiles = await import.meta.glob('./[A-Za-z0-9-_,s]+.toml', {
    eager: true,
  });
  let messages = {};
  for (const localeFile of Object.keys(localesFiles)) {
    const matched = localeFile.match(/([a-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      // Dynamic import TOML translation file content
      await localesFiles[localeFile]().then((content) => {
        messages[locale] = content.default;
      });
    }
  }
  return messages;
};

/*
 * Set same date time formats config (readed from global app TOML
 * config file) for all available locales
 *
 * @params {array} locales: available locales array
 *                          according locales TOML files
 *                          names inside ./src/i18n/*.toml dir
 *
 * @returns {Object} dateTimeFormats: date time formats config
 *                                    for every available locales
 */
export const getDateTimeFormats = (locales) => {
  let dateTimeFormats = {};

  const dateTimeFormatsAllLocales = JSON.parse(
    rideToWorkByBikeConfig.dateTimeFormatsAllLocales,
  );
  locales.forEach((locale) => {
    dateTimeFormats[locale] = dateTimeFormatsAllLocales;
  });
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `Set date time formats for available locales <${locales.join(', ')}>.`,
    );
    console.log(
      `Date time formats <${JSON.stringify(dateTimeFormats, null, 2)}>.`,
    );
  }
  return dateTimeFormats;
};

/*
 * Set same number formats config (readed from global app TOML
 * config file) for all available locales
 *
 * @params {array} locales: available locales array
 *                          according locales TOML files
 *                          names inside ./src/i18n/*.toml dir
 *
 * @returns {Object} numberFormats: number formats config
 *                                  for every available locales
 */
export const getNumberFormats = (locales) => {
  let numberFormats = {};

  const numberFormatsAllLocales = JSON.parse(
    rideToWorkByBikeConfig.numberFormatsAllLocales,
  );
  locales.forEach((locale) => {
    numberFormats[locale] = numberFormatsAllLocales;
  });
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `Set number formats for available locales <${locales.join(', ')}>.`,
    );
    console.log(`Number formats <${JSON.stringify(numberFormats, null, 2)}>.`);
  }
  return numberFormats;
};

/**
 * Custom Vue.js i18n pluralization rule for Czech, Slovak language
 *
 * @param {number} choice - Choice
 * @param {number} choicesLength - Choice length
 * @param {callback} orgRule - Rule callback function
 * @returns {number} - Index
 */
export const pluralizationRuleCsSkLang = (choice, choicesLength, orgRule) => {
  // only change pluralization if more than 2 choices are available
  if (choicesLength > 2) {
    if (choice === 0) {
      return 0;
    } else if (choice === 1) {
      return 1;
    } else if (choice > 1 && choice < 5) {
      return 2;
    }
    return 3;
  }
  const defaultIndex = orgRule(choice);
  // ensure that index is within the bounds of the choicesLength parameter
  return defaultIndex >= 0 && defaultIndex < choicesLength ? defaultIndex : 0;
};
