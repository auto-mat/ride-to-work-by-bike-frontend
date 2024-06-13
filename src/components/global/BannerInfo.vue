<script lang="ts">
/**
 * BannerInfo Component
 *
 * @description * Use this component to show info banner.
 *
 * Note: This component is commonly used on `CompanyCoordinatorPage`.
 *
 * @props
 * - `title` (string, required): banner title.
 * - `icon` (string, required): banner icon.
 *
 * @slots
 * - `content`: For displaying the content of the banner.
 *
 * @example
 * <banner-info />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105324&t=CGsDXzO5CQmHvfCf-1)
 */

// libraries
import { defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

export default defineComponent({
  name: 'BannerInfo',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;

    return { borderRadius };
  },
});
</script>

<template>
  <div
    class="bg-grey-1 q-px-lg q-py-lg"
    :style="{ 'border-radius': borderRadius }"
    data-cy="banner-info"
  >
    <div class="row q-col-gutter-lg">
      <div v-if="icon" class="col-12 col-sm-auto">
        <!-- Icon -->
        <q-icon
          :name="icon"
          size="96px"
          color="primary"
          data-cy="banner-info-icon"
        />
      </div>
      <div class="col-12 col-sm">
        <!-- Title -->
        <div
          class="text-h6 text-weight-bold q-my-none"
          data-cy="banner-info-title"
        >
          {{ title }}
        </div>
        <!-- Content -->
        <div class="q-mt-md" data-cy="banner-info-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
