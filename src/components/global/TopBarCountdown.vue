<script lang="ts">
/**
 * TopBarCountdown Component
 *
 * @description * Use this component to display a top bar with countdown.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @example
 * <top-bar-countdown />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6485%3A29122&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// composables
import { useCountdown } from 'src/composables/useCountdown';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

export default defineComponent({
  name: 'TopBarCountdown',
  setup() {
    const { challengeMonth, challengeStartDate } = rideToWorkByBikeConfig;
    const { countdown } = useCountdown(challengeStartDate);

    return {
      challengeMonth,
      countdown,
    };
  },
});
</script>

<template>
  <div
    class="top-bar justify-center text-white text-weight-bold text-subtitle2 bg-red q-py-sm q-px-sm flex justify-sm-center"
    data-cy="top-bar-countdown"
  >
    <span v-if="challengeMonth === 'may'">
      {{
        $t('register.challenge.textCountdownMay', {
          days: countdown.days,
          hours: countdown.hours,
          minutes: countdown.minutes,
          seconds: countdown.seconds,
        })
      }}
    </span>
    <span v-if="challengeMonth === 'september'">
      {{
        $t('register.challenge.textCountdownSeptember', {
          days: countdown.days,
          hours: countdown.hours,
          minutes: countdown.minutes,
          seconds: countdown.seconds,
        })
      }}
    </span>
    <span v-if="challengeMonth === 'october'">
      {{
        $t('register.challenge.textCountdownOctober', {
          days: countdown.days,
          hours: countdown.hours,
          minutes: countdown.minutes,
          seconds: countdown.seconds,
        })
      }}
    </span>
  </div>
</template>
