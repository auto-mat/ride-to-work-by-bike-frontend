// libraries
import { ref, watchEffect, onBeforeUnmount, Ref, ComputedRef } from 'vue';
import { date } from 'quasar';

// types
import { Countdown } from 'src/components/types';

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
      setCountdownValues(timeDifference);
    } else {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    }
  }

  function setCountdownValues(timeDifference: number): void {
    const targetDate = new Date(Date.now() + timeDifference);
    const currentDate = new Date();

    countdown.value = {
      days: date.getDateDiff(targetDate, currentDate, 'days'),
      hours: date.getDateDiff(targetDate, currentDate, 'hours') % 24,
      minutes: date.getDateDiff(targetDate, currentDate, 'minutes') % 60,
      seconds: date.getDateDiff(targetDate, currentDate, 'seconds') % 60,
    };
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
