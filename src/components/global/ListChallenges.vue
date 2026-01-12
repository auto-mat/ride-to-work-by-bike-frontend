<script lang="ts">
/**
 * ListChallenges Component
 *
 * @description * Use this component to display a list of company challenges.
 *
 * @components
 * - `SectionHeading`: Component to display a section heading.
 * - `SectionColumns`: Component to layout content in columns.
 *
 * @example
 * <list-challenges />
 */

// libraries
import { colors } from 'quasar';
import { computed, defineComponent } from 'vue';

// components
import SectionHeading from './SectionHeading.vue';
import SectionColumns from '../homepage/SectionColumns.vue';

// composables
import { useRoutes } from '../../composables/useRoutes';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useAdminCompetitionStore } from '../..//stores/adminCompetition';

export default defineComponent({
  name: 'ListChallenges',
  components: {
    SectionHeading,
    SectionColumns,
  },
  setup() {
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

    return {
      borderRadius,
      competitions,
      primaryOpacity,
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
    <!-- Cards -->
    <section-columns
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
      >
        <q-card-section horizontal class="bg-primary text-white">
          <q-card-section class="q-pt-xs">
            <div v-if="competition.name" class="text-h6 q-mt-sm">
              {{ competition.name }}
            </div>
            <div
              v-if="competition.description"
              class="q-mt-xs text-caption text-grey-4"
            >
              {{ competition.description }}
            </div>
          </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption text-weight-medium">
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
          <div class="flex gap-8 q-mt-md">
            <q-icon
              v-for="transportType in competition.commute_modes"
              :key="transportType.slug"
              :name="getRouteIcon(transportType.slug)"
              size="18px"
              color="grey-10"
              :data-cy="`list-challenges-transport-icon-${transportType}`"
            />
          </div>
        </q-card-section>
      </q-card>
    </section-columns>
  </div>
</template>
