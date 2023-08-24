<script lang="ts">
// libraries
import { defineComponent, ref, computed } from 'vue';
import { useQuasar } from 'quasar';

import { menuBottom, menuTop } from 'src/mocks/layout';

export default defineComponent({
  name: 'VueFooterPanel',
  setup() {
    const menuPanel = computed(() => {
      return menuTop.slice(0, 4);
    });

    const dialog = ref(false);

    return { dialog, menuPanel, menuBottom, menuTop };
  },
});
</script>

<template>
  <q-toolbar class="lt-lg bg-grey-2 text-gray-10">
    <q-list padding class="w-full flex justify-around text-grey-6">
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
          <q-icon :name="item.icon" size="24px"></q-icon>
          <q-item-label class="text-caption text-grey-10">{{
            $t(`drawerMenu.${item.name}`)
          }}</q-item-label>
        </div>
      </q-item>
      <q-item
        clickable
        v-ripple
        active-class="bottom-sheet-up"
        @click="dialog = true"
        class="q-pa-sm"
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

  <q-dialog v-model="dialog" position="bottom">
    <q-list padding class="bg-white">
      <q-item
        v-for="item in menuTop.slice(4)"
        :key="item.name"
        :to="item.url"
        clickable
        v-ripple
        class="q-pa-sm"
        active-class="text-grey-10"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" size="24px"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-caption text-grey-10">{{
            $t(`drawerMenu.${item.name}`)
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <hr />
      <q-item
        v-for="item in menuBottom"
        :key="item.name"
        :to="item.url"
        clickable
        v-ripple
        class="q-pa-sm items-center"
        active-class="text-grey-10"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" size="24px"></q-icon>
        </q-item-section>
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
