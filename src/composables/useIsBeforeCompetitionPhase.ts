// libraries
import { computed, onBeforeUnmount, ref } from 'vue';
import { date } from 'quasar';

// stores
import { useChallengeStore } from 'src/stores/challenge';

// types
import type { Ref } from 'vue';

export function useIsBeforeCompetitionPhase(): {
  isBeforeCompetitionStart: Ref<boolean>;
  competitionStart: Ref<string>;
} {
  const challengeStore = useChallengeStore();
  const currentTime = ref<Date>(new Date());
  const isBeforeCompetitionStart = ref<boolean>(false);
  const timeInterval = ref<NodeJS.Timeout>();

  const competitionStart = computed<string>(
    (): string => challengeStore.getCompetitionStart,
  );

  const updateTimeCheck = (): void => {
    currentTime.value = new Date();
    // update isBeforeCompetitionStart based on current time
    if (!competitionStart.value || !date.isValid(competitionStart.value)) {
      clearInterval(timeInterval.value);
      return;
    }
    const competitionStartDate = new Date(competitionStart.value);
    isBeforeCompetitionStart.value = currentTime.value < competitionStartDate;
    // clear interval if we're past competition start
    if (currentTime.value >= competitionStartDate) {
      clearInterval(timeInterval.value);
    }
  };

  // run immediately to set initial state
  updateTimeCheck();
  // set up interval
  timeInterval.value = setInterval(updateTimeCheck, 5000);
  onBeforeUnmount(() => {
    clearInterval(timeInterval.value);
  });

  return { isBeforeCompetitionStart, competitionStart };
}
