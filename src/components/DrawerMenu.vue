<script lang="ts">
import { defineComponent } from 'vue';

// mocks
import { menuBottom, menuTop } from 'src/mocks/layout';

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
.menu-active-item {
  color: $blue-grey-10 !important;
}

.menu-active-item .q-icon {
  color: $blue-grey-10 !important;
}
</style>
