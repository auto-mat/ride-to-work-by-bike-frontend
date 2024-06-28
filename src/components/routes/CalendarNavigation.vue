<script lang="ts">
/**
 * RoutesCalendarNavigation Component
 *
 * @description * Use this component to render navigation buttons for calendar..
 *
 * @events
 * - `next`: Move to next page.
 * - `prev`: Move to previous page.
 * - `today`: Move to today.
 *
 * @example
 * <calendar-navigation />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8279-39418&t=baRxKn3ERzsqCVyl-1)
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'CalendarNavigation',
  emits: ['next', 'prev', 'today'],
  setup(props, { emit }) {
    const onToday = () => {
      emit('today');
    };

    const onNext = () => {
      emit('next');
    };

    const onPrev = () => {
      emit('prev');
    };

    const borderRadius = rideToWorkByBikeConfig.borderRadiusButtonSmall;

    return {
      borderRadius,
      onToday,
      onNext,
      onPrev,
    };
  },
});
</script>

<template>
  <div
    class="row flex items-center justify-end gap-16"
    data-cy="calendar-navigation"
  >
    <!-- Button: today -->
    <q-btn
      unelevated
      rounded
      color="indigo-2"
      text-color="primary"
      :label="$t('time.today')"
      @click="onToday"
      data-cy="calendar-navigation-today"
      :style="{ 'border-radius': borderRadius }"
    />
    <div class="flex gap-8">
      <!-- Button: previous -->
      <q-btn
        unelevated
        round
        outline
        size="12px"
        color="primary"
        @click="onPrev"
        data-cy="calendar-navigation-previous"
      >
        <q-icon
          name="arrow_back"
          color="primary"
          size="18px"
          data-cy="calendar-navigation-prev"
        />
      </q-btn>
      <!-- Button: next -->
      <q-btn
        unelevated
        round
        outline
        size="12px"
        color="primary"
        @click="onNext"
        data-cy="calendar-navigation-next"
      >
        <q-icon
          name="arrow_forward"
          color="primary"
          size="18px"
          data-cy="calendar-navigation-next"
        />
      </q-btn>
    </div>
  </div>
</template>
