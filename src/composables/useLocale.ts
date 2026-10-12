// libraries
import { computed } from 'vue';

// composables
import { i18n } from '../boot/i18n';

// enum
import { LocaleLangCode } from '../components/types/Locale';

// types
import type { Composer } from 'vue-i18n';

// correctly type the global i18n object
const globalI18n = i18n.global as unknown as Composer;

export const useLocale = () => {
  const localeWithCountry = computed(() => {
    switch (globalI18n.locale.value) {
      case 'cs':
        return LocaleLangCode.cs;
      case 'sk':
        return LocaleLangCode.sk;
      default:
        return LocaleLangCode.en;
    }
  });

  return {
    localeWithCountry,
  };
};
