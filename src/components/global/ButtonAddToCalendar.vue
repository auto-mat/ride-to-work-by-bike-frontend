<script lang="ts">
/**
 * ButtonAddToCalendar Component
 *
 * The `ButtonAddToCalendar`
 *
 * @description * Use this component to render an add to calendar button.
 *
 * Note: This component is commonly used in `CardEvent`.
 *
 * @events
 * - `select`: Emits when user selects one of the options.
 *
 * @example
 * <button-add-to-calendar />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104730&mode=dev)
 */

import { defineComponent } from 'vue';
import { i18n } from 'src/boot/i18n';

// types
import type { ItemCalendarType } from '../types';

export default defineComponent({
  name: 'ButtonAddToCalendar',
  emits: ['select'],
  setup(props, { emit }) {
    const optionsCalendar: ItemCalendarType[] = [
      {
        id: 'apple',
        icon: 'apple',
        url: '#',
        label: i18n.global.t('calendar.calendarApple'),
      },
      {
        id: 'google',
        icon: 'google',
        url: '#',
        label: i18n.global.t('calendar.calendarGoogle'),
      },
      {
        id: 'microsoft',
        icon: 'windows',
        url: '#',
        label: i18n.global.t('calendar.calendarMicrosoft'),
      },
      {
        id: 'outlook',
        icon: 'picture',
        url: '#',
        label: i18n.global.t('calendar.calendarOutlook'),
      },
      {
        id: 'yahoo',
        icon: 'yahoo',
        url: '#',
        label: i18n.global.t('calendar.calendarYahoo'),
      },
      {
        id: 'other',
        icon: 'calendar',
        url: '#',
        label: i18n.global.t('calendar.calendarOther'),
      },
    ];

    const onItemClick = () => {
      // add to calendar
      emit('select');
    };

    return {
      optionsCalendar,
      onItemClick,
    };
  },
});
</script>

<template>
  <q-btn-dropdown color="black" unelevated rounded data-cy="dialog-button">
    <template v-slot:label>
      <div class="flex items-center no-wrap">
        <q-icon left name="fa-solid fa-calendar-plus" size="xs" />
        <div class="text-center">
          {{ $t('index.cardEvent.addToCalendar') }}
        </div>
      </div>
    </template>
    <q-list>
      <q-item
        v-for="option in optionsCalendar"
        :key="option.id"
        clickable
        v-close-popup
        @click="onItemClick()"
      >
        <q-item-section>
          <q-item-label>{{ option.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
