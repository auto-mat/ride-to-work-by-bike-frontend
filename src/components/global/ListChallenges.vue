<script lang="ts">
/**
 * ListChallenges Component
 *
 * @description * Use this component to display a list of company challenges.
 *
 * @components
 * - `DialogDefault`: Component to display a dialog window.
 * - `SectionHeading`: Component to display a section heading.
 * - `SectionColumns`: Component to layout content in columns.
 * - `TableChallengeResults`: Component to display competition results.
 *
 * @example
 * <list-challenges />
 */

// libraries
import { colors } from 'quasar';
import { computed, defineComponent, inject, ref, watch } from 'vue';

// components
import DialogDefault from './DialogDefault.vue';
import SectionHeading from './SectionHeading.vue';
import SectionColumns from '../homepage/SectionColumns.vue';
import TableChallengeResults from '../results/TableChallengeResults.vue';

// composables
import { i18n } from 'src/boot/i18n';
import { useApiGetCompetitionResults } from '../../composables/useApiGetCompetitionResults';
import { useRoutes } from '../../composables/useRoutes';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useAdminCompetitionStore } from '../..//stores/adminCompetition';

// enums
import { CompetitionType, CompetitorType } from '../enums/Challenge';

// types
import type { Competition } from '../types/Competition';
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'ListChallenges',
  components: {
    DialogDefault,
    SectionHeading,
    SectionColumns,
    TableChallengeResults,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const adminCompetitionStore = useAdminCompetitionStore();
    const competitions = computed(() => adminCompetitionStore.getCompetitions);

    const { getRouteIcon } = useRoutes();

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    const { getPaletteColor, changeAlpha } = colors;
    const primary = getPaletteColor('primary');
    const primaryOpacity = changeAlpha(
      primary,
      rideToWorkByBikeConfig.colorPrimaryOpacity,
    );

    const { results, isLoading, loadCompetitionResults } =
      useApiGetCompetitionResults(logger);

    const isDialogOpen = ref(false);
    const selectedCompetition = ref<Competition | null>(null);

    watch(isDialogOpen, (opened) => {
      if (!opened) {
        results.value = [];
      }
    });

    const openResultsDialog = (competition: Competition): void => {
      selectedCompetition.value = competition;
      isDialogOpen.value = true;
      loadCompetitionResults(competition.slug);
    };

    const getCompetitionTypeLabel = (competition: Competition): string => {
      const labelMap: Record<CompetitionType, string> = {
        [CompetitionType.frequency]: i18n.global.t(
          'index.cardListChallenge.chipCompetitionTypeFrequency',
        ),
        [CompetitionType.length]: i18n.global.t(
          'index.cardListChallenge.chipCompetitionTypeLength',
        ),
      };
      return labelMap[competition.competition_type];
    };

    const getCompetitorTypeLabel = (competition: Competition): string => {
      const labelMap: Record<CompetitorType, string> = {
        [CompetitorType.singleUser]: i18n.global.t(
          'index.cardListChallenge.chipCompetitorTypeSingleUser',
        ),
        [CompetitorType.team]: i18n.global.t(
          'index.cardListChallenge.chipCompetitorTypeTeam',
        ),
        [CompetitorType.subsidiary]: i18n.global.t(
          'index.cardListChallenge.chipCompetitorTypeSubsidiary',
        ),
      };
      return labelMap[competition.competitor_type];
    };

    return {
      borderRadius,
      competitions,
      getCompetitionTypeLabel,
      getCompetitorTypeLabel,
      isDialogOpen,
      isLoading,
      openResultsDialog,
      primaryOpacity,
      results,
      selectedCompetition,
      getRouteIcon,
    };
  },
});
</script>

