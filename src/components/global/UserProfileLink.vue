<script lang="ts">
/**
 * UserProfileLink Component
 *
 * Use `UserProfileLink` component to show user name, email and avatar.
 *
 * @description
 * This component renders a clickable link to the profile details page.
 * It displays the user's avatar, name, and email.
 *
 * @props
 * - `variant` (String: 'mobile' | 'desktop', default: 'desktop'):
 *   Determines the display style of the component (avatar size).
 *
 * @example
 * <user-profile-link variant="desktop" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104854&t=kp1Z2vv2Dow2rIyb-1)
 */

// libraries
import { computed, defineComponent, reactive } from 'vue';

// config
import { routesConf } from '../../router/routes_conf';

// stores
import { useLoginStore } from '../../stores/login';

export default defineComponent({
  name: 'UserProfileLink',
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
    const profileDetailsPath =
      routesConf['profile_details']['children']['fullPath'];
    const size = computed(() => (props.variant === 'mobile' ? '32px' : '40px'));

    const qItemCssClass = reactive({
      flex: true,
      'items-center': true,
      'no-wrap': true,
      'q-pa-none': true,
      'rounded-borders': true,
      'bg-black': window.Cypress,
    });

    return {
      qItemCssClass,
      profileDetailsPath,
      size,
      user,
    };
  },
});
</script>

<template>
  <router-link
    :to="profileDetailsPath ? profileDetailsPath : ''"
    class="user-profile-link"
    data-cy="user-profile-link"
  >
    <q-item dense clickable :class="qItemCssClass">
      <!-- User avatar -->
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
      <!-- User info -->
      <q-item-section class="q-ml-md">
        <!-- User name -->
        <q-item-label
          class="text-body1 text-white ellipsis"
          data-cy="profile-name"
          >{{ user?.first_name + ' ' + user?.last_name }}</q-item-label
        >
        <!-- User email -->
        <q-item-label
          caption
          lines="1"
          class="text-white"
          data-cy="profile-email"
          >{{ user?.email }}</q-item-label
        >
      </q-item-section>
    </q-item>
  </router-link>
</template>

<style scoped lang="scss">
.user-profile-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
