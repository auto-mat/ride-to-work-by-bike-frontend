<script lang="ts">
import { defineComponent } from 'vue';
import { i18n } from 'src/boot/i18n';

// types
import { NewsletterItem } from 'components/types';

// components
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
    class="row q-col-gutter-lg items-center justify-between"
  >
    <div class="gt-sm col-md-3" data-cy="newsletter-col-image">
      <div class="q-px-xl">
        <q-img
          src="~assets/image/newsletter-envelope.png"
          data-cy="newsletter-feature-image"
        />
      </div>
    </div>
    <div class="col-12 col-md-9" data-cy="newsletter-col-content">
      <h2 class="q-mb-md q-mt-none text-h6" data-cy="newsletter-feature-title">
        {{ $t('index.newsletterFeature.title') }}
      </h2>
      <p
        class="q-my-md"
        v-html="$t('index.newsletterFeature.description')"
        data-cy="newsletter-feature-description"
      ></p>
      <div v-for="(item, index) in newsletterItems" :key="item.title">
        <vue-newsletter-item
          :item="item"
          data-cy="newsletter-feature-item"
        ></vue-newsletter-item>
        <hr
          v-if="index < newsletterItems.length - 1"
          class="q-my-md"
          data-cy="newsletter-feature-divider"
        />
      </div>
    </div>
  </div>
</template>
