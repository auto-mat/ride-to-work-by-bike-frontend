<script lang="ts">
import { defineComponent } from "vue";

// import types
import { NewsletterItem } from "components/types";

export default defineComponent({
  name: 'VueNewsletterItem',
  props: {
    item: {
      type: Object as () => NewsletterItem,
      required: true,
    }
  }
})
</script>

<template>
  <div class="flex items-center justify-between gap-8" data-cy="newsletter-feature-item">
    <div>
      <q-icon name="ion-bike" size="30px" color="black" data-cy="newsletter-feature-icon"></q-icon>
      <div class="text-body" data-cy="newsletter-feature-title">{{ item.title }}</div>
    </div>
    <q-btn v-if="item.following" data-cy="newsletter-feature-button">
      <q-icon name="ion-bike" size="30px" color="black"></q-icon>
      {{ $t('index.newsletterFeatured.following') }}
    </q-btn>
    <q-btn v-if="!item.following">
      <q-icon name="ion-bike" size="30px" color="black"></q-icon>
      {{ $t('index.newsletterFeatured.follow') }}
    </q-btn>
  </div>
</template>

<style scoped lang="scss">
.gap-8 {
  gap: 8px;
}
</style>
