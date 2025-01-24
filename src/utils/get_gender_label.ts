// enums
import { Gender } from '../components/types/Profile';

// types
import type { I18n } from 'vue-i18n';

/**
 * Get gender label based on gender value
 * @param {Gender} gender - Gender enum value
 * @param {I18n} i18n - I18n instance
 * @returns {string} - Localized gender label or empty string if gender is not recognized
 */
export const getGenderLabel = (gender: Gender, i18n: I18n): string => {
  switch (gender) {
    case Gender.female:
      return i18n.global.t('global.woman');
    case Gender.male:
      return i18n.global.t('global.man');
    default:
      return '';
  }
};
