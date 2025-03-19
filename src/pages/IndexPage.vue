<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="bg-white">
      <div
        class="q-px-lg q-pt-lg q-pb-xl overflow-hidden"
        :style="{ maxWidth }"
      >
        <page-heading data-cy="index-title">
          {{ $t('index.title') }}
        </page-heading>
        <!-- Countdown: Event -->
        <countdown-event
          :release-date="competitionStart"
          class="q-mb-xl"
          data-cy="countdown-event"
        />
        <!-- Banner: Team Member Approve -->
        <banner-team-member-approve />
        <!-- Banner: Routes -->
        <banner-routes
          v-if="
            isBannerRoutesEnabled &&
            challengeStatus === ChallengeStatusEnum.during
          "
          :routes-count="14"
          :variant="BannerRoutesVariantsEnum.default"
          class="q-my-xl"
          data-cy="banner-routes"
        />
        <!-- Banner: App link -->
        <banner-app
          v-if="isBannerAppEnabled"
          :banner="bannerAppData"
          class="q-my-xl"
          data-cy="banner-app"
        />
        <!-- Section: Future challenges -->
        <template
          v-if="
            isSectionChallengesEnabled &&
            challengeStatus !== ChallengeStatusEnum.during
          "
        >
          <!-- Title -->
          <section-heading class="q-mt-xl q-mb-md" data-cy="card-list-title">
            {{ $t('index.cardListChallenge.title') }}
          </section-heading>
          <!-- Cards -->
          <section-columns
            :columns="3"
            class="q-col-gutter-lg"
            data-cy="list-challenge"
          >
            <card-challenge
              v-for="card in cardsChallenge"
              :key="card.title"
              :card="card"
              data-cy="card-list-item"
            />
          </section-columns>
        </template>
        <!-- Banner: Questionnaire -->
        <banner-image
          v-if="isBannerQuestionnaireEnabled"
          :banner="bannerImageData"
          class="q-mt-xl"
          data-cy="banner-image"
        />
        <!-- Slider: Progress -->
        <slider-progress
          v-if="
            isSliderProgressEnabled &&
            challengeStatus === ChallengeStatusEnum.during
          "
          :title="$t('index.progressSlider.title')"
          :cards="cardsProgressSlider"
          class="q-mt-xl"
          :button="{
            title: $t('index.progressSlider.button'),
            url: urlResults,
          }"
          data-cy="slider-progress"
        />
        <!-- List: Progress -->
        <list-card-progress
          v-if="
            isListProgressEnabled &&
            challengeStatus === ChallengeStatusEnum.during
          "
          :title="$t('index.cardListProgress.title')"
          :cards="cardsProgress"
          class="q-mt-xl"
          data-cy="list-progress"
        />
      </div>
    </div>
    <div :style="{ backgroundColor: primaryOpacity }">
      <div class="q-px-lg q-py-xl overflow-hidden" :style="{ maxWidth }">
        <heading-background
          :title="headingBgTitle"
          class="q-mb-xl"
          data-cy="heading-background"
        />
        <div v-if="isSectionEventsEnabled" class="q-my-xl" data-cy="list-event">
          <card-event
            v-for="card in cardsEvent"
            :key="card.title"
            :card="card"
            class="q-mt-lg"
            data-cy="card-list-item"
          />
        </div>
        <list-card-offer
          v-if="isSectionOffersEnabled"
          :title="$t('index.cardListOffer.title')"
          :cards="cardsOffer"
          class="q-my-xl"
          data-cy="list-offer"
        />
        <list-card-post
          v-if="isSectionPostsEnabled"
          :title="$t('index.cardListPost.title')"
          :cards="cardsPost"
          :button="{
            title: $t('index.cardListPost.button'),
            url: urlCommunity,
          }"
          class="q-my-xl"
          data-cy="list-post"
        />
        <newsletter-feature class="q-my-xl" data-cy="newsletter-feature" />
        <list-card-follow class="q-mt-xl" data-cy="list-card-follow" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
// libraries
import { colors } from 'quasar';
import { computed, defineComponent, inject, onMounted, ref } from 'vue';

// adapters
import { feedAdapter } from '../adapters/feedAdapter';

// components
import BannerApp from 'components/homepage/BannerApp.vue';
import BannerImage from 'components/homepage/BannerImage.vue';
import BannerRoutes from 'components/homepage/BannerRoutes.vue';
import BannerTeamMemberApprove from 'components/global/BannerTeamMemberApprove.vue';
import CardChallenge from 'components/homepage/CardChallenge.vue';
import CardEvent from 'components/homepage/CardEvent.vue';
import CountdownEvent from 'components/homepage/CountdownEvent.vue';
import HeadingBackground from 'components/homepage/HeadingBackground.vue';
import ListCardFollow from 'components/homepage/ListCardFollow.vue';
import ListCardOffer from 'components/homepage/ListCardOffer.vue';
import ListCardPost from 'components/homepage/ListCardPost.vue';
import ListCardProgress from 'components/homepage/ListCardProgress.vue';
import NewsletterFeature from 'components/homepage/NewsletterFeature.vue';
import PageHeading from 'src/components/global/PageHeading.vue';
import SectionColumns from 'components/homepage/SectionColumns.vue';
import SectionHeading from 'src/components/global/SectionHeading.vue';
import SliderProgress from 'components/homepage/SliderProgress.vue';

