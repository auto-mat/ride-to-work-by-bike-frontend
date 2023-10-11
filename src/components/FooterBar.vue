<script lang="ts">
import { defineComponent } from 'vue';
import { i18n } from 'src/boot/i18n';

// components
import LanguageSwitcher from 'components/LanguageSwitcher.vue';

// types
import { ConfigGlobal } from 'components/types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

// Deployed app version
const rideToWorkByBikeDeployedAppVersion: object = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_DEPLOYED_VERSION
);

export default defineComponent({
  name: 'FooterBar',
  components: {
    LanguageSwitcher,
  },
  setup() {
    let copyrightList: string[];
    if (rideToWorkByBikeDeployedAppVersion.version) {
      copyrightList = [
        'copyrightOpenSource',
        'deployedAppVersion',
        'copyrightAuthor',
      ];
    } else {
      copyrightList = ['copyrightOpenSource', 'copyrightAuthor'];
    }

    function scrollToTop(): void {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    const socialLinksList = [
      {
        title: i18n.global.t('index.menuLinks.instagram'),
        icon: 'mdi-instagram',
        url: rideToWorkByBikeConfig.instagramUrl,
      },
      {
        title: i18n.global.t('index.menuLinks.facebook'),
        icon: 'mdi-facebook',
        url: rideToWorkByBikeConfig.facebookUrl,
      },
      {
        title: i18n.global.t('index.menuLinks.twitter'),
        icon: 'mdi-twitter',
        url: rideToWorkByBikeConfig.twitterUrl,
      },
      {
        title: i18n.global.t('index.menuLinks.youtube'),
        icon: 'mdi-youtube',
        url: rideToWorkByBikeConfig.youtubeUrl,
      },
    ];

    return {
      socialLinksList,
      copyrightList,
      scrollToTop,
      rideToWorkByBikeDeployedAppVersion,
    };
  },
});
</script>

<template>
  <div class="absolute-bottom text-white overflow-hidden" data-cy="footer">
    <!-- Background image (cityscape) -->
    <q-img
      class="absolute-top-left h-254"
      src="~assets/svg/bg-footer.svg"
      data-cy="footer-background"
    />
    <!-- Footer content (leave space above for graphics) -->
    <div class="relative-position pt-112">
      <div
        class="footer-wrapper h-lg-142 max-w-lg-90perc flex items-end q-px-md"
      >
        <!-- Scroll to top button (desktop) -->
        <div class="footer-scroll-top shrink-0">
          <q-btn
            class="w-38 h-38 gt-sm"
            color="white"
            outline
            round
            data-cy="footer-top-button"
            @click.prevent="scrollToTop"
          >
            <q-icon name="arrow_upward" size="18px" />
          </q-btn>
        </div>

        <div class="footer-content h-full col-grow">
          <div
            class="col-grow flex flex-wrap items-start justify-between gap-8"
          >
            <!-- Logo -->
            <q-img
              src="~assets/svg/logo-white.svg"
              width="142px"
              height="40px"
              data-cy="footer-logo"
            />

            <!-- Scroll to top button (mobile) -->
            <q-btn
              class="w-38 h-38 lt-md"
              color="white"
              outline
              round
              data-cy="footer-top-button-mobile"
              @click.prevent="scrollToTop"
            >
              <q-icon name="arrow_upward" size="18px" />
            </q-btn>

            <!-- License + Owner information (mobile) -->
            <div
              class="w-full w-md-auto flex flex-wrap items-center justify-center gap-12 text-center q-py-md lt-md copyright"
              data-cy="footer-copyright-list-mobile"
            >
              <div
                v-for="(message, index) in copyrightList"
                :key="message"
                class="text-white flex items-center gap-12"
              >
                <span
                  v-if="message !== 'deployedAppVersion'"
                  v-html="$t('index.footer.' + message)"
                ></span>
                <!-- Deployed app version -->
                <span
                  v-else-if="rideToWorkByBikeDeployedAppVersion.version"
                  v-html="
                    `${$t('index.footer.' + message)}: ${
                      rideToWorkByBikeDeployedAppVersion.version
                    }`
                  "
                ></span>
                <span v-if="index < copyrightList.length - 1" class="gt-sm"
                  >|</span
                >
              </div>
            </div>
            <div class="flex column items-center row-md w-full w-md-auto">
              <!-- List: Social links -->
              <div>
                <ul
                  class="flex items-center gap-32"
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
                    >
                      <a
                        :href="link.url"
                        class="flex column justify-center text-white"
                        target="_blank"
                        style="text-decoration: none"
                      >
                        <q-icon :name="link.icon" size="18px" />
                      </a>
                    </q-btn>
                  </li>
                </ul>
              </div>
              <span class="q-mx-lg gt-sm">|</span>
              <!-- Language switcher component -->
              <language-switcher />
            </div>
          </div>
          <!-- License + Owner information (desktop) -->
          <div
            class="flex flex-wrap items-center gap-12 copyright gt-sm"
            data-cy="footer-copyright-list-desktop"
          >
            <div
              v-for="(message, index) in copyrightList"
              :key="message"
              class="text-white flex items-center gap-12"
            >
              <span
                v-if="message !== 'deployedAppVersion'"
                v-html="$t('index.footer.' + message)"
              ></span>
              <!-- Deployed app version -->
              <span
                v-else-if="rideToWorkByBikeDeployedAppVersion.version"
                v-html="
                  `${$t('index.footer.' + message)}: ${
                    rideToWorkByBikeDeployedAppVersion.version
                  }`
                "
              ></span>
              <span v-if="index < copyrightList.length - 1" class="gt-sm"
                >|</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<style scoped lang="scss">
.h-full {
  height: 100%;
}

.h-lg-142 {
  @media (min-width: $breakpoint-lg-min) {
    height: 142px;
  }
}

.h-254 {
  height: 254px;
}

.w-38 {
  width: 38px;
  min-width: 0;
}

.h-38 {
  height: 38px;
  min-height: 0;
}

.pt-112 {
  padding-top: 112px;
}

.w-full {
  width: 100%;
}

.w-md-auto {
  @media (min-width: $breakpoint-md-min) {
    width: auto;
  }
}

.max-w-lg-90perc {
  @media (min-width: $breakpoint-lg-min) {
    max-width: 90%;
  }
}

.row-md {
  @media (min-width: $breakpoint-md-min) {
    flex-direction: row;
  }
}

.footer-wrapper {
  background-color: $grey-10;

  @media (min-width: $breakpoint-md-min) {
    background-color: transparent;
  }
}

.footer-scroll-top {
  padding-top: 16px;

  @media (min-width: $breakpoint-md-min) {
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 8px;
  }

  @media (min-width: $breakpoint-md-min) {
    padding-top: 0;
    padding-bottom: 24px;
  }
}

.footer-content {
  padding-top: 16px;
  padding-bottom: 70px;

  @media (min-width: $breakpoint-md-min) {
    padding-top: 32px;
  }

  @media (min-width: $breakpoint-md-min) {
    padding-bottom: 0;
  }
}

.language-list {
  list-style: none;
  font-size: 14px;
  padding-left: 0;
  padding-inline-start: 0;
}

.copyright :deep(a) {
  color: #fff;
}
</style>
