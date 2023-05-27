<script lang="ts">
import { defineComponent, ref, computed, watchEffect, onBeforeUnmount } from 'vue';
import { ComputedRef } from 'vue';
import { useDateFormat } from '@vueuse/core';

export default defineComponent({
  name: 'EventCountdown',
  props: {
    releaseDate: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    interface Countdown {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }

    const countdown = ref<Countdown>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    const formattedDate = useDateFormat(new Date(props.releaseDate), 'D. M.')

    let countdownInterval: ReturnType<typeof setInterval> | null = null;

    const startCountdown = () => {
      const targetDate = new Date(props.releaseDate).getTime();

      countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeDifference = targetDate - now;

        if (timeDifference > 0) {
          countdown.value = {
            days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
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
      formattedDate
    }
  }
})
</script>

<template>
  <q-card square flat class="row items-center justify-evenly q-py-xl">
    <div class="text-center">
      <div class="text-weight-medium">{{ $t('index.countdown.title', { date: formattedDate }) }}</div>
      <div class="row items-center justify-evenly	q-mt-md">
        <div class="q-px-md">
          <div class="text-h3 text-weight-bold">{{ countdown.days }}</div>
          <div class="q-mt-xs">{{ $t('index.countdown.days') }}</div>
        </div>
        <div class="q-px-md">
          <div class="text-h3 text-weight-bold">{{ countdown.hours }}</div>
          <div class="q-mt-xs">{{ $t('index.countdown.hours') }}</div>
        </div>
        <div class="q-px-md">
          <div class="text-h3 text-weight-bold">{{ countdown.minutes }}</div>
          <div class="q-mt-xs">{{ $t('index.countdown.minutes') }}</div>
        </div>
        <div class="q-px-md">
          <div class="text-h3 text-weight-bold">{{ countdown.seconds }}</div>
          <div class="q-mt-xs">{{ $t('index.countdown.seconds') }}</div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<style>
.q-card {
  background-color: var(--q-gray-light);
}
</style>
