<script lang="ts">
import { defineComponent } from 'vue';
import { i18n } from 'src/boot/i18n';

// import types
import { NewsletterItem } from 'components/types';

// import components
import VueNewsletterItem from 'components/VueNewsletterItem.vue';

export default defineComponent({
  name: 'VueNewsletterFeature',
  components: {
    VueNewsletterItem,
  },
  setup() {
    const newsletterItems: NewsletterItem[] = [
      {
        title: i18n.global.t('index.newsletterFeature.aboutChallenges'),
        icon: 'ion-bicycle',
        url: '#',
        following: true,
      },
      {
        title: i18n.global.t('index.newsletterFeature.aboutEvents'),
        icon: 'people',
        url: '#',
        following: true,
      },
      {
        title: i18n.global.t('index.newsletterFeature.aboutMobility'),
        icon: 'mdi-leaf',
        url: '#',
        following: false,
      },
    ];

    return {
      newsletterItems,
    };
  },
});
</script>

<template>
  <div
    data-cy="newsletter-feature"
    class="flex items-center justify-between gap-8"
  >
    <div>
      <h2 class="q-mb-md">{{ $t('index.newsletterFeature.title') }}</h2>
      <p class="q-my-md" v-html="$t('index.newsletterFeature.description')"></p>
      <div v-for="(item, index) in newsletterItems" :key="item.title">
        <vue-newsletter-item :item="item"></vue-newsletter-item>
        <hr v-if="index < newsletterItems.length - 1" class="q-my-sm" />
      </div>
    </div>
  </div>
</template>
