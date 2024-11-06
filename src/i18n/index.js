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
      let localeFileContent = await import(/* @vite-ignore */ localeFile);
      messages[locale] = localeFileContent.default;
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
  return dateTimeFormats;
};
