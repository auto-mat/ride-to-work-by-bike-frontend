<script lang="ts">
import { defineComponent, ref } from 'vue';

// import types
import { Offer } from 'components/types';

export default defineComponent({
  name: 'VueCardOffer',
  props: {
    card: {
      type: Object as () => Offer,
      required: true,
    },
  },
  setup() {
    const modalOpened = ref(false);
    return {
      modalOpened,
    };
  },
});
</script>

<template>
  <q-card
    data-cy="card-offer"
    class="rounded-20 bg-white"
    unelevated
    @click.prevent="modalOpened = true"
  >
    <q-card-section horizontal class="q-px-12 q-py-md">
      <q-card-section class="col-auto items-center">
        <q-icon
          :name="card.icon"
          color="blue-grey-3"
          size="48px"
          data-cy="card-icon"
        />
      </q-card-section>
      <q-card-section class="col items-center">
        <div class="text-grey-10" data-cy="card-title">{{ card.title }}</div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.rounded-20 {
  border-radius: 20px;
}

.q-px-12 {
  padding-left: 12px;
  padding-right: 12px;
}
</style>
