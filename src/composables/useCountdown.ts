// libraries
import { ref, watchEffect, onBeforeUnmount, Ref, ComputedRef } from 'vue';
import { date } from 'quasar';

// types
import { Countdown } from 'src/components/types';
import { calculateCountdownIntervals } from '../utils';

export const useCountdown = (
  releaseDate: ComputedRef<string>,
): { countdown: Ref<Countdown> } => {
  const countdown = ref<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  let countdownInterval: NodeJS.Timeout | null = null;

  const startCountdown = (): void => {
    // Clear any existing interval
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    // Validate the date string
    if (!releaseDate.value || !date.isValid(releaseDate.value)) {
      countdown.value = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
      return;
    }

    const targetDate = new Date(releaseDate.value).getTime();

    countdownInterval = setInterval((): void => {
      const now = new Date().getTime();
      const timeDifference = getTimeDifference(now, targetDate);

      computeCountdownInterval(timeDifference, countdownInterval);
    }, 1000);
  };

  function getTimeDifference(now: number, date: number): number {
    return date - now;
  }

  function computeCountdownInterval(
    timeDifference: number,
    countdownInterval: NodeJS.Timeout | null,
  ): void {
    if (timeDifference > 0) {
      countdown.value = calculateCountdownIntervals(timeDifference);
    } else {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    }
  }

  // watch for changes in releaseDate and restart countdown
  watchEffect((): void => {
    startCountdown();
  });

  onBeforeUnmount((): void => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  });

  return { countdown };
};
