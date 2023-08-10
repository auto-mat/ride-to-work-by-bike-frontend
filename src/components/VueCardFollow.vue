<script lang="ts">
import { defineComponent } from 'vue';

// types
import { CardFollow } from 'components/types';

export default defineComponent({
  name: 'VueCardFollow',
  props: {
    card: {
      type: Object as () => CardFollow,
      required: true,
    },
  },
});
</script>

<template>
  <div class="pt-48" data-cy="card-follow-wrapper">
    <q-card
      data-cy="card-follow"
      class="q-px-md q-py-md bg-white rounded-20 border-blue-grey-2"
      bordered
      flat
    >
      <q-item-section avatar data-cy="card-follow-avatar">
        <q-avatar size="96px" class="-mt-64">
          <img :src="card.image" data-cy="card-follow-image" />
        </q-avatar>
      </q-item-section>

      <q-item-section class="q-pt-sm">
        <a :href="card.url" target="_blank" data-cy="card-follow-link">
          <q-item-label
            class="text-body1 text-weight-medium text-grey-10"
            data-cy="card-follow-title"
            >{{ card.title }}</q-item-label
          >
        </a>
        <q-item-label
          class="q-mt-xs text-subtitle2 text-weight-regular text-blue-grey-7"
          data-cy="card-follow-handle"
          >{{ card.handle }}</q-item-label
        >
      </q-item-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.rounded-20 {
  border-radius: 20px;
}
.pt-48 {
  padding-top: 48px;
}
.-mt-64 {
  margin-top: -64px;
}
.border-blue-grey-2 {
  border: 1px solid $blue-grey-2;
}
</style>
