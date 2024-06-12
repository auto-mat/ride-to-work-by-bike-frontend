<script lang="ts">
/**
 * BannerReminder Component
 *
 * @description * Use this component to show a periodical UI reminder.
 * You can hide the reminder temporarily by clicking one button.
 * You can hide the reminder permanently by clickon another button.
 *
 * Note: This component is used on `CompanyCoordinatorPage`.
 *
 * @example
 * <banner-reminder />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104283&t=4CYF4YvlSh1KV2e2-1)
 */

// libraries
import { Screen } from 'quasar';
import { computed, defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'BannerReminder',
  setup() {
    const { borderRadiusCard: borderRadius } = rideToWorkByBikeConfig;

    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    const onConfirm = (): void => {
      // TODO: Add action
    };

    const onDismiss = (): void => {
      // TODO: Add action
    };

    return {
      borderRadius,
      isLargeScreen,
      onConfirm,
      onDismiss,
    };
  },
});
</script>

<template>
  <q-banner
    dense
    :inline-actions="isLargeScreen"
    rounded
    data-cy="banner-reminder"
    class="text-white bg-primary"
    :style="{ 'border-radius': borderRadius }"
  >
    <!-- Banner text -->
    <p class="q-ma-none q-px-sm" data-cy="banner-text">
      {{ $t('coordinator.textBannerReminder') }}
    </p>
    <template v-slot:action>
      <!-- Button: Dismiss -->
      <q-btn
        flat
        color="white"
        :label="$t('coordinator.buttonBannerReminderDismiss')"
        @click.prevent="onDismiss"
        data-cy="banner-button-dismiss"
      />
      <!-- Button: Confirm -->
      <q-btn
        flat
        color="white"
        :label="$t('coordinator.buttonBannerReminderConfirm')"
        @click.prevent="onConfirm"
        data-cy="banner-button-confirm"
      />
    </template>
  </q-banner>
</template>