<template>
  <div>
    <section-heading class="q-mt-xl q-mb-md" data-cy="list-challenges-title">
      {{ $t('index.cardListChallenge.title') }}
    </section-heading>
    <!-- Empty state -->
    <div
      v-if="competitions.length === 0"
      class="q-mt-lg q-mb-xl text-grey-7"
      data-cy="list-challenges-empty-state"
    >
      {{ $t('index.cardListChallenge.emptyState') }}
    </div>
    <!-- Cards -->
    <section-columns
      v-else
      :columns="3"
      class="q-col-gutter-lg"
      data-cy="list-challenges-list"
    >
      <q-card
        v-for="competition in competitions"
        :key="competition.id"
        class="full-height"
        :style="{ 'border-radius': borderRadius }"
        flat
        bordered
        data-cy="list-challenges-card"
      >
        <q-card-section horizontal class="bg-primary text-white">
          <q-card-section class="q-pt-xs">
            <div
              v-if="competition.name"
              class="text-h6 q-mt-sm"
              data-cy="list-challenges-name"
            >
              {{ competition.name }}
            </div>
            <div
              v-if="competition.description"
              class="q-mt-xs text-caption text-grey-4"
              data-cy="list-challenges-description"
            >
              {{ competition.description }}
            </div>
          </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <!-- Chips: competition type and competitor type -->
          <div class="flex gap-8">
            <q-chip
              outline
              size="sm"
              class="q-ma-none"
              color="grey-8"
              data-cy="list-challenges-chip-competition-type"
            >
              {{ getCompetitionTypeLabel(competition) }}
            </q-chip>
            <q-chip
              outline
              size="sm"
              color="grey-8"
              class="q-ma-none"
              data-cy="list-challenges-chip-competitor-type"
            >
              {{ getCompetitorTypeLabel(competition) }}
            </q-chip>
          </div>
          <div class="flex gap-8 q-mt-md">
            <q-icon
              v-for="transportType in competition.commute_modes"
              :key="transportType.slug"
              :name="getRouteIcon(transportType.slug)"
              size="18px"
              color="grey-10"
              :data-cy="`list-challenges-transport-icon-${transportType.slug}`"
            />
          </div>
          <div
            class="text-caption text-weight-medium q-mt-md"
            data-cy="list-challenges-dates"
          >
            <span v-if="competition.date_from && competition.date_to"
              >{{ $t('index.cardChallenge.dates') }}&nbsp;</span
            >
            <span v-if="competition.date_from">
              {{ $d(new Date(competition.date_from), 'numeric') }}
            </span>
            <span v-if="competition.date_from && competition.date_to"> - </span>
            <span v-if="competition.date_to">
              {{ $d(new Date(competition.date_to), 'numeric') }}
            </span>
          </div>
          <!-- Buttons: Show results + More info -->
          <div class="q-mt-md flex items-center gap-8">
            <q-btn
              rounded
              unelevated
              no-caps
              color="primary"
              @click="openResultsDialog(competition)"
              data-cy="list-challenges-button-show-results"
            >
              {{ $t('index.cardListChallenge.buttonShowResults') }}
            </q-btn>
            <q-btn
              v-if="competition.url"
              rounded
              outline
              no-caps
              color="primary"
              :href="competition.url"
              target="_blank"
              data-cy="list-challenges-button-more-info"
            >
              {{ $t('index.cardListChallenge.buttonMoreInfo') }}
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </section-columns>

    <!-- Dialog: Challenge results -->
    <dialog-default
      v-if="selectedCompetition"
      v-model="isDialogOpen"
      data-cy="dialog-challenge-results"
    >
      <template #title>
        <span data-cy="dialog-challenge-results-title">
          {{ selectedCompetition.name }}
        </span>
      </template>
      <template #content>
        <!-- Loading spinner -->
        <div
          v-if="isLoading"
          class="flex flex-center q-pa-lg"
          data-cy="dialog-challenge-results-spinner"
        >
          <q-spinner color="primary" size="3em" />
        </div>
        <!-- Results table -->
        <table-challenge-results
          v-else
          :rows="results"
          :competition-type="selectedCompetition.competition_type"
        />
      </template>
    </dialog-default>
  </div>
</template>
