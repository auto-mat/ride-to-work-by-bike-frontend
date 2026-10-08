// composables
import { i18n } from '../boot/i18n';

// enums
import { SocialLinkId } from '../components/types/Link';

// fixtures
import { rideToWorkByBikeConfig } from '@/boot/global_vars';
import socialLinksFixture from '../../test/cypress/fixtures/socialLinks.json';

// types
import type { SocialLink } from '../components/types/Link';

export const useSocialLinks = () => {
  const socialLinks: SocialLink[] = socialLinksFixture.map((item) => {
    let url;

    switch (item.id) {
      case SocialLinkId.facebook:
        url = rideToWorkByBikeConfig.urlFacebook;
        break;
      case SocialLinkId.instagram:
        url = rideToWorkByBikeConfig.urlInstagram;
        break;
      case SocialLinkId.twitter:
        url = rideToWorkByBikeConfig.urlTwitter;
        break;
      case SocialLinkId.youtube:
        url = rideToWorkByBikeConfig.urlYoutube;
        break;
      default:
        url = '';
    }

    return {
      ...item,
      title: i18n.global.t(item.title),
      url,
    } as SocialLink;
  });

  return {
    socialLinks,
  };
};
