<script lang="ts">
import { defineComponent } from 'vue';

// mocks
import { menuBottom, menuTop } from 'src/mocks/layout';

export default defineComponent({
  name: 'VueDrawerMenu',
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
    <q-item v-for="item in menuTop" :key="item.name" :to="item.url" class="flex items-center gap-8" clickable>
      <q-icon :name="item.icon" size="xs"></q-icon>
      {{ $t(`drawerMenu.${item.name}`) }}
    </q-item>
    <hr class="hr-blue-gray-2" />
    <q-item v-for="item in menuBottom" :key="item.name" :to="item.url" class="flex items-center gap-8" clickable>
      <q-icon :name="item.icon" size="xs"></q-icon>
      {{ $t(`drawerMenu.${item.name}`) }}
    </q-item>
  </q-list>
</template>

<style scoped lang="scss">
.gap-8 {
  gap: 8px;
}

.q-item .q-icon {
  color: $blue-grey-4;
}

.q-router-link--active {
  color: $blue-grey-10;
}

.q-router-link--active .q-icon {
  color: $blue-grey-10;
}

.hr-blue-gray-2 {
  border-top: 1px solid $blue-grey-2;
}
</style>
