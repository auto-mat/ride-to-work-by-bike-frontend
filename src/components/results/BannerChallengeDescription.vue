<script lang="ts">
/**
 * BannerChallengeDescription Component
 *
 * @description * Use this component to display a box with challenge info.
 *
 * @example
 * <banner-challenge-description></banner-challenge-description>
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858%3A104622&t=PXQfczj1aQfytQXa-1)
 */

// libraries
import { date } from 'quasar';
import { computed, defineComponent } from 'vue';

// composables
import { useRoutes } from '../../composables/useRoutes';
import { i18n } from '../../boot/i18n';

// fixtures
import challengeDescriptions from '../../../test/cypress/fixtures/bannerChallengeDescription.json';

// types
import type { ChallengeDescription } from '../types/Challenge';

export default defineComponent({
  name: 'BannerChallengeDescription',
  setup() {
    const { formatDate } = date;
    const { getRouteIcon } = useRoutes();

    // type cast to ChallengeDescription
    const challenge = challengeDescriptions as ChallengeDescription;

    const transportIcons = computed((): string[] => {
      if (!challenge?.transportTypes?.length) {
        return [];
      }
      return challenge.transportTypes.map((type) => getRouteIcon(type));
    });

    /**
     * Returns a string representing the time period of a challenge.
     * Accounts for both dateStart and dateEnd.
     * If either dates is missing, it shows a textually open-ended period.
     */
    const timePeriod = computed((): string => {
      if (!challenge?.dateStart && !challenge?.dateEnd) {
        return '';
      }
      if (!challenge?.dateStart) {
        return `${i18n.global.t('global.from')} ${formatDate(challenge?.dateEnd, 'D. MMM. YYYY')}`;
      }
      if (!challenge?.dateEnd) {
        return `${i18n.global.t('global.to')} ${formatDate(challenge?.dateStart, 'D. MMM. YYYY')}`;
      }

      return `${formatDate(challenge?.dateStart, 'D. MMM.')} - ${formatDate(challenge?.dateEnd, 'D. MMM. YYYY')}`;
    });

    return {
      challenge,
      timePeriod,
      transportIcons,
    };
  },
});
</script>

<template>
  <div data-cy="banner-challenge-description">
    <div class="row">
      <div class="col-lg-8">
        <dl class="q-pa-md">
          <div class="row">
            <div
              class="col-12 col-sm-auto flex q-my-xs q-mr-md"
              data-cy="challenge-period"
            >
              <!-- Time period -->
              <dt class="q-mr-sm">
                {{ $t('bannerChallengeDescription.period') }}:
              </dt>
              <dd class="q-px-0 text-bold">{{ timePeriod }}</dd>
            </div>
            <div
              class="col-12 col-sm-auto flex q-my-xs"
              data-cy="challenge-transport"
            >
              <dt class="q-mr-sm">
                {{ $t('bannerChallengeDescription.transportType') }}:
              </dt>
              <dd class="q-px-0 flex flex-wrap gap-8">
                <q-icon
                  v-for="icon in transportIcons"
                  :key="icon"
                  :name="icon"
                  size="18px"
                />
              </dd>
            </div>
          </div>
          <!-- Description -->
          <div class="q-my-md">
            <div
              v-html="challenge.description"
              data-cy="challenge-description"
            />
          </div>
          <div data-cy="challenge-link">
            <a :href="challenge.link.url" target="_blank" class="flex gap-4">
              <span>
                <q-icon name="launch" size="18px" />
              </span>
              <span>
                {{ challenge.link.title }}
              </span>
            </a>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
dd {
  margin-inline-start: 0;
}
</style>
