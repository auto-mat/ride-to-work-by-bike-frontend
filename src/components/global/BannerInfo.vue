<script lang="ts">
/**
 * BannerInfo Component
 *
 * @description * Use this component to show info banner.
 *
 * Note: This component is commonly used on `CompanyCoordinatorPage`.
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
      <div class="col-12 col-sm-auto">
        <!-- Icon -->
        <q-icon
          name="mdi-credit-card"
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
          {{ $t('bannerInfo.title') }}
        </div>
        <!-- Content -->
        <div
          class="q-mt-md"
          v-html="$t('bannerInfo.text')"
          data-cy="banner-info-content"
        />
      </div>
    </div>
  </div>
</template>
