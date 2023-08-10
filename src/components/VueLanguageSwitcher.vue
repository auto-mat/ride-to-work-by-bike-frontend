<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueLanguageSwitcher',
  setup() {
    return {};
  },
});
</script>

<template>
  <ul
    class="language-list flex items-center text-subtitle1 gap-24"
    data-cy="footer-language-switcher"
  >
    <li
      v-for="item in Object.keys($i18n.messages)"
      :key="item"
      class="text-uppercase"
      :data-cy="'switcher-' + item"
    >
      <a
        href="#"
        @click.prevent="$i18n.locale = item"
        class="text-white"
        :class="{ 'text-bold': item === $i18n.locale }"
      >
        {{ item }}
      </a>
    </li>
  </ul>
</template>

<style scoped>
.language-list {
  list-style: none;
  font-size: 14px;
  padding-left: 0;
  padding-inline-start: 0;
}
.language-list a {
  text-decoration: none;
}
</style>
