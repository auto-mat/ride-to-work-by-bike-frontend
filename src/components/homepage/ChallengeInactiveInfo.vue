<script lang="ts">
/**
 * ChallengeInactiveInfo Component
 *
 * @description
 * Renders information about an inactive challenge, informing the user
 * that the challenge they're trying to access is not currently available.
 *
 * @example
 * <challenge-inactive-info />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6385-26491&t=Kg5tEX1Skno3i6DW-1)
 */

// libraries
import { computed, inject, onMounted, watch } from 'vue';
import { colors } from 'quasar';
import { defineComponent } from 'vue';

import { useRouter } from 'vue-router';

import ShowCurrentDatetime from 'components/debug/ShowCurrentDatetime.vue';
import { routesConf } from '../../router/routes_conf';
import { useChallengeStore } from '../../stores/challenge';
import { i18n } from '../../boot/i18n';

import { PhaseType } from '../types/Challenge';
import { Logger } from '../types/Logger';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'ChallengeInactiveInfo',
  components: { ShowCurrentDatetime },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const white = getPaletteColor('white');
    const whiteOpacity20 = changeAlpha(
      white,
      rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
    );
    const router = useRouter();
    const challengeStore = useChallengeStore();
    //const registerChallengeStore = useRegisterChallengeStore();
    const isThisCampaignPhaseTypeCompetition = computed(() =>
      challengeStore.getIsChallengeInPhase(PhaseType.competition),
    );
    const campaignDescription = computed(() => {
      const description = challengeStore.getDescription;
      if (description) {
        const titleRegex = /<h1>(.*)<\/h1>/g;
        const title = titleRegex.exec(description);
        return {
          title: title[1],
          text: description.substring(title[0].length, description.length),
        };
      }
      return {
        title: i18n.global.t('challengeInactive.title'),
        text: i18n.global.t('challengeInactive.text'),
      };
    });
    const checkIsThisCampaignPhaseTypeCompetition = async (): Promise<void> => {
      logger?.debug(
        `Check if this campaign phase type is <${PhaseType.competition}>.`,
      );
      if (!isThisCampaignPhaseTypeCompetition.value) {
        logger?.debug(
          `This campaign <${PhaseType.competition}> phase type is` +
            ` <${isThisCampaignPhaseTypeCompetition.value}>,` +
            ' refresh this campaign data from the API' +
            ' by <loadPhaseSet()> function.',
        );
        await challengeStore.loadPhaseSet();
      } else {
        const message =
          'This campaign phase type' +
          ` ${isThisCampaignPhaseTypeCompetition.value ? 'is' : 'is not'}` +
          ` <${PhaseType.competition}>`;
        logger?.debug(
          `${message}, disable <checkIsThisCampaignPhaseTypeCompetition()>` +
            ' function runned in every' +
            ` <${rideToWorkByBikeConfig.checkIsThisCampaignCompetitionPhaseTypeInterval}> seconds.`,
        );
        clearTimeout(checkIsThisCampaignPhaseTypeCompetitionId);
      }
    };
    const checkIsThisCampaignPhaseTypeCompetitionId = setInterval(
      checkIsThisCampaignPhaseTypeCompetition,
      parseInt(
        rideToWorkByBikeConfig.checkIsThisCampaignCompetitionPhaseTypeInterval,
      ) * 1000,
    );
    onMounted(() => {
      checkIsThisCampaignPhaseTypeCompetition();
    });
    // once this campaign phase type is competition, redirect to home page
    watch(isThisCampaignPhaseTypeCompetition, (newValue) => {
      if (newValue) {
        logger?.debug(
          `This campaign phase type is <${PhaseType.competition}>,` +
            ` redirect to <${routesConf['home']['path']}> URL.`,
        );
        router.push(routesConf['home']['path']);
      }
    });
    // If locale lang is changed, we need reload this campaign description field value,
    // beacuse description field value is localized on the bakend DB side
    watch(
      () => i18n.global.locale,
      () => {
        logger?.info(
          'Locale lang is changed, reload this campaign description field value.',
        );
        challengeStore.loadPhaseSet();
      },
    );
    return {
      campaignDescription,
      white,
      whiteOpacity20,
    };
  },
});
</script>

<template>
  <div class="bg-primary text-white" data-cy="challenge-inactive-info">
    <!-- Graphics -->
    <div class="q-mb-lg" data-cy="challenge-inactive-graphics">
      <q-avatar
        size="64px"
        :style="{ backgroundColor: whiteOpacity20 }"
        :color="white"
        data-cy="challenge-inactive-avatar"
      >
        <!-- Icon -->
        <q-icon
          size="40px"
          color="white"
          name="svguse:icons/challenge_inactive/icons.svg#email"
          data-cy="challenge-inactive-icon"
        />
      </q-avatar>
    </div>
    <!-- Heading -->
    <div class="q-mb-lg">
      <!-- Show current date time debug message during Cypress tests required
         to indentify if this campaign competition phase is active/inactive
      -->
      <show-current-datetime></show-current-datetime>
      <h1
        class="text-h5 text-bold q-my-none"
        data-cy="challenge-inactive-title"
      >
        {{ campaignDescription.title }}
      </h1>
    </div>
    <!-- Text -->
    <div
      data-cy="challenge-inactive-text"
      class="q-mb-xl"
      v-html="campaignDescription.text"
    />
  </div>
</template>
