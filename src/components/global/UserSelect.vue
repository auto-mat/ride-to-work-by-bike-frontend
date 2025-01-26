<script lang="ts">
/**
 * UserSelect Component
 *
 * The `UserSelect` component provides a dropdown for user-specific
 * actions and settings.
 *
 * @description
 * This component renders a dropdown select (on desktop) and
 * a user avatar (on mobile). These elements trigger dropdown menu.
 * Items in menu are sourced from predefined mock data.
 *
 * @props
 * - `variant` (String: 'mobile' | 'desktop', default: 'desktop'):
 *   Determines the display style of the component.
 *
 * @example
 * <user-select variant="desktop" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103890&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

// composables
import { i18n } from '../../boot/i18n';

// config
import { routesConf } from '../../router/routes_conf';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useLoginStore } from '../../stores/login';

// types
import type { Link } from '../types/Link';

export default defineComponent({
  name: 'UserSelect',
  props: {
    variant: {
      type: String as () => 'mobile' | 'desktop',
      required: false,
      default: 'desktop',
    },
  },
  setup(props) {
    const loginStore = useLoginStore();
    const user = computed(() => loginStore.getUser);

    const menuTop: Link[] = [
      {
        title: i18n.global.t('userSelect.profileDetails'),
        url: routesConf['profile_details']['children']['fullPath'],
      },
      // {
      //   title: i18n.global.t('userSelect.newsletter'),
      //   url: routesConf['profile_newsletter']['children']['fullPath'],
      // },
      // {
      //   title: i18n.global.t('userSelect.connectApps'),
      //   url: routesConf['routes_app']['children']['fullPath'],
      // },
      // {
      //   title: i18n.global.t('userSelect.notifications'),
      //   url: routesConf['profile_notifications']['children']['fullPath'],
      // },
    ];

    const menuBottom: Link[] = [
      // {
      //   title: i18n.global.t('userSelect.companyCoordinator'),
      //   url: routesConf['coordinator']['children']['fullPath'],
      // },
    ];

    const onLogout = () => {
      loginStore.logout();
    };

    const size = computed(() => (props.variant === 'mobile' ? '32px' : '40px'));
    const { borderRadiusCard: borderRadius, colorWhite } =
      rideToWorkByBikeConfig;

    return {
      borderRadius,
      colorWhite,
      menuBottom,
      menuTop,
      onLogout,
      size,
      user,
    };
  },
});
</script>

<template>
  <div class="user-select" data-cy="user-select">
    <!-- User dropdown -->
    <q-btn-dropdown
      dark
      rounded
      outline
      color="white"
      :class="[
        variant === 'mobile'
          ? 'dropdown-arrow-hidden transparent q-px-none q-py-none'
          : 'bg-primary q-px-sm q-py-sm full-width',
      ]"
      content-class="transparent"
      :content-style="[
        variant === 'mobile'
          ? { borderRadius }
          : { borderRadius, border: `1px solid ${colorWhite}` },
      ]"
      :style="[variant === 'mobile' ? {} : { borderRadius }]"
      :menu-offset="[0, 8]"
      dropdown-icon="svguse:icons/user_select/icons.svg#chevron-down"
      data-cy="user-select-input"
    >
      <template v-slot:label>
        <!-- User image -->
        <q-avatar :size="size" color="white" data-cy="avatar">
          <q-img
            :src="user?.image?.src"
            :alt="user?.first_name + ' ' + user?.last_name"
            :width="size"
            :height="size"
            img-class="object-contain"
            placeholder-src="~assets/svg/profile-placeholder.svg"
            data-cy="avatar-image"
          />
        </q-avatar>
        <!-- User name -->
        <div v-if="variant !== 'mobile'" class="col text-left q-ml-md ellipsis">
          {{ user.email }}
        </div>
      </template>
      <!-- User menu: Top -->
      <q-list
        dark
        bordered
        :style="{ borderRadius }"
        class="bg-primary"
        data-cy="user-select-menu"
      >
        <q-item
          dark
          v-for="option in menuTop"
          :key="option.title"
          tag="a"
          :to="option.url"
          active-class="menu-active-item"
          clickable
          v-close-popup
          data-cy="menu-item"
        >
          <q-item-label class="flex items-center">{{
            option.title
          }}</q-item-label>
        </q-item>
        <q-separator color="blue-grey-2 q-my-sm" />
        <q-item
          v-for="option in menuBottom"
          :key="option.title"
          tag="a"
          :to="option.url"
          clickable
          v-close-popup
          active-class="menu-active-item"
          data-cy="menu-item"
        >
          <q-item-label class="flex items-center">{{
            option.title
          }}</q-item-label>
        </q-item>
        <!-- Item logout -->
        <!-- TODO: add conditional display -->
        <q-item
          key="user-logout"
          tag="a"
          clickable
          v-close-popup
          @click="onLogout"
          data-cy="menu-item"
        >
          <q-item-label class="flex items-center">
            {{ $t('userSelect.logout') }}
          </q-item-label>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<style scoped lang="scss">
// hide dropdown arrow for mobile variant
.dropdown-arrow-hidden :deep(.q-btn-dropdown__arrow) {
  display: none;
}
:deep(.q-btn-dropdown__arrow) {
  width: 18px;
  height: 18px;
}
.menu-active-item {
  font-weight: 700;
}
</style>
