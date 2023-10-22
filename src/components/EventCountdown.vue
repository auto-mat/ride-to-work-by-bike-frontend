<script lang="ts">
/**
 * EventCountdown Component
 *
 * The `EventCountdown` component provides a countdown mechanism that
 * displays the remaining time until a specified event or release date.
 *
 * @description
 * This component calculates the time difference between the current date
 * and a given release date, displaying the days, hours, minutes, and seconds
 * remaining. It also provides a mechanism for formatting the release date
 * based on the user's locale.
 *
 * @props
 * - `releaseDate` (String, required): The target date for the countdown.
 *   This date is expected to be in a specific format.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6021%3A22974&mode=dev)
 *
 * @example
 * <event-countdown :releaseDate="targetDate" />
 */

import { setCssVar, date } from 'quasar';
import { defineComponent, ref, watchEffect, onBeforeUnmount } from 'vue';
// import { useI18n } from 'vue-i18n'

// types
import { Countdown, ConfigGlobal } from 'components/types';

const { formatDate } = date;

const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('info', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'EventCountdown',
  props: {
    releaseDate: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const countdown = ref<Countdown>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    // currently not working see https://github.com/intlify/vue-i18n-next/issues/1193
    // const { locale } = useI18n({ useScope: 'global' })
    let formatString = 'D. M.';
    // if (locale.value === 'en') {
    //   formatString = 'D MMM';
    // }
    const formattedDate = formatDate(new Date(props.releaseDate), formatString);

    let countdownInterval: ReturnType<typeof setInterval> | null = null;

    const startCountdown = () => {
      const targetDate = new Date(props.releaseDate).getTime();

      countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeDifference = getTimeDifference(now, targetDate);

        computeCountdownInterval(timeDifference);
      }, 1000);
    };

    function getTimeDifference(now: number, date: number): number {
      return date - now;
    }

    function computeCountdownInterval(timeDifference: number) {
      if (timeDifference > 0) {
        setCountdownValues(timeDifference);
      } else {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
      }
    }

    function setCountdownValues(timeDifference: number): void {
      countdown.value = {
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
      };
    }

    watchEffect(() => {
      startCountdown();
    });

    onBeforeUnmount(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    });

    return {
      countdown,
      formattedDate,
    };
  },
});
</script>

<template>
  <q-card
    square
    flat
    class="row items-center justify-evenly q-py-xl bg-info"
    data-cy="card"
  >
    <div class="text-center">
      <!-- Title -->
      <div class="text-weight-bold q-px-lg" data-cy="title">
        {{ $t('index.countdown.title', { date: formattedDate }) }}
      </div>
      <!-- Countdown -->
      <div class="row items-center justify-evenly q-mt-md">
        <!-- Days -->
        <div class="q-px-md">
          <div class="text-64 text-weight-bold" data-cy="countdown-days">
            {{ countdown.days }}
          </div>
          <div class="q-mt-xs" data-cy="countdown-label-days">
            {{ $t('index.countdown.days') }}
          </div>
        </div>
        <!-- Hours -->
        <div class="q-px-md">
          <div class="text-64 text-weight-bold" data-cy="countdown-hours">
            {{ countdown.hours }}
          </div>
          <div class="q-mt-xs" data-cy="countdown-label-hours">
            {{ $t('index.countdown.hours') }}
          </div>
        </div>
        <!-- Minutes -->
        <div class="q-px-md">
          <div class="text-64 text-weight-bold" data-cy="countdown-minutes">
            {{ countdown.minutes }}
          </div>
          <div class="q-mt-xs" data-cy="countdown-label-minutes">
            {{ $t('index.countdown.minutes') }}
          </div>
        </div>
        <!-- Seconds -->
        <div class="q-px-md">
          <div class="text-64 text-weight-bold" data-cy="countdown-seconds">
            {{ countdown.seconds }}
          </div>
          <div class="q-mt-xs" data-cy="countdown-label-seconds">
            {{ $t('index.countdown.seconds') }}
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<style scoped lang="scss">
.text-64 {
  font-size: 64px;

  @media (min-width: $breakpoint-lg-min) {
    font-size: 48px;
  }
}
</style>
