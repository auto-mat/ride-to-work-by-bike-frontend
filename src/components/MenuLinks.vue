<script lang="ts">
import { defineComponent, computed } from 'vue';

// mocks
import { socialLinks, usefulLinks } from 'src/mocks/layout';

// Component used inside the Help Dialog window to show buttons with various outbound links
// Internal Figma link: https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103859&mode=design&t=5BJSgOjKefPXcv0w-1
export default defineComponent({
  name: 'MenuLinks',
  props: {
    title: {
      type: String,
    },
    variant: {
      type: String as () => 'social' | 'useful',
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