// composables
import { useApiGetPosts } from '../composables/useApiGetPosts';

// config
import { routesConf } from '../router/routes_conf';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// enums
import { ChallengeStatus as ChallengeStatusEnum } from 'src/components/enums/Challenge';
import { BannerRoutesVariants as BannerRoutesVariantsEnum } from 'src/components/homepage/BannerRoutes.vue';

// fixtures
import listCardsFollow from '../../test/cypress/fixtures/listCardsFollow.json';
import listCardsPost from '../../test/cypress/fixtures/listCardsPost.json';
import cardsProgressSlider from '../../test/cypress/fixtures/cardsProgress.json';

// mocks
import * as homepage from '../mocks/homepage';

// stores
import { useChallengeStore } from 'src/stores/challenge';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import type { Logger } from '../components/types/Logger';
import type { Offer } from '../components/types/Offer';

// utils
import { getOffersFeedParamSet } from '../utils/get_feed_param_set';

export default defineComponent({
  name: 'IndexPage',
  components: {
    BannerApp,
    BannerImage,
    BannerRoutes,
    BannerTeamMemberApprove,
    CardChallenge,
    CardEvent,
    CountdownEvent,
    HeadingBackground,
    ListCardFollow,
    ListCardOffer,
    ListCardPost,
    ListCardProgress,
    NewsletterFeature,
    PageHeading,
    SectionColumns,
    SectionHeading,
    SliderProgress,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;

    const isBannerRoutesEnabled = false;
    const isBannerAppEnabled = false;
    const isSectionChallengesEnabled = false;
    const isBannerQuestionnaireEnabled = false;
    const isSliderProgressEnabled = false;
    const isListProgressEnabled = false;
    const isSectionEventsEnabled = false;
    const isSectionOffersEnabled = true;
    const isSectionPostsEnabled = false;

    const challengeStore = useChallengeStore();
    const challengeStatus = challengeStore.getChallengeStatus;

    const registerChallengeStore = useRegisterChallengeStore();

    const cardsFollow = listCardsFollow;
    const cardsPost = listCardsPost;

    const urlCommunity = routesConf['community']['path'];
    const urlResults = routesConf['results']['path'];

    const posts = ref<Offer[]>([]);
    const { isLoading: isLoadingPosts, loadPosts } = useApiGetPosts(logger);
    const cardsOffer = computed(() => feedAdapter.toCardOffer(posts.value));

    onMounted(async () => {
      // make sure phase set is loaded
      if (!challengeStore.getPhaseSet.length) {
        await challengeStore.loadPhaseSet();
      }
      // if the information is not set, check if user is coordinator
      if (registerChallengeStore.getIsUserOrganizationAdmin === null) {
        await registerChallengeStore.checkIsUserOrganizationAdmin();
      }
      // load my team data if not available
      if (!registerChallengeStore.getMyTeam) {
        logger?.info('My team data is not available, loading my team data.');
        await registerChallengeStore.loadMyTeamToStore(logger);
      }
      // if citySlug is not available, try reloading register challenge data
      if (!registerChallengeStore.getCityWpSlug) {
        await registerChallengeStore.loadRegisterChallengeToStore();
      }
      // if citySlug is available, load posts, else we can't load posts
      if (registerChallengeStore.getCityWpSlug) {
        posts.value = await loadPosts(
          getOffersFeedParamSet(registerChallengeStore.getCityWpSlug),
        );
      }
    });

    const competitionStart = computed(() => challengeStore.getCompetitionStart);

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const primaryOpacity = changeAlpha(
      getPaletteColor('primary'),
      rideToWorkByBikeConfig.colorPrimaryOpacity,
    );

    const maxWidth = rideToWorkByBikeConfig.containerContentWidth;

    return {
      badgeList: homepage.badgeList,
      bannerAppData: homepage.bannerApp,
      bannerImageData: homepage.bannerImage,
      BannerRoutesVariantsEnum,
      cardsChallenge: homepage.cardsChallenge,
      cardsEvent: homepage.cardsEvent,
      cardsFollow,
      cardsOffer,
      cardsPost,
      cardsProgress: homepage.cardsProgress,
      cardsProgressSlider,
      challengeStatus,
      ChallengeStatusEnum,
      maxWidth,
      headingBgTitle: homepage.headingBgTitle,
      primaryOpacity,
      competitionStart,
      urlCommunity,
      urlResults,
      isLoadingPosts,
      isBannerRoutesEnabled,
      isBannerAppEnabled,
      isSectionChallengesEnabled,
      isBannerQuestionnaireEnabled,
      isSliderProgressEnabled,
      isListProgressEnabled,
      isSectionEventsEnabled,
      isSectionOffersEnabled,
      isSectionPostsEnabled,
    };
  },
});
</script>

<style scoped lang="scss">
.bg-gray-lighter {
  background-color: var(--q-gray-lighter);
}
</style>
