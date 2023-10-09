<script lang="ts">
/**
 * LanguageSwitcher Component
 *
 * The `LanguageSwitcher` component provides an interface for users to switch
 * between different languages available in the application.
 *
 * @description
 * This component renders a list of available languages and allows users to
 * switch their preferred language. It uses the `$i18n` global property to
 * manage and retrieve the current language and available translations.
 *
 * @example
 * <language-switcher />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105614&mode=dev)
 */

// libraries
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
