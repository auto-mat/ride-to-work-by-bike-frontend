<script lang="ts">
/**
 * TopBarCountdown Component
 *
 * @description * Use this component to display a top bar with countdown.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @props
 * - `releaseDate` (String, required): The target date for the countdown.
 *   This should be a valid input for JS `Date` constructor, e.g. '2025-01-31'.
 *
 * @example
 * <top-bar-countdown :release-date="competitionStart" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6485%3A29122&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useCountdown } from 'src/composables/useCountdown';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { i18n } from 'src/boot/i18n';

export default defineComponent({
  name: 'TopBarCountdown',
  props: {
    releaseDate: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { challengeMonth } = rideToWorkByBikeConfig;
    const { countdown } = useCountdown(computed(() => props.releaseDate));

    const countdownText = computed(() => {
      return i18n.global.t(
        `register.challenge.textCountdown.${challengeMonth}`,
        {
          days: countdown.value.days,
          hours: countdown.value.hours,
          minutes: countdown.value.minutes,
          seconds: countdown.value.seconds,
        },
      );
    });

    return {
      challengeMonth,
      countdown,
      countdownText,
    };
  },
});
</script>

<template>
  <div
    class="top-bar justify-center text-white text-weight-bold text-subtitle2 bg-red q-py-sm q-px-sm flex justify-sm-center"
    data-cy="top-bar-countdown"
  >
    {{ countdownText }}
  </div>
</template>
