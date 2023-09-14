<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LanguageSwitcher',
});
</script>

<template>
  <ul
    class="language-list flex items-center text-subtitle1"
    data-cy="footer-language-switcher"
  >
    <!-- Language switcher items -->
    <li
      v-for="item in Object.keys($i18n.messages)"
      :key="item"
      class="text-uppercase"
      :data-cy="'switcher-' + item"
    >
      <q-btn
        flat
        round
        @click.prevent="$i18n.locale = item"
        class="text-white"
        :class="{ 'text-bold': item === $i18n.locale }"
      >
        {{ item }}
      </q-btn>
    </li>
  </ul>
</template>

<style scoped>
.language-list {
  list-style: none;
  font-size: 14px;
  padding-inline-start: 0;
}
</style>
