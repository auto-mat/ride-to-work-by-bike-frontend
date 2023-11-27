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
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105612&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeadingBackground',
  props: {
    title: {
      type: String,
    },
  },
});
</script>

<template>
  <div class="wrapper relative-position">
    <!-- Background image -->
    <q-img
      src="~assets/svg/bg-community.svg"
      :ratio="5"
      :alt="$t('index.headingBackground.imageAltText')"
      data-cy="svg"
    />
    <div class="heading-wrapper" data-cy="heading-wrapper">
      <!-- Title -->
      <h2
        class="text-h5 text-weight-bold text-center q-my-none"
        data-cy="heading"
      >
        {{ title }}
      </h2>
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
