<script lang="ts">
/**
 * TheFooter Component
 *
 * The `TheFooter` component renders the website footer, which includes
 * social links, a language switcher, and a scroll to top functionality.
 *
 * @description
 * This footer displays a set of social links, a language switcher
 * for changing the website language, and a button to smoothly scroll back
 * to the top of the page. Link urls are taken from global config.
 *
 * @components
 * - `LanguageSwitcher`: Component to switch the website's language.
 *
 * @example
 * <the-footer />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103891&mode=dev)
 */

// libraries
import { colors } from 'quasar';
import { defineComponent } from 'vue';
import { i18n } from '../../boot/i18n';

// components
import LanguageSwitcher from '../global/LanguageSwitcher.vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// types
import { ConfigAppVersion } from '../types/Config';

// Deployed app version
const rideToWorkByBikeDeployedAppVersion: ConfigAppVersion = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_DEPLOYED_VERSION,
);

export default defineComponent({
  name: 'FooterBar',
  components: {
    LanguageSwitcher,
  },
  setup() {
    let appInfo: string[];
    if (rideToWorkByBikeDeployedAppVersion.version) {
      appInfo = ['softwareLicence', 'deployedAppVersion'];
    } else {
      appInfo = ['softwareLicence'];
    }

    function scrollToTop(): void {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    const socialLinksList = [
      {
        id: 'instagram',
        title: i18n.global.t('index.menuLinks.instagram'),
        icon: 'mdi-instagram',
        url: rideToWorkByBikeConfig.urlInstagram,
      },
      {
        id: 'facebook',
        title: i18n.global.t('index.menuLinks.facebook'),
        icon: 'mdi-facebook',
        url: rideToWorkByBikeConfig.urlFacebook,
      },
      {
        id: 'twitter',
        title: i18n.global.t('index.menuLinks.twitter'),
        icon: 'mdi-twitter',
        url: rideToWorkByBikeConfig.urlTwitter,
      },
      {
        id: 'youtube',
        title: i18n.global.t('index.menuLinks.youtube'),
        icon: 'mdi-youtube',
        url: rideToWorkByBikeConfig.urlYoutube,
      },
    ];

    const maxWidth = rideToWorkByBikeConfig.containerContentWidth;

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const primaryOpacity = changeAlpha(
      getPaletteColor('primary'),
      rideToWorkByBikeConfig.colorPrimaryOpacity,
    );

    return {
      appInfo,
      maxWidth,
      primaryOpacity,
      rideToWorkByBikeDeployedAppVersion,
      rideToWorkByBikeConfig,
      socialLinksList,
      scrollToTop,
    };
  },
});
</script>

<template>
  <div :style="{ backgroundColor: primaryOpacity }">
    <div class="q-px-lg q-py-xl" :style="{ maxWidth }" data-cy="footer">
      <!-- Footer content (leave space above for graphics) -->
      <div>
        <!-- Scroll to top button (desktop) -->
        <div class="flex items-center">
          <q-btn
            dense
            round
            outline
            color="primary"
            @click.prevent="scrollToTop"
            data-cy="footer-top-button"
          >
            <q-icon name="arrow_upward" size="18px" />
          </q-btn>
          <a
            href="#"
            class="text-primary no-underline q-ml-sm"
            @click.prevent="scrollToTop"
            data-cy="footer-top-button-text"
          >
            {{ $t('footer.buttonBackToTop') }}
          </a>
        </div>

        <q-separator color="primary" class="q-my-lg" />

        <div class="footer-content">
          <div
            class="col-grow row q-col-gutter-md items-center justify-between"
          >
            <div class="col-12 col-sm-auto flex items-center">
              <!-- Logo -->
              <q-img
                src="~assets/svg/logo.svg"
                width="142px"
                height="40px"
                data-cy="footer-logo"
              />
              <q-separator
                vertical
                class="q-mx-lg"
                data-cy="footer-logo-separator"
              />
              <div class="flex items-end gap-16" data-cy="footer-auto-mat">
                <span
                  class="gt-sm text-grey-8"
                  data-cy="footer-challenge-organizer"
                >
                  {{ $t('footer.textChallengeOrganizer') }}
                </span>
                <a
                  :href="rideToWorkByBikeConfig.urlAutoMat"
                  class="block"
                  target="_blank"
                  data-cy="footer-auto-mat-logo-link"
                >
                  <q-img
                    src="~assets/svg/logo-automat.svg"
                    width="74px"
                    height="28px"
                    class="q-mb-xs"
                    data-cy="footer-auto-mat-logo"
                  />
                </a>
              </div>
            </div>

            <!-- License + Owner information (mobile) -->
            <div
              class="col-12 lt-sm w-md-auto flex flex-wrap items-center text-grey-8 justify-center gap-12 text-center q-my-md"
              data-cy="footer-app-info-mobile"
            >
              <div
                v-for="(message, index) in appInfo"
                :key="message"
                class="flex items-center gap-12"
              >
                <span
                  v-if="message !== 'deployedAppVersion'"
                  v-html="$t('footer.' + message)"
                ></span>
                <!-- Deployed app version -->
                <span
                  v-else-if="rideToWorkByBikeDeployedAppVersion.version"
                  v-html="
                    `${$t('footer.' + message)}: ${
                      rideToWorkByBikeDeployedAppVersion.version
                    }`
                  "
                ></span>
                <span v-if="index < appInfo.length - 1" class="gt-sm">|</span>
              </div>
            </div>

            <!-- List: Social links -->
            <div
              class="col-12 col-sm-auto col-lg flex justify-center justify-lg-end"
            >
              <div>
                <ul
                  class="flex items-center gap-32 q-my-none q-px-none"
                  data-cy="footer-social-menu"
                  style="list-style: none"
                >
                  <li>
                    <q-btn
                      flat
                      round
                      v-for="link in socialLinksList"
                      :key="link.icon"
                      :title="link.title"
                      data-cy="footer-social-menu-button"
                    >
                      <a
                        :href="link.url"
                        class="flex column justify-center"
                        target="_blank"
                        style="text-decoration: none"
                        :data-cy="`footer-social-menu-link-${link.id}`"
                      >
                        <q-icon
                          :name="link.icon"
                          size="24px"
                          color="primary"
                          data-cy="footer-social-menu-icon"
                        />
                      </a>
                    </q-btn>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Language switcher component -->
            <div class="col-12 col-sm-auto flex">
              <div class="q-mx-auto q-py-sm">
                <language-switcher
                  class="q-my-none"
                  variant="light"
                  data-cy="language-switcher-footer"
                />
              </div>
            </div>
          </div>

          <!-- License + Owner information (desktop) -->
          <div
            class="flex flex-wrap items-center text-grey-8 gap-12 gt-xs q-mt-lg"
            data-cy="footer-app-info-desktop"
          >
            <div
              v-for="(message, index) in appInfo"
              :key="message"
              class="flex items-center gap-12"
            >
              <span
                v-if="message !== 'deployedAppVersion'"
                v-html="$t('footer.' + message)"
              ></span>
              <!-- Deployed app version -->
              <span
                v-else-if="rideToWorkByBikeDeployedAppVersion.version"
                v-html="
                  `${$t('footer.' + message)}: ${
                    rideToWorkByBikeDeployedAppVersion.version
                  }`
                "
              ></span>
              <span v-if="index < appInfo.length - 1" class="gt-sm">|</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.w-md-auto {
  @media (min-width: $breakpoint-md-min) {
    width: auto !important;
  }
}

.footer-content {
  padding-bottom: 40px;

  @media (min-width: $breakpoint-md-min) {
    padding-bottom: 0;
  }
}

.justify-lg-end {
  @media (min-width: $breakpoint-lg-min) {
    justify-content: flex-end;
  }
}
</style>
