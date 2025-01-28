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
 *
 * @props
 * - `items: (Link[], required) - Array of menu items to be displayed.
 *
 * @example
 * <drawer-menu :items="menu" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5753%3A124675&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// types
import { Link } from '../types';

export default defineComponent({
  name: 'DrawerMenu',
  props: {
    items: {
      type: Array as () => Link[],
      required: true,
    },
  },
});
</script>

<template>
  <q-list class="bg-primary">
    <!-- Menu: Top items -->
    <q-item
      v-for="item in items"
      :key="item.name"
      dark
      clickable
      :to="item.disabled ? '' : item.url"
      :disable="item.disabled"
      v-bind="{
        ...(item.href ? { href: item.href } : {}),
        ...(item.href ? { target: '_blank' } : {}),
      }"
      active-class="menu-active-item"
      class="flex text-body1 items-center q-px-lg"
      data-cy="drawer-menu-item"
    >
      <!-- Link icon -->
      <q-icon
        :name="item.icon"
        size="18px"
        color="grey-4"
        class="q-mr-md"
        data-cy="drawer-menu-item-icon"
      />
      <!-- Link text -->
      {{ $t(`drawerMenu.${item.title}`) }}
    </q-item>
  </q-list>
</template>

<style scoped lang="scss">
.menu-active-item {
  font-weight: 700;
}
.menu-active-item,
.menu-active-item .q-icon {
  color: $white !important;
}
</style>
