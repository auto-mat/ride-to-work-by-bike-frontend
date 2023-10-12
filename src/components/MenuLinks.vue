<script lang="ts">
/**
 * MenuLinks Component
 *
 * The `MenuLinks` component is used inside the Help Dialog window to
 * show buttons with various outbound links.
 *
 * @description
 * This component displays a list of links based on the specified variant
 * (either social or useful links). The links are sourced from predefined
 * mock data.
 *
 * @props
 * - `title` (String, required): The heading or title for the list of links.
 * - `variant` (String: 'social' | 'useful', required): Determines the type of links
 *   to display.
 *
 * @example
 * <menu-links :title="linkTitle" variant="social" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103853&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// mocks
import { socialLinks, usefulLinks } from 'src/mocks/layout';

export default defineComponent({
  name: 'MenuLinks',
  props: {
    title: {
      type: String,
      required: true,
    },
    variant: {
      type: String as () => 'social' | 'useful',
      required: true,
    },
  },
  setup(props) {
    const items = computed(() => {
      if (props.variant === 'social') {
        return socialLinks;
      }
      if (props.variant === 'useful') {
        return usefulLinks;
      }
      return [];
    });

    return {
      items,
    };
  },
});
</script>

<template>
  <div class="q-px-md q-mt-xl">
    <!-- Btns group title -->
    <h4 class="text-h5 text-weight-bold q-my-none" data-cy="title-menu-links">
      {{ title }}
    </h4>
    <div class="flex flex-wrap gap-x-24" data-cy="menu-links-list">
      <!-- Button -->
      <q-btn
        v-for="item in items"
        rounded
        no-caps
        unelevated
        :key="item.title"
        :href="item.url"
        color="blue-grey-1"
        class="q-btn-underline text-body2 q-mt-md"
        data-cy="button-menu-links"
      >
        <!-- Icon -->
        <q-icon :name="item.icon" size="xs" color="blue-grey-3"></q-icon>
        <!-- Label -->
        <span class="inline-block text-black q-pl-sm">{{ item.title }}</span>
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gap-x-24 {
  column-gap: 24px;
}

.q-btn {
  &.q-btn-underline {
    span {
      text-decoration: underline;
    }
    &:hover {
      span {
        text-decoration: none;
      }
    }
  }
}
</style>
