<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'UserSelect',
  setup() {
    const user = ref({ label: 'User 1', value: '1' });
    const options = [
      { label: 'User 1', value: '1' },
      { label: 'User 2', value: '2' },
      { label: 'User 3', value: '3' },
    ];

    return {
      user, options
    }
  }
})
</script>

<template>
  <div class="user-select">
    <q-select rounded standout v-model="user" :options="options" class="pt-0">
      <template v-slot:prepend>
        <q-avatar size="56px">
          <img class="rounded" src="https://picsum.photos/300/300" />
        </q-avatar>
      </template>
    </q-select>
  </div>
</template>

<style scoped>
.user-select >>> .q-field__inner .q-field__control {
  padding-left: 0;
}
.rounded {
  border-radius: 9999px;
}
</style>
