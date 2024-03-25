<script lang="ts">
/**
 * DrawerToggleButtons Component
 *
 * @description * Use this component to render a toggle button group in sidebar
 * drawer.
 *
 * Note: This component is used in `MainLayout`.
 *
 * @example
 * <drawer-toggle-buttons />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104166&mode=dev)
 */

// libraries
import { defineComponent, ref } from 'vue';

// composables
import { i18n } from '../../boot/i18n';

// types
import type { FormOption } from '../types/Form';

export default defineComponent({
  name: 'DrawerToggleButtons',
  setup() {
    const model = ref('participation');
    const options: FormOption[] = [
      {
        label: i18n.global.t('drawerMenu.buttonParticipation'),
        value: 'participation',
      },
      {
        label: i18n.global.t('drawerMenu.buttonCityAdministration'),
        value: 'city-management',
      },
    ];

    return {
      model,
      options,
    };
  },
});
</script>

<template>
  <q-btn-toggle
    v-model="model"
    no-caps
    rounded
    unelevated
    toggle-color="primary"
    color="white"
    text-color="primary"
    :options="options"
    data-cy="drawer-toggle-buttons"
  />
</template>
