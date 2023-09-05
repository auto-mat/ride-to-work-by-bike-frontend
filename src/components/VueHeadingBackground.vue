<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueHeadingBackground',
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
      class="flex column w-full"
      src="~assets/svg/bg-community.svg"
      :alt="$t('index.headingBackground.imageAltText')"
      data-cy="svg"
    />
    <!-- Content: heading -->
    <div class="heading-wrapper" data-cy="heading-wrapper">
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
