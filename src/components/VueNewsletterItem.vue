<script lang="ts">
import { defineComponent, computed } from 'vue';

// import types
import { NewsletterItem } from 'components/types';

export default defineComponent({
  name: 'VueNewsletterItem',
  props: {
    item: {
      type: Object as () => NewsletterItem,
      required: true,
    },
  },
  setup(props) {
    const buttonTextColor = computed(() => {
      return props.item.following ? 'grey-10' : 'white';
    });

    return {
      buttonTextColor,
    };
  },
});
</script>

<template>
  <div
    class="flex items-center justify-between gap-8"
    data-cy="newsletter-feature-item"
  >
    <div class="flex items-center justify-between gap-8">
      <q-icon
        :name="item.icon"
        size="32px"
        color="blue-grey-6"
        data-cy="newsletter-feature-icon"
      ></q-icon>
      <div
        class="text-body2 text-grey-10"
        :class="{ 'text-bold': !item.following }"
        data-cy="newsletter-feature-title"
      >
        {{ item.title }}
      </div>
    </div>
    <q-btn
      rounded
      color="grey-10"
      :text-color="buttonTextColor"
      unelevated
      :outline="item.following"
      data-cy="newsletter-feature-button"
    >
      <q-icon
        v-show="item.following"
        name="check"
        size="18px"
        color="grey-10"
      />
      <span v-if="item.following">
        {{ $t('index.newsletterFeature.following') }}
      </span>
      <span v-if="!item.following">
        {{ $t('index.newsletterFeature.follow') }}
      </span>
    </q-btn>
  </div>
</template>

<style scoped lang="scss">
.gap-8 {
  gap: 8px;
}
</style>
