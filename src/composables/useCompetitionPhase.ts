// libraries
import { computed, onBeforeUnmount, ref } from 'vue';
import { date } from 'quasar';

// stores
import { useChallengeStore } from '@/stores/challenge';

// types
import type { Ref } from 'vue';

/**
 * Computes competition/entry phase states and dates
 * @returns {
 *  isBeforeCompetitionStart: Ref<boolean> - True if before competition starts
 *  isAfterEntryPhaseEnd: Ref<boolean> - True if after competition ends
 *  competitionStart: Ref<string> - The competition start date string
 *  entryPhaseEnd: Ref<string> - The competition end date string
 * }
 */
export function useCompetitionPhase(): {
  isBeforeCompetitionStart: Ref<boolean>;
  isAfterEntryPhaseEnd: Ref<boolean>;
  competitionStart: Ref<string>;
  entryPhaseEnd: Ref<string>;
} {
  const checkInterval = 5000;
  const challengeStore = useChallengeStore();
  const currentTime = ref<Date>(new Date());
  const isBeforeCompetitionStart = ref<boolean>(false);
  const isAfterEntryPhaseEnd = ref<boolean>(false);
  const timeInterval = ref<NodeJS.Timeout>();

  const competitionStart = computed<string>(
    (): string => challengeStore.getCompetitionStart,
  );

  const entryPhaseEnd = computed<string>(
    (): string => challengeStore.getEntryPhaseEnd,
  );

  const updateTimeCheck = (): void => {
    currentTime.value = new Date();
    // update phase states based on current time
    if (
      !competitionStart.value ||
      !date.isValid(competitionStart.value) ||
      !entryPhaseEnd.value ||
      !date.isValid(entryPhaseEnd.value)
    ) {
      clearInterval(timeInterval.value);
      return;
    }
    const competitionStartDate = new Date(competitionStart.value);
    const competitionEndDate = new Date(entryPhaseEnd.value);
    isBeforeCompetitionStart.value = currentTime.value < competitionStartDate;
    isAfterEntryPhaseEnd.value = currentTime.value > competitionEndDate;
    // clear interval if we're past competition end
    if (currentTime.value >= competitionEndDate) {
      clearInterval(timeInterval.value);
    }
  };

  // run immediately to set initial state
  updateTimeCheck();
  // set up interval
  timeInterval.value = setInterval(updateTimeCheck, checkInterval);
  onBeforeUnmount(() => {
    clearInterval(timeInterval.value);
  });

  return {
    isBeforeCompetitionStart,
    isAfterEntryPhaseEnd,
    competitionStart,
    entryPhaseEnd,
  };
}
