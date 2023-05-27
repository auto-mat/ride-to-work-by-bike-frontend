<template>
  <q-page class="q-px-lg">
    <h1 class="text-h6 q-mt-none q-pt-lg text-weight-bold">{{ $t('index.title') }}</h1>
    <event-countdown :release-date="releaseDate"></event-countdown>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EventCountdown from 'components/EventCountdown.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { EventCountdown },
  setup() {
    const releaseDate = '2023-05-29T12:00:00'
    return {
      releaseDate
    };
  }
});
</script>
