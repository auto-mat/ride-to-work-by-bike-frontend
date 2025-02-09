// composables
import { i18n } from '../boot/i18n';
import { defaultLocale } from '../i18n/def_locale';

// enums
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { UsefulLinkId } from '../components/types/Link';

// fixtures
import usefulLinksFixture from '../../test/cypress/fixtures/usefulLinks.json';

// types
import type { UsefulLink } from '../components/types/Link';

import { getApiBaseUrlWithLang } from '../utils/get_api_base_url_with_lang';

export const useUsefulLinks = () => {
  const usefulLinks: UsefulLink[] = usefulLinksFixture.map((item) => {
    let url;
    switch (item.id) {
      case UsefulLinkId.autoMat:
        url = getApiBaseUrlWithLang(
          null,
          rideToWorkByBikeConfig.urlAutoMat,
          defaultLocale,
          i18n,
        );
        break;
      case UsefulLinkId.support:
        url = getApiBaseUrlWithLang(
          null,
          rideToWorkByBikeConfig.urlAutoMat,
          defaultLocale,
          i18n,
        );
        break;
      case UsefulLinkId.projectCode:
        url = rideToWorkByBikeConfig.urlProjectSourceCode;
        break;
      case UsefulLinkId.mobileApp:
        url = rideToWorkByBikeConfig.urlAppStore;
        break;
      default:
        url = '';
    }

    return {
      ...item,
      url,
      title: i18n.global.t(item.title),
    } as UsefulLink;
  });

  return {
    usefulLinks,
  };
};
