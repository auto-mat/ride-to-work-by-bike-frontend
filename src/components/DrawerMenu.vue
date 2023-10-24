<script lang="ts">
/**
 * DrawerMenu Component
 *
 * The `DrawerMenu` component renders a list of menu items for a drawer or
 * sidebar navigation. The menu items are divided into top and bottom sections.
 *
 * @description
 * This component uses shows two menu sections.
 * Each menu item consists of an icon and a text label, and they are
 * displayed in a list format.
 *
 * @data
 * - `menuTop`: Array of menu items to be displayed at the top section.
 * - `menuBottom`: Array of menu items to be displayed at the bottom section.
 *
 * @example
 * <drawer-menu />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5753%3A124675&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// mocks
import { menuBottom, menuTop } from '../mocks/layout';

export default defineComponent({
  name: 'DrawerMenu',
  setup() {
    return {
      menuTop,
      menuBottom,
    };
  },
});
</script>

<template>
  <q-list>
    <!-- Menu: Top items -->
    <q-item
      v-for="item in menuTop"
      :key="item.name"
      :to="item.url"
      active-class="menu-active-item"
      class="flex items-center"
      clickable
    >
      <!-- Link icon -->
      <q-icon :name="item.icon" size="xs" color="blue-grey-4" class="q-mr-sm" />
      <!-- Link text -->
      {{ $t(`drawerMenu.${item.name}`) }}
    </q-item>

    <q-separator color="blue-grey-2 q-my-sm" />

    <!-- Menu: Bottom items -->
    <q-item
      v-for="item in menuBottom"
      :key="item.name"
      :to="item.url"
      class="flex items-center"
      clickable
    >
      <!-- Link icon -->
      <q-icon :name="item.icon" size="xs" color="blue-grey-4" class="q-mr-sm" />
      <!-- Link text -->
      {{ $t(`drawerMenu.${item.name}`) }}
    </q-item>
  </q-list>
</template>

<style scoped lang="scss">
.menu-active-item,
.menu-active-item .q-icon {
  color: $blue-grey-10 !important;
}
</style>
