<script lang="ts">
import { defineComponent } from 'vue';

// mocks
import { user, userMenuTop, userMenuBottom } from 'src/mocks/layout';

export default defineComponent({
  name: 'VueUserSelect',
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
    <q-btn-dropdown
      rounded
      flat
      class="user-dropdown"
      :class="{ mobile: variant === 'mobile' }"
      data-cy="user-select-input"
    >
      <template v-slot:label>
        <q-avatar :size="size" data-cy="avatar">
          <img :src="user.image" />
        </q-avatar>
        <span
          v-if="variant !== 'mobile'"
          class="flex-grow inline-block text-left q-ml-md"
        >
          {{ user.label }}
        </span>
      </template>

      <q-list>
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
      <hr />
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
.user-dropdown {
  padding: 0;
  padding-right: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: $blue-grey-2;
}

.user-dropdown :deep(.q-btn__content) {
  width: 100%;
  flex-grow: 1;
}
.user-dropdown.mobile {
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  min-height: none;
  height: 32px;
}

.user-dropdown.mobile :deep(.q-btn-dropdown__arrow-container) {
  display: none;
}

.rounded {
  border-radius: 9999px;
}

.flex-grow {
  flex-grow: 1;
}

.q-menu {
  border: 1px solid $blue-grey-2;
}

.q-menu hr {
  border-top: 1px solid $blue-grey-2;
  margin: 0 16px;
}
</style>
