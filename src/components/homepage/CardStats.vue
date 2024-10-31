<script lang="ts">
/**
 * CardStats Component
 *
 * The `CardStats` component is designed to present statistics or metrics
 * in a card format.
 *
 * @description
 * This component presents statistics for a user, team or an organization.
 * Border radius can be controlled by `config` parameter.
 *
 * Note: This component is commonly used within the `ListCardStats`
 * component.
 *
 * @props
 * - `category` (StatisticsCategoryId, required): The category of the stats.
 *
 * @example
 * <card-stats
 *   :category="category"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104243&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { useStats } from '../../composables/useStats';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// enums
import { StatisticsId, StatisticsCategoryId } from '../types/Statistics';

// fixtures
import cityResultsFixture from '../../../test/cypress/fixtures/cityResults.json';
import memberResultsFixture from '../../../test/cypress/fixtures/memberResults.json';
import organizationResultsFixture from '../../../test/cypress/fixtures/organizationResults.json';
import teamResultsFixture from '../../../test/cypress/fixtures/teamResults.json';

// types
import type {
  CityResponse,
  MemberResponse,
  OrganizationResponse,
  ResultsUnion,
  TeamResponse,
} from '../types/Results';
import type { ItemStatistics } from '../types/Statistics';

export default defineComponent({
  name: 'CardStats',
  props: {
    category: {
      type: String as () => StatisticsCategoryId,
      required: true,
    },
  },
  setup(props) {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const {
      getResultStatistics,
      getStatIcon,
      getStatLabel,
      getStatUnit,
      getStatCategoryIcon,
      getStatCategoryLabel,
    } = useStats();

    const memberResults = memberResultsFixture as MemberResponse;
    const teamResults = teamResultsFixture as TeamResponse;
    const organizationResults =
      organizationResultsFixture as OrganizationResponse;
    const cityResults = cityResultsFixture as CityResponse;

    let results = null as ResultsUnion[] | null;
    // get results based on category
    if (
      props.category === StatisticsCategoryId.personal &&
      memberResults.results
    ) {
      results = memberResults.results;
    } else if (
      props.category === StatisticsCategoryId.team &&
      teamResults.results
    ) {
      results = teamResults.results;
    } else if (
      props.category === StatisticsCategoryId.organization &&
      organizationResults.results
    ) {
      results = organizationResults.results;
    } else if (
      props.category === StatisticsCategoryId.city &&
      cityResults.results
    ) {
      results = cityResults.results;
    }

    // get stats
    const stats = computed<ItemStatistics[]>(() =>
      results ? getResultStatistics(results) : [],
    );

    return {
      borderRadius,
      getStatIcon,
      getStatLabel,
      getStatUnit,
      getStatCategoryIcon,
      getStatCategoryLabel,
      StatisticsId,
      stats,
    };
  },
});
</script>

<template>
  <div class="q-pt-lg max-w-420">
    <q-card
      flat
      bordered
      :style="{ 'border-radius': borderRadius }"
      data-cy="card-stats"
    >
      <!-- Card title -->
      <q-card-section class="q-pa-lg">
        <div class="flex gap-16 items-center q-mb-md">
          <!-- Icon -->
          <q-icon
            :name="getStatCategoryIcon(category)"
            size="24px"
            color="primary"
            data-cy="card-stats-icon"
          />
          <!-- Title -->
          <h3
            class="text-body1 text-weight-bold text-primary q-my-none"
            data-cy="card-stats-title"
          >
            {{ getStatCategoryLabel(category) }}
          </h3>
        </div>
        <!-- List stats -->
        <q-list class="q-pa-none">
          <q-item
            v-for="item in stats"
            :key="item.id"
            class="q-px-none text-grey-10"
            data-cy="card-stats-item"
          >
            <q-item-section avatar>
              <!-- Icon -->
              <q-icon
                :name="getStatIcon(item.id)"
                color="primary"
                size="18px"
                data-cy="card-stats-item-icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <!-- Value -->
                <strong class="text-weight-bold" data-cy="card-stats-item-value"
                  >{{ item.value }}&nbsp;</strong
                >
                <!-- Label -->
                <span
                  v-if="getStatUnit(item.id)"
                  class="text-weight-bold"
                  data-cy="card-stats-item-label-unit"
                  v-html="getStatUnit(item.id)"
                />
                <span
                  v-if="getStatLabel(item.id)"
                  data-cy="card-stats-item-label"
                >
                  <span>&nbsp;{{ getStatLabel(item.id) }}</span>
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<style>
.max-w-420 {
  max-width: 420px;
}
</style>
