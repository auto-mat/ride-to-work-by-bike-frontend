<script lang="ts">
/**
 * ForumPostItem Component
 *
 * @description * Use this component to render single post card.
 *
 * @props
 * - `post` (ForumPost, required): The object representing a post.
 *   It should be of type `ForumPost`.
 *
 * @example
 * <forum-post-item :post="post" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104327&t=ZZSrUuLgRLYixhUu-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

// composables
import { useFormatDate } from '../../composables/useFormatDate';

export default defineComponent({
  name: 'ForumPostItem',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { formatDateTimeLabel } = useFormatDate();
    const date = ref('');
    date.value = formatDateTimeLabel(props.post.date);

    return {
      date,
      formatDateTimeLabel,
    };
  },
});
</script>

<template>
  <div class="row q-px-sm q-py-md" data-cy="forum-post-item">
    <div class="col-auto">
      <q-avatar class="q-mr-md" size="64px">
        <q-img :src="post.user.image" data-cy="forum-post-image" />
      </q-avatar>
    </div>
    <div class="col text-grey-10">
      <div class="text-body1" data-cy="forum-post-title">
        {{ post.title }}
      </div>
      <div class="flex flex-wrap gap-8 text-caption">
        <div data-cy="forum-post-date">
          {{ date }}
        </div>
        <div class="flex gap-4" data-cy="forum-post-comment-count">
          <q-icon name="reply" size="18px" color="grey-7" />
          {{ post.comments.length }}
        </div>
      </div>
    </div>
  </div>
</template>
