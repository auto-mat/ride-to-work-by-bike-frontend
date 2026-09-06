// libraries
import { watch } from 'vue';

// utils
import { getApiBaseUrlWithLang } from '../../../src/utils/get_api_base_url_with_lang';

// types
import type { Ref } from 'vue';
import type { I18n } from 'vue-i18n';
import type { Config } from '../../../src/components/types/Config';

const whiteColor = 'rgb(255, 255, 255)';
const transparentColor = 'rgba(0, 0, 0, 0)';
const positiveColor = 'rgb(33, 186, 69)';
const negativeColor = 'rgb(193, 0, 21)';

const hexToRgb = (hex: string): string | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? 'rgb(' +
        `${parseInt(result[1], 16)},` +
        ` ${parseInt(result[2], 16)},` +
        ` ${parseInt(result[3], 16)})`
    : null;
};

/**
 * Adapts a Vue model to be used in Cypress tests.
 * @param modelRef - The Vue model reference.
 * @param modelName - The name of the model property.
 * @returns An object containing the model value and the onUpdate handler.
 * @see https://github.com/vuejs/test-utils/discussions/279
 */
function vModelAdapter<T>(modelRef: Ref<T>, modelName = 'modelValue') {
  watch(modelRef, (value) =>
    Cypress.vueWrapper?.setProps({ [modelName]: value }),
  );
  return {
    [modelName]: modelRef.value,
    [`onUpdate:${modelName}`]: (emittedValue: T) => {
      modelRef.value = emittedValue;
    },
  };
}

/**
 * Returns the selector for a radio option.
 * @param {String} val - The value of the radio option.
 * @returns {String} - The string selector for the radio option.
 */
const getRadioOption = (val: string): string => `radio-option-${val}`;

/**
 * Returns the localized photo API URL.
 * @param {Config} config - app config
 * @param {I18n | string} i18n - i18n instance or locale string
 * @returns {String} - localized photo API URL
 */
const getPhotoApiUrl = (config: Config, i18n: I18n | string): string => {
  const apiBaseUrl = getApiBaseUrlWithLang(
    null,
    config.apiBase,
    config.apiDefaultLang,
    i18n,
  );
  return `${apiBaseUrl}${config.urlApiPhoto}`;
};

/**
 * Returns the localized register challenge API URL.
 * @param {Config} config - app config
 * @param {I18n | string} i18n - i18n instance or locale string
 * @returns {String} - localized register challenge API URL
 */
const getRegisterChallengeApiUrl = (
  config: Config,
  i18n: I18n | string,
): string => {
  const apiBaseUrl = getApiBaseUrlWithLang(
    null,
    config.apiBase,
    config.apiDefaultLang,
    i18n,
  );
  return `${apiBaseUrl}${config.urlApiRegisterChallenge}`;
};

export {
  getPhotoApiUrl,
  getRadioOption,
  getRegisterChallengeApiUrl,
  hexToRgb,
  negativeColor,
  positiveColor,
  transparentColor,
  vModelAdapter,
  whiteColor,
};
