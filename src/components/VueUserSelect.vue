<script lang="ts">
import { defineComponent, ref } from 'vue';

// import types
import { User } from 'components/types';

export default defineComponent({
  name: 'VueUserSelect',
  props: {
    options: {
      type: Array as () => User[],
    },
  },
  setup() {
    const user = ref({
      label: 'User 1',
      value: '1',
      image: 'https://picsum.photos/id/40/300/300',
    });

    return {
      user,
    };
  },
});
</script>

<template>
  <div class="user-select" data-cy="user-select">
    <q-select
      rounded
      standout
      v-model="user"
      :options="options"
      class="pt-0"
      data-cy="user-select-input"
    >
      <template v-slot:prepend>
        <q-avatar size="56px" data-cy="avatar">
          <img class="rounded" :src="user.image" />
        </q-avatar>
      </template>
    </q-select>
  </div>
</template>

<style scoped>
.user-select :deep(.q-field__inner .q-field__control) {
  padding-left: 0;
}
.rounded {
  border-radius: 9999px;
}
</style>
