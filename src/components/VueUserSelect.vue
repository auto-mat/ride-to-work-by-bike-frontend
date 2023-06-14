<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'VueUserSelect',
  setup() {
    const user = ref({ label: 'User 1', value: '1', image: 'https://picsum.photos/id/40/300/300' });

    // TODO: add option model
    const options = [
      { label: 'User 1', value: '1', image: 'https://picsum.photos/id/40/300/300' },
      { label: 'User 2', value: '2', image: 'https://picsum.photos/id/64/300/300' },
      { label: 'User 3', value: '3', image: 'https://picsum.photos/id/91/300/300' },
    ];

    return {
      user,
      options,
    };
  },
});
</script>

<template>
  <div class="user-select">
    <q-select rounded standout v-model="user" :options="options" class="pt-0" data-cy="select">
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
