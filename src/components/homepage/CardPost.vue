<script lang="ts">
/**
 * CardPost Component
 *
 * The `CardPost` component displays a post in a card form.
 *
 * @description
 * This component presents information such as post content, author, date, and
 * other relevant details. Border radius can be controlled by `config`
 * parameter.
 *
 * Note: This component is commonly used within the `ListCardPost`
 * component.
 *
 * @props
 * - `card` (Object, required): An object containing details related to the post.
 *
 * @example
 * <card-post
 *   :card="postDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105647&mode=dev)
 */

// libraries
import { date } from 'quasar';
import { computed, defineComponent } from 'vue';

// types
import { CardPost as CardPostType } from '../types';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const { formatDate } = date;

export default defineComponent({
  name: 'CardPost',
  props: {
    card: {
      type: Object as () => CardPostType,
      required: true,
    },
  },
  setup(props) {
    const formattedDate = computed((): string => {
      if (!props.card.date || !date.isValid(props.card.date)) return '';
      return formatDate(new Date(props.card.date), 'D. MMM. YYYY');
    });
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      formattedDate,
      borderRadius,
    };
  },
});
</script>

<template>
  <!-- Link to news post -->
  <router-link :to="card.url">
    <!-- Card -->
    <q-card
      flat
      bordered
      class="bg-white cursor-pointer q-hoverable"
      :style="{ 'border-radius': borderRadius }"
      data-cy="card-post"
    >
      <!-- Image -->
      <q-img :src="card.image" ratio="1.25" data-cy="card-post-image" alt="" />
      <!-- Content -->
      <q-card-section>
        <!-- Date -->
        <div
          class="card-post-date text-caption text-blue-grey-5"
          data-cy="card-post-date"
        >
          {{ formattedDate }}
        </div>
        <!-- Title -->
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
a {
  text-decoration: none;
}
a:hover {
  .card-post-title {
    text-decoration: underline;
  }
}
</style>
