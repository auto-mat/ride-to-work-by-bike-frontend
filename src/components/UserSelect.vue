<script lang="ts">
import { defineComponent } from 'vue';

// mocks
import { user, userMenuTop, userMenuBottom } from 'src/mocks/layout';

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
      :class="[ variant === 'mobile' ? 'dropdown-arrow-hidden' : 'q-pr-md full-width' ]"
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
