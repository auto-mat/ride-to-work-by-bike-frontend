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
 * <routes-calendar-navigation />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=8279-39418&t=baRxKn3ERzsqCVyl-1)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RoutesCalendarNavigation',
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

    return {
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
    data-cy="routes-calendar-navigation"
  >
    <!-- Button: today -->
    <q-btn
      unelevated
      rounded
      color="primary"
      :label="$t('time.today')"
      @click="onToday"
      data-cy="routes-calendar-navigation-today"
    />
    <div class="flex gap-8">
      <!-- Button: previous -->
      <q-btn
        unelevated
        round
        outline
        size="12px"
        @click="onPrev"
        data-cy="routes-calendar-navigation-previous"
      >
        <q-icon
          name="arrow_back"
          size="18px"
          data-cy="routes-calendar-navigation-prev"
        />
      </q-btn>
      <!-- Button: next -->
      <q-btn
        unelevated
        round
        outline
        size="12px"
        @click="onNext"
        data-cy="routes-calendar-navigation-next"
      >
        <q-icon
          name="arrow_forward"
          size="18px"
          data-cy="routes-calendar-navigation-next"
        />
      </q-btn>
    </div>
  </div>
</template>
