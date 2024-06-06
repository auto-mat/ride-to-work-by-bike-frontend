<script lang="ts">
/**
 * NewsletterFeature Component
 *
 * The `NewsletterFeature` component displays a newsletter section,
 * with various newsletter option items.
 *
 * @description
 * This component provides a visually appealing section to promote newsletters.
 * It uses predefined mock data to display a list of newsletter items using the
 * `NewsletterItem` child component.
 *
 * @components
 * - `NewsletterItem`: Component to render individual newsletter details.
 * - `SectionHeading`: Component to render a heading.
 *
 * @example
 * <newsletter-feature />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105656&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// mocks
import { newsletterItems } from '../../mocks/homepage';

// components
import NewsletterItem from './NewsletterItem.vue';
import SectionHeading from '../global/SectionHeading.vue';

export default defineComponent({
  name: 'NewsletterFeature',
  components: {
    NewsletterItem,
    SectionHeading,
  },
  setup() {
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
    <!-- Section image -->
    <div class="gt-sm col-md-3 col-lg-2" data-cy="newsletter-col-image">
      <div class="q-px-lg">
        <!-- Image -->
        <q-img
          src="~assets/svg/newsletter-envelope.svg"
          class="newsletter-feature-image"
          width="512"
          height="512"
          ratio="1"
          data-cy="newsletter-feature-image"
        />
      </div>
    </div>

    <!-- Section content -->
    <div class="col-12 col-md-9 col-lg-10" data-cy="newsletter-col-content">
      <!-- Title -->
      <section-heading class="q-mb-md">
        {{ $t('index.newsletterFeature.title') }}
        <template #perex>
          {{ $t('index.newsletterFeature.description') }}
        </template>
      </section-heading>
      <div v-for="(item, index) in newsletterItems" :key="item.title">
        <!-- Item - subscription variant -->
        <newsletter-item :item="item" data-cy="newsletter-feature-item" />
        <!-- Separator -->
        <q-separator
          v-if="index < newsletterItems.length - 1"
          class="q-my-md"
          data-cy="newsletter-feature-separator"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.newsletter-feature-image {
  max-width: 140px;
  margin: 0 auto;
}
</style>
