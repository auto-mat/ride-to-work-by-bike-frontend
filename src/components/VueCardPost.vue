<script lang="ts">
import { defineComponent } from 'vue';
import { useDateFormat } from '@vueuse/core';

// import types
import { CardPost } from 'components/types';

export default defineComponent({
  name: 'VueCardPost',
  props: {
    card: {
      type: Object as () => CardPost,
      required: true,
    },
  },
  setup(props) {
    const formattedDate = useDateFormat(props.card.date, 'D. MMM. YYYY');

    return {
      formattedDate,
    };
  },
});
</script>

<template>
  <router-link :to="card.url">
    <q-card
      class="rounded-20 bg-white cursor-pointer q-hoverable"
      data-cy="card-post"
      bordered
      flat
    >
      <q-img :src="card.image" ratio="1.25" data-cy="card-post-image" />

      <q-card-section>
        <div
          class="card-post-date text-caption text-blue-grey-5"
          data-cy="card-post-date"
        >
          {{ formattedDate }}
        </div>
        <div
          class="card-post-title text-body text-grey-10"
          data-cy="card-post-title"
        >
          {{ card.title }}
        </div>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<style lang="scss" scoped>
.rounded-20 {
  border-radius: 20px;
}
a {
  text-decoration: none;
}
a:hover {
  .card-post-title {
    text-decoration: underline;
  }
}
</style>
