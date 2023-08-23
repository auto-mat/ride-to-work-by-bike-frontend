<script lang="ts">
import { defineComponent } from 'vue';

// types
import { Link, User } from 'components/types';

export default defineComponent({
  name: 'VueUserSelect',
  props: {
    menuTop: {
      type: Array as () => Link[],
      required: true,
    },
    menuBottom: {
      type: Array as () => Link[],
      required: true,
    },
    user: {
      type: Object as () => User,
      required: true,
    }
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="user-select" data-cy="user-select">
    <q-btn-dropdown
      rounded
      flat
      class="user-dropdown"
      data-cy="user-select-input"
    >
      <template v-slot:label>
        <q-avatar size="56px" data-cy="avatar">
          <img class="rounded" :src="user.image" />
        </q-avatar>
        <span class="flex-grow inline-block text-left q-ml-md">
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
