<script lang="ts">
/**
 * ImpersonationBanner Component
 *
 * @description * Display an info banner for impersonation mode.
 * The banner shows which user is being impersonated and provides exit button.
 *
 * Note: This component is used in `MainLayout` and `LoginRegisterLayout`.
 *
 * @example
 * <impersonation-banner />
 */

// libraries
import { computed, defineComponent } from 'vue';
import { Screen } from 'quasar';

// composables
import { i18n } from 'src/boot/i18n';

// stores
import { useLoginStore } from 'src/stores/login';

export default defineComponent({
  name: 'ImpersonationBanner',
  setup() {
    const loginStore = useLoginStore();
    const isActive = computed(() => loginStore.impersonation.isActive);
    const userEmail = computed(() => {
      return loginStore.impersonation.impersonatedUser?.user.email || '';
    });
    const bannerText = computed(() => {
      return i18n.global.t('impersonation.viewingAsUser', {
        email: userEmail.value,
      });
    });
    const exitButtonText = computed(() => {
      return i18n.global.t('impersonation.exitButton');
    });
    const isMobile = computed(() => Screen.lt.sm);
    // show only the icon on mobile, label + icon on larger screens
    const exitButtonLabel = computed(() =>
      isMobile.value ? undefined : exitButtonText.value,
    );
    // smaller text on mobile to leave room for longer emails
    const bannerTextClass = computed(() =>
      isMobile.value ? 'text-caption' : 'text-body2',
    );

    const handleExit = () => {
      loginStore.exitImpersonation();
    };

    return {
      isActive,
      isMobile,
      bannerText,
      bannerTextClass,
      exitButtonLabel,
      handleExit,
    };
  },
});
</script>

<template>
  <div v-if="isActive" class="impersonation-banner-spacer" />
  <div
    v-if="isActive"
    class="impersonation-banner q-layout-padding text-white bg-orange-8 q-py-sm"
    data-cy="impersonation-banner"
  >
    <div
      class="row items-center no-wrap full-width"
      :class="isMobile ? 'q-px-md' : 'q-px-lg'"
    >
      <!-- Info: impersonated user email -->
      <div class="col ellipsis" :class="bannerTextClass">
        <span class="text-weight-medium">{{ bannerText }}</span>
      </div>
      <!-- Button: Exit impersonation mode -->
      <q-btn
        unelevated
        dense
        rounded
        flat
        :label="exitButtonLabel"
        color="white"
        icon="svguse:icons/drawer_menu/icons.svg#lucide-log-out"
        size="md"
        class="col-auto q-ml-sm"
        data-cy="impersonation-exit-button"
        @click="handleExit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$impersonation-banner-height: 52px;
.impersonation-banner-spacer {
  height: $impersonation-banner-height;
}
.impersonation-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  // below Quasar's Notify plugin (z-index: 9500)
  z-index: 9000;
  min-height: $impersonation-banner-height;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
</style>
