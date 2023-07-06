<script lang="ts">
import { defineComponent, ref } from 'vue';

// import components
import VueCardDialog from 'components/VueCardDialog.vue';

// import types
import { Offer } from 'components/types';
import { createDOMEvent } from 'cypress/vue/dist/@vue/test-utils/createDomEvent';

export default defineComponent({
  name: 'VueCardOffer',
  components: {
    VueCardDialog,
  },
  props: {
    card: {
      type: Object as () => Offer,
      required: true,
    },
  },
  setup(props) {
    const modalOpened = ref(false);
    const modalDialog = {
      title: props.card.title,
      meta: [
        {
          icon: 'event',
          description: props.card.expirationDate,
        },
        {
          icon: 'pedal_bike',
          description: props.card.issuer,
        },
      ],
      content: props.card.content,
      image: props.card.image,
    };

    return {
      modalOpened,
      modalDialog,
    };
  },
});
</script>

<template>
  <q-card
    v-ripple
    data-cy="card-offer"
    class="rounded-20 bg-white cursor-pointer q-hoverable"
    flat
    bordered
    @click.prevent="modalOpened = true"
  >
    <span class="q-focus-helper"></span>
    <q-card-section horizontal class="q-px-12 q-py-md items-center">
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

    <vue-card-dialog
      v-model="modalOpened"
      :dialog="modalDialog"
    ></vue-card-dialog>
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

.q-dialog__inner > div {
  overflow: visible !important;
}
.dialog-close {
  top: -21px;
  right: -21px;
}
</style>
