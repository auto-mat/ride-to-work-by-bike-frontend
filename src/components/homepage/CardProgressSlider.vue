<script lang="ts">
/**
 * CardProgressSlider Component
 *
 * The `CardProgressSlider` component shows a card with circular progress.
 *
 * @description
 * This component takes a card object with progress details and calculates
 * the progress percentage to be displayed. The visual representation is a
 * circular slider showing the current progress relative to the total.
 * Border radius can be controlled by `config` parameter.
 *
 * Note: This component is commonly used within the `SliderProgress`
 * component.
 *
 * @components
 * - `LinearProgressNumbers` - Used to render a linear progress bar with
 *   labels for numbers.
 *
 * @props
 * - `card` (Object, required): The card object containing progress details.
 *   It should be of type `CardProgressType`.
 *
 * @example
 * <card-progress-slider
 *   :card="progressDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A106437&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';
import { useCircleSize } from '../../composables/useCircleSize';

// types
import { CardProgress as CardProgressType } from '../types';

// components
import LinearProgressNumbers from '../global/LinearProgressNumbers.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'CardProgressSlider',
  components: {
    LinearProgressNumbers,
  },
  props: {
    card: {
      type: Object as () => CardProgressType,
      required: true,
    },
  },
  setup() {
    const imageMask = `url(${new URL('../../assets/svg/image-mask.svg', import.meta.url).href})`;

    const { circleSize, trackWidth } = useCircleSize();

    const { borderRadiusCard, colorPrimary, colorPrimaryDark } =
      rideToWorkByBikeConfig;

    return {
      borderRadiusCard,
      circleSize,
      colorPrimary,
      colorPrimaryDark,
      imageMask,
      trackWidth,
    };
  },
});
</script>

<template>
  <q-card
    dark
    flat
    bordered
    :style="{
      'border-radius': borderRadiusCard,
    }"
    class="bg-primary"
    data-cy="card-progress-slider"
  >
    <!-- Card header -->
    <q-card-section
      class="flex items-center justify-between bg-primary q-px-lg gap-16"
      data-cy="card-progress-header"
    >
      <!-- Title with icon -->
      <div class="flex items-center gap-16 text-body1">
        <!-- Card icon -->
        <q-icon :name="card.icon" size="18px" color="white" />
        <!-- Card title -->
        <component
          :is="card.url ? 'a' : 'div'"
          :href="card.url"
          class="text-white text-weight-bold"
          data-cy="card-progress-title"
        >
          <h3 class="text-body1 text-weight-bold q-my-none">
            {{ card.title }}
          </h3>
        </component>
      </div>

      <!-- Timeline (desktop) -->
      <linear-progress-numbers
        :value="card.duration?.current"
        :max="card.duration?.total"
        :label="$t('index.cardProgressSlider.timeline')"
        class="gt-xs"
      />
    </q-card-section>
    <!-- Card body -->
    <q-card-section :style="{ backgroundColor: colorPrimaryDark }">
      <div class="row items-center q-pa-xl" data-cy="card-progress-content">
        <!-- Section progress -->
        <div
          class="col-12 col-sm-6 col-lg-4 flex justify-center justify-sm-start"
          data-cy="card-section-progress"
        >
          <div class="relative-position">
            <!-- Progress bar -->
            <q-circular-progress
              rounded
              :value="card.progress"
              :size="circleSize"
              :thickness="trackWidth"
              color="secondary"
              track-color="blue-grey-8"
              data-cy="card-progress-circular"
            />
            <!-- Progress label -->
            <div class="text-white absolute-center text-center">
              <!-- Caption -->
              <div
                class="text-caption"
                data-cy="card-progress-circular-caption"
              >
                {{ $t('index.cardProgressSlider.toDate') }}
              </div>
              <!-- Number -->
              <div
                class="circular-progress-number q-mt-xs text-weight-bold"
                data-cy="card-progress-circular-number"
              >
                {{ card.progress }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Section stats -->
        <div
          class="col col-sm-6 col-lg-4 flex column gap-16 gt-xs"
          data-cy="card-section-stats"
        >
          <div
            v-for="stat in card.stats"
            :key="stat.title"
            data-cy="card-progress-stats"
          >
            <!-- Title stats -->
            <div
              class="text-uppercase text-caption text-secondary"
              data-cy="card-progress-stats-title"
            >
              {{ stat.title }}
            </div>
            <!-- List stats -->
            <q-list dark dense class="q-mt-sm">
              <q-item
                v-for="item in stat.items"
                :key="item.id"
                class="stats-value"
                style="padding: 0"
              >
                <q-item-section v-if="item.icon" avatar>
                  <q-icon
                    color="primary"
                    :name="item.icon"
                    size="18px"
                    data-cy="card-progress-stats-icon"
                  />
                </q-item-section>

                <q-item-section data-cy="card-progress-stats-value">
                  {{ item.text }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <!-- Section image -->
        <div v-if="$q.screen.gt.md" class="absolute-right col-lg-4 full-height">
          <q-img
            fit="cover"
            position="50% 100%"
            class="full-width full-height"
            src="~@/assets/image/card-progress-slider/bike.webp"
            :img-style="{
              maskImage: imageMask,
              maskRepeat: 'no-repeat',
              maskSize: 'contain',
            }"
          />
        </div>
      </div>
    </q-card-section>
    <!-- Card footer (mobile) -->
    <q-separator v-if="$q.screen.lt.sm" color="blue-grey-8" />
    <q-card-section
      v-if="$q.screen.lt.sm"
      :style="{ backgroundColor: colorPrimaryDark }"
      data-cy="card-progress-footer-mobile"
    >
      <!-- Timeline (mobile) -->
      <linear-progress-numbers
        :value="card.duration?.current"
        :max="card.duration?.total"
        :label="$t('index.cardProgressSlider.timeline')"
      />
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.justify-sm-start {
  @media (min-width: $breakpoint-sm-min) {
    justify-content: flex-start;
  }
}
</style>
