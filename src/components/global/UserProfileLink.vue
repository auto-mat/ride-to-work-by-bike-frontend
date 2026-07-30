<script lang="ts">
/**
 * UserProfileLink Component
 *
 * The `UserProfileLink` component provides a simple link to the user's
 * profile page, displaying their avatar and email.
 *
 * @description
 * This component renders a clickable link to the profile details page.
 * It displays the user's avatar and email (desktop only).
 *
 * @props
 * - `variant` (String: 'mobile' | 'desktop', default: 'desktop'):
 *   Determines the display style of the component.
 *
 * @example
 * <user-profile-link variant="desktop" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A103890&mode=dev)
 */

// libraries
import { computed, defineComponent } from 'vue';

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

    return {
      profileDetailsPath,
      size,
      user,
    };
  },
});
</script>

<template>
  <router-link
    :to="profileDetailsPath"
    class="user-profile-link"
    data-cy="user-profile-link"
  >
    <div class="flex items-center no-wrap">
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
      <!-- User email (desktop only) -->
      <div v-if="variant !== 'mobile'" class="col text-left q-ml-md ellipsis">
        {{ user.email }}
      </div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.user-profile-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
