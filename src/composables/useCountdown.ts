// libraries
import { ref, watchEffect, onBeforeUnmount, Ref } from 'vue';

// types
import { Countdown } from 'src/components/types';

export const useCountdown = (releaseDate: string): { countdown: Ref<Countdown> } => {
  const countdown = ref<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  let countdownInterval: ReturnType<typeof setInterval> | null = null;

  const startCountdown = () => {
    const targetDate = new Date(releaseDate).getTime();

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

  return { countdown };

}
