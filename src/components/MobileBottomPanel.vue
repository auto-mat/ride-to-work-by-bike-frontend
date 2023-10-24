<script lang="ts">
/**
 * MobileBottomPanel Component
 *
 * The `MobileBottomPanel` component renders a bottom navigation panel
 * for mobile viewports.
 *
 * @description
 * This component provides a toolbar at the bottom of the viewport,
 * featuring menu links. The menu items are sourced from
 * predefined mock data.
 *
 * @example
 * <mobile-bottom-panel />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=1653%3A20591&mode=dev)
 */

// libraries
import { defineComponent, ref, computed } from 'vue';

// types
import { Link } from 'components/types';

// mocks
import { menuBottom, menuTop } from '../mocks/layout';

export default defineComponent({
  name: 'MobileBottomPanel',
  setup() {
    const menuPanel = computed((): Link[] => {
      return menuTop.slice(0, 4);
    });

    const isDialogOpen = ref(false);

    return { isDialogOpen, menuPanel, menuBottom, menuTop };
  },
});
</script>

<template>
  <q-toolbar
    class="lt-md bg-grey-2 text-gray-10 fixed-bottom"
    style="z-index: 1000"
    data-cy="footer-panel"
  >
    <!-- Panel menu -->
    <q-list
      padding
      class="w-full flex justify-around text-grey-6"
      data-cy="footer-panel-menu"
    >
      <!-- Top menu (first 4 items) -->
      <q-item
        v-for="item in menuPanel"
        :key="item.name"
        :to="item.url"
        clickable
        v-ripple
        class="q-pa-sm"
        active-class="text-grey-10"
      >
        <div class="text-center">
          <!-- Icon -->
          <q-icon :name="item.icon" size="24px"></q-icon>
          <!-- Label -->
          <q-item-label class="text-caption text-grey-10">{{
            $t(`drawerMenu.${item.name}`)
          }}</q-item-label>
        </div>
      </q-item>

      <!-- Button show menu -->
      <q-item
        clickable
        v-ripple
        active-class="bottom-sheet-up"
        @click="isDialogOpen = true"
        class="q-pa-sm"
        data-cy="footer-panel-menu-hamburger"
      >
        <div class="text-center">
          <q-icon name="menu" size="24px"></q-icon>
          <q-item-label class="text-caption text-grey-10">{{
            $t('drawerMenu.more')
          }}</q-item-label>
        </div>
      </q-item>
    </q-list>
  </q-toolbar>

  <!-- Dialog -->
  <q-dialog
    v-model="isDialogOpen"
    position="bottom"
    data-cy="footer-panel-menu-dialog"
  >
    <!-- Dialog menu -->
    <q-list padding class="bg-white w-full">
      <!-- Top menu (remaining items) -->
      <q-item
        v-for="item in menuTop.slice(4)"
        :key="item.name"
        :to="item.url"
        clickable
        v-ripple
        class="q-py-sm q-px-md"
        active-class="text-grey-10"
      >
        <!-- Icon -->
        <q-item-section avatar>
          <q-icon :name="item.icon" size="24px" color="grey-6"></q-icon>
        </q-item-section>
        <!-- Label -->
        <q-item-section>
          <q-item-label class="text-caption text-grey-10">{{
            $t(`drawerMenu.${item.name}`)
          }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <!-- Bottom menu items -->
      <q-item
        v-for="item in menuBottom"
        :key="item.name"
        :to="item.url"
        clickable
        v-ripple
        class="q-py-sm q-px-md items-center"
        active-class="text-grey-10"
      >
        <!-- Icon -->
        <q-item-section avatar>
          <q-icon :name="item.icon" size="24px" color="grey-6"></q-icon>
        </q-item-section>
        <!-- Label -->
        <q-item-section>
          <q-item-label class="text-caption text-grey-10">{{
            $t(`drawerMenu.${item.name}`)
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-dialog>
</template>

<style scoped lang="scss">
.w-full {
  width: 100%;
}
</style>
