<script lang="ts">
import { setCssVar } from 'quasar';
import { defineComponent, ref, watchEffect, onBeforeUnmount } from 'vue';
// import { useI18n } from 'vue-i18n'
import { useDateFormat } from '@vueuse/core';
import { Countdown } from 'components/types';

const rideToWorkByBikeConfig: object = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('gray-light', rideToWorkByBikeConfig.colorGrayLight);

export default defineComponent({
  name: 'VueEventCountdown',
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
    const formattedDate = useDateFormat(
      new Date(props.releaseDate),
      formatString
    );

    let countdownInterval: ReturnType<typeof setInterval> | null = null;

    const startCountdown = () => {
      const targetDate = new Date(props.releaseDate).getTime();

      countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeDifference = targetDate - now;

        if (timeDifference > 0) {
          countdown.value = {
            days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor(
              (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
            ),
            seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
          };
        } else {
          if (countdownInterval) {
            clearInterval(countdownInterval);
          }
        }
      }, 1000);
    };

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
    class="row items-center justify-evenly q-py-xl"
    data-cy="card"
  >
    <div class="text-center">
      <div class="text-weight-bold q-px-lg" data-cy="title">
        {{ $t('index.countdown.title', { date: formattedDate }) }}
      </div>
      <div class="row items-center justify-evenly q-mt-md">
        <div class="q-px-md">
          <div class="text-64 text-weight-bold" data-cy="countdown-days">
            {{ countdown.days }}
          </div>
          <div class="q-mt-xs" data-cy="countdown-label-days">
            {{ $t('index.countdown.days') }}
          </div>
        </div>
        <div class="q-px-md">
          <div class="text-64 text-weight-bold" data-cy="countdown-hours">
            {{ countdown.hours }}
          </div>
          <div class="q-mt-xs" data-cy="countdown-label-hours">
            {{ $t('index.countdown.hours') }}
          </div>
        </div>
        <div class="q-px-md">
          <div class="text-64 text-weight-bold" data-cy="countdown-minutes">
            {{ countdown.minutes }}
          </div>
          <div class="q-mt-xs" data-cy="countdown-label-minutes">
            {{ $t('index.countdown.minutes') }}
          </div>
        </div>
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

<style>
.q-card {
  background-color: var(--q-gray-light);
}
.text-64 {
  font-size: 64px;
  @media (min-width: $breakpoint-lg-min) {
    font-size: 48px;
  }
}
</style>
