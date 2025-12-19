<script lang="ts">
/**
 * MobileBottomPanel Component
 *
 * The `MobileBottomPanel` component renders a bottom navigation panel
 * for mobile viewports.
 *
 * @description
 * This component provides a toolbar at the bottom of the viewport,
 * featuring menu links. The menu items are sourced from
 * predefined mock data.
 *
 * @example
 * <mobile-bottom-panel />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=1653%3A20591&mode=dev)
 */

// libraries
import { computed, defineComponent, inject, ref } from 'vue';

// composables
import { i18n } from '../../boot/i18n';
import { defaultLocale } from '../../i18n/def_locale';

// composables
import { useMenu } from 'src/composables/useMenu';
import { useRoutes } from 'src/composables/useRoutes';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import type { Link } from 'components/types';
import type { Logger } from '../types/Logger';

// utils
import { getApiBaseUrlWithLang } from '../../utils/get_api_base_url_with_lang';

export default defineComponent({
  name: 'MobileBottomPanel',
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();
    const isUserOrganizationAdmin = computed(
      () => registerChallengeStore.isUserOrganizationAdmin,
    );
    const isUserStaff = computed(() => registerChallengeStore.getIsUserStaff);
    const getHasOrganizationAdmin = computed(
      () => registerChallengeStore.getHasOrganizationAdmin,
    );
    const { isEntryEnabled, isResultsEnabled } = useRoutes();
    const { getMenuTop, getMenuBottom } = useMenu();

    const { mobileBottomPanelVisibleItems } = rideToWorkByBikeConfig;
    const logger = inject('vuejs3-logger') as Logger | null;

    const {
      urlRideToWorkByBikeOldFrontendDjangoApp,
      urlRideToWorkByBikeOldFrontendDjangoAppAdmin,
    } = rideToWorkByBikeConfig;
    const rtwbbOldFrontendDjangoAdminUrl = `${urlRideToWorkByBikeOldFrontendDjangoApp}/${urlRideToWorkByBikeOldFrontendDjangoAppAdmin}`;

    const urlAdmin = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rtwbbOldFrontendDjangoAdminUrl,
        defaultLocale,
        i18n,
      );
    });
    const menuTop = computed((): Link[] => {
      return getMenuTop({
        isUserOrganizationAdmin: isUserOrganizationAdmin,
        isUserStaff,
        urlAdmin,
        isEntryEnabled,
        isResultsEnabled,
        getHasOrganizationAdmin,
      });
    });
    const menuPanel = computed((): Link[] => {
      return menuTop.value.slice(0, mobileBottomPanelVisibleItems);
    });

    const isDialogOpen = ref(false);
    const urlDonate = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlDonate,
        defaultLocale,
        i18n,
      );
    });
    const urlContact = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlContact,
        defaultLocale,
        i18n,
      );
    });
    const menuBottom = computed(() => {
      return getMenuBottom(urlDonate.value, urlContact.value);
    });

    return {
      isDialogOpen,
      menuPanel,
      menuBottom,
      menuTop,
      mobileBottomPanelVisibleItems,
    };
  },
});
</script>

<template>
  <q-toolbar
    class="lt-md bg-grey-2 text-gray-10 fixed-bottom"
    style="z-index: 1000"
    data-cy="footer-panel"
  >
    <!-- Panel menu -->
    <q-list
      padding
      class="w-full flex justify-around text-grey-6"
      data-cy="footer-panel-menu"
    >
      <!-- Top menu (first 4 items) -->
      <q-item
        clickable
        v-ripple
        v-for="item in menuPanel"
        :key="item.name"
        :to="item.disabled ? '' : item.url"
        :disable="item.disabled"
        v-bind="{
          ...(item.href ? { href: item.href } : {}),
          ...(item.href ? { target: '_blank' } : {}),
        }"
        class="q-pa-sm"
        active-class="text-grey-10"
      >
        <div class="text-center">
          <!-- Icon -->
          <q-icon :name="item.icon" size="24px"></q-icon>
          <!-- Label -->
          <q-item-label class="text-caption text-grey-10">{{
            $t(`drawerMenu.${item.title}`)
          }}</q-item-label>
        </div>
      </q-item>

      <!-- Button show menu -->
      <q-item
        clickable
        v-ripple
        active-class="bottom-sheet-up"
        @click="isDialogOpen = true"
        class="q-pa-sm"
        data-cy="footer-panel-menu-hamburger"
      >
        <div class="text-center">
          <q-icon name="menu" size="24px"></q-icon>
          <q-item-label class="text-caption text-grey-10">{{
            $t('drawerMenu.more')
          }}</q-item-label>
        </div>
      </q-item>
    </q-list>
  </q-toolbar>

  <!-- Dialog -->
  <q-dialog
    v-model="isDialogOpen"
    position="bottom"
    data-cy="footer-panel-menu-dialog"
  >
    <!-- Dialog menu -->
    <q-list padding class="bg-white w-full">
      <!-- Top menu (remaining items) -->
      <q-item
        clickable
        v-ripple
        v-for="item in menuTop.slice(mobileBottomPanelVisibleItems)"
        :key="item.name"
        :to="item.disabled ? '' : item.url"
        :disable="item.disabled"
        v-bind="{
          ...(item.href ? { href: item.href } : {}),
          ...(item.href ? { target: '_blank' } : {}),
        }"
        class="q-py-sm q-px-md"
        active-class="text-grey-10"
      >
        <!-- Icon -->
        <q-item-section avatar>
          <q-icon :name="item.icon" size="24px" color="grey-6"></q-icon>
        </q-item-section>
        <!-- Label -->
        <q-item-section>
          <q-item-label class="text-caption text-grey-10">{{
            $t(`drawerMenu.${item.title}`)
          }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator v-if="menuBottom.length > 0" />

      <!-- Bottom menu items -->
      <q-item
        clickable
        v-ripple
        v-for="item in menuBottom"
        :key="item.name"
        :to="item.disabled ? '' : item.url"
        :disable="item.disabled"
        v-bind="{
          ...(item.href ? { href: item.href } : {}),
          ...(item.href ? { target: '_blank' } : {}),
        }"
        class="q-py-sm q-px-md items-center"
        active-class="text-grey-10"
      >
        <!-- Icon -->
        <q-item-section avatar>
          <q-icon :name="item.icon" size="24px" color="grey-6"></q-icon>
        </q-item-section>
        <!-- Label -->
        <q-item-section>
          <q-item-label class="text-caption text-grey-10">{{
            $t(`drawerMenu.${item.title}`)
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-dialog>
</template>

<style scoped lang="scss">
.w-full {
  width: 100%;
}
</style>
