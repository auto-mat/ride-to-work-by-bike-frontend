<script lang="ts">
/**
 * UserSelect Component
 *
 * The `UserSelect` component provides a dropdown for user-specific
 * actions and settings.
 *
 * @description
 * This component renders a dropdown select (on desktop) and
 * a user avatar (on mobile). These elements trigger dropdown menu.
 * Items in menu are sourced from predefined mock data.
 *
 * @props
 * - `variant` (String: 'mobile' | 'desktop', default: 'desktop'):
 *   Determines the display style of the component.
 *
 * @example
 * <user-select variant="desktop" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103890&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// mocks
import { user, userMenuTop, userMenuBottom } from '../mocks/layout';

export default defineComponent({
  name: 'UserSelect',
  props: {
    variant: {
      type: String as () => 'mobile' | 'desktop',
      required: false,
      default: 'desktop',
    },
  },
  setup(props) {
    const size = props.variant === 'mobile' ? '32px' : '56px';

    return {
      size,
      user,
      menuTop: userMenuTop,
      menuBottom: userMenuBottom,
    };
  },
});
</script>

<template>
  <div class="user-select" data-cy="user-select">
    <!-- User dropdown -->
    <q-btn-dropdown
      rounded
      flat
      class="bg-blue-grey-2 q-px-none q-py-none"
      :class="[
        variant === 'mobile' ? 'dropdown-arrow-hidden' : 'q-pr-md full-width',
      ]"
      data-cy="user-select-input"
    >
      <template v-slot:label>
        <!-- User image -->
        <q-avatar :size="size" data-cy="avatar">
          <q-img :src="user.image.src" :alt="user.image.alt" :size="size" />
        </q-avatar>
        <!-- User name -->
        <span
          v-if="variant !== 'mobile'"
          class="col-grow inline-block text-left q-ml-md"
        >
          {{ user.label }}
        </span>
      </template>
      <!-- User menu: Top -->
      <q-list bordered>
        <q-item
          v-for="option in menuTop"
          :key="option.title"
          tag="a"
          :to="option.url"
          clickable
          v-close-popup
          class="text-grey-10"
        >
          <q-item-label class="flex items-center">{{
            option.title
          }}</q-item-label>
        </q-item>
      </q-list>
      <q-separator color="blue-grey-2" />
      <!-- User menu: Bottom -->
      <q-list>
        <q-item
          v-for="option in menuBottom"
          :key="option.title"
          tag="a"
          :to="option.url"
          clickable
          v-close-popup
          class="text-grey-10"
        >
          <q-item-label class="flex items-center">{{
            option.title
          }}</q-item-label>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<style scoped lang="scss">
// hide button edges overlapping the avatar (when height = 32px)
.q-btn-dropdown {
  min-height: 0;
}
// hide dropdown arrow for mobile variant
.dropdown-arrow-hidden :deep(.q-btn-dropdown__arrow) {
  display: none;
}
</style>
