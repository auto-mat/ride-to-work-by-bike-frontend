<script lang="ts">
/**
 * HeadingBackground Component
 *
 * The `HeadingBackground` component renders a heading title with a
 * decorative background image.
 *
 * @description
 * This component presents a heading on a custom background.
 * The title text is displayed centrally on top of the background image.
 *
 * @props
 * - `title` (String): The text to be displayed as the title on top of the
 *   background image.
 *
 * @example
 * <heading-background :title="sectionTitle" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=7004-32012&t=q6B4M3KcptuW1mh3-1)
 */

// libraries
import { Screen } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeadingBackground',
  props: {
    title: {
      type: String,
    },
  },
  setup() {
    const headingMaxWidth = Screen.sizes.sm;

    return {
      headingMaxWidth,
    };
  },
});
</script>

<template>
  <div
    class="row relative-position items-center q-col-gutter-lg"
    data-cy="heading-background"
  >
    <div class="col-12 col-lg-auto" data-cy="section-text">
      <div :style="{ maxWidth: `${headingMaxWidth}px` }">
        <div
          class="q-mt-none q-mb-xs text-subtitle2 text-weight-bold text-primary"
          data-cy="heading-background-highlight"
          v-html="$t('index.headingBackground.highlightCommunity')"
        />
        <h2
          class="q-my-none text-balance text-40 text-weight-bold text-primary"
          data-cy="heading-background-title"
          :style="{ lineHeight: '44px' }"
          v-html="$t('index.headingBackground.titleCommunity')"
        />
      </div>
    </div>
    <div class="col-12 col-lg" data-cy="section-image">
      <q-img
        src="~assets/image/heading-background/rtwbb-community.webp"
        :ratio="4.5"
        height="117px"
        fit="contain"
        :alt="$t('index.headingBackground.imageAltText')"
        data-cy="heading-background-image"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.heading-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7faff;
  padding: 0 24px 48px;

  @media (min-width: $breakpoint-lg-min) {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 48px;
    padding-bottom: 0;
    background-color: transparent;

    h2 {
      padding-right: 48px;
    }
  }
}
</style>
