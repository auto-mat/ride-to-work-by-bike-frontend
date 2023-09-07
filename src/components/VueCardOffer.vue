<script lang="ts">
import { defineComponent, ref } from 'vue';

// components
import VueDialogCard from 'components/VueDialogCard.vue';

// types
import { CardOffer, DialogCard, ConfigGlobal } from 'components/types';

const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);

export default defineComponent({
  name: 'VueCardOffer',
  components: {
    VueDialogCard,
  },
  props: {
    card: {
      type: Object as () => CardOffer,
      required: true,
    },
  },
  setup(props) {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard
    const modalOpened = ref(false);

    // Build data object for Dialog
    // TODO: finalize the data handling
    const modalDialog: DialogCard = {
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
      voucher: {
        code: '65972834',
        link: {
          title: 'Navštívit e-shop',
          url: 'https://www.nextbike.de/en/',
        },
      },
    };

    return {
      borderRadius,
      modalOpened,
      modalDialog,
    };
  },
});
</script>

<template>
  <!-- Card (hoverable) -->
  <q-card
    v-ripple
    flat
    bordered
    data-cy="card-offer"
    class="bg-white cursor-pointer q-hoverable"
    :style="{ 'border-radius': borderRadius }"
    @click.prevent="modalOpened = true"
  >
    <span class="q-focus-helper"></span>
    <q-card-section horizontal class="q-px-md q-py-md items-center">
      <q-card-section class="col-auto items-center">
        <!-- Icon -->
        <q-icon
          :name="card.icon"
          color="blue-grey-3"
          size="48px"
          data-cy="card-icon"
        />
      </q-card-section>
      <q-card-section class="col items-center">
        <!-- Title -->
        <div class="text-grey-10" data-cy="card-title">{{ card.title }}</div>
      </q-card-section>
    </q-card-section>

    <!-- Modal dialog -->
    <vue-dialog-card
      v-model="modalOpened"
      :dialog="modalDialog"
      data-cy="dialog-card-offer"
    ></vue-dialog-card>
  </q-card>
</template>
