<script lang="ts">
/**
 * SectionHeading Component
 *
 * @description * Use this component to render a heading for a section.
 *
 * @slots
 * - `title`: For the title (optional).
 * - `perex`: For the perex (optional).
 *
 * @example
 * <section-heading>
 *   <template #title>
 *     Example title
 *   </template>
 *   <template #perex>
 *     Example perex
 *   </template>
 * </section-heading>
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104327&t=lHmHLElQINQAhE9f-1)
 */

// libraries
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SectionHeading',
});
</script>

<template>
  <div v-if="$slots.default || $slots.perex" data-cy="section-heading">
    <h2
      v-if="$slots.default"
      class="text-h5 text-weight-bold text-grey-10 q-my-none"
      data-cy="section-heading-title"
    >
      <slot />
    </h2>
    <div
      v-if="$slots.perex"
      class="q-mt-md text-subtitle2 text-weight-regular text-grey-10"
      data-cy="section-heading-perex"
    >
      <slot name="perex"></slot>
    </div>
  </div>
</template>
