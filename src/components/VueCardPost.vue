<script lang="ts">
import { defineComponent } from "vue";
import { useDateFormat } from "@vueuse/core";

export default defineComponent({
  name: 'VueCardPost',
  props: {
    card: {
      type: Object as () => any,
      required: true,
    }
  },
  setup(props) {
    const formattedDate = useDateFormat(props.card.date, 'D. MMM. YYYY');

    return {
      formattedDate
    }
  }
})
</script>

<template>
  <q-card class="rounded-20 bg-white" data-cy="card-post" bordered flat>
    <q-img :src="card.image" ratio="1.25" data-cy="card-post-image" />

    <q-card-section>
      <div class="text-caption text-blue-grey-5" data-cy="card-post-date">{{ formattedDate }}</div>
      <div class="text-body text-grey-10" data-cy="card-post-title">{{ card.title }}</div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.rounded-20 {
  border-radius: 20px;
}
</style>
