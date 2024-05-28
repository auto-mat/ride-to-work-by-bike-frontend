<script lang="ts">
/**
 * ForumPostList Component
 *
 * @description * Use this component to render forum posts.
 *
 * @components
 * - `SectionColumns`: Component to render content in columns.
 * - `ForumPostItem`: Component to render forum post.
 *
 * @example
 * <forum-post-list />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104327&t=ZZSrUuLgRLYixhUu-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import SectionColumns from '../homepage/SectionColumns.vue';
// import ForumPostItem from '../community/ForumPostItem.vue';

// fixtures
import forumPosts from '../../../test/cypress/fixtures/forumPostList.json';

export default defineComponent({
  name: 'ForumPostList',
  components: {
    SectionColumns,
  },
  setup() {
    return {
      forumPosts,
    };
  },
});
</script>

<template>
  <div data-cy="forum-post-list">
    <h3
      class="text-body1 text-bold text-black q-my-none"
      data-cy="forum-post-title"
    >
      {{ $t('forumPostList.titleRecentPosts') }}
    </h3>

    <section-columns :columns="2">
      <forum-post-item
        v-for="post in forumPosts"
        :key="post.id"
        :post="post"
        data-cy="forum-post-item"
      />
    </section-columns>

    <div>
      <q-btn color="primary" unelevated rounded data-cy="forum-post-button">
        {{ $t('forumPostList.buttonVisitForum') }}
      </q-btn>
    </div>
  </div>
</template>
