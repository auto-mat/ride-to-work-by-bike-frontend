<script lang="ts">
/**
 * DrawerHeader Component
 *
 * The `DrawerHeader` component represents the header section of the sidebar.
 * It primarily controls modal help dialog and displays notifications.
 *
 * @description
 * This component is used at the top of the sidebar drawer (on desktop)
 * or in the header section (on mobile).
 *
 * @props
 * - `showLogo` (Boolean, default: true): Determines if the logo should be displayed.
 * - `mobile` (Boolean, default: false): Determines if the component is rendered on mobile.
 *
 * @components
 * - `ButtonNotifications` Component to render notifications.
 * - `HeaderLogo` Component to render logo.
 * - `HelpButton` Component to render help button.
 * - `UserSelect` Component to render user menu.
 *
 * @example
 * <drawer-header :showLogo="isLogoShown" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=2709%3A42457&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// import components
import ButtonNotifications from './ButtonNotifications.vue';
import HeaderLogo from './HeaderLogo.vue';
import HelpButton from './HelpButton.vue';
import UserSelect from './UserSelect.vue';

export default defineComponent({
  name: 'DrawerHeader',
  components: {
    ButtonNotifications,
    HeaderLogo,
    HelpButton,
    UserSelect,
  },
  props: {
    showLogo: {
      type: Boolean,
      default: true,
    },
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const classes = computed((): string => {
      return props.showLogo ? 'justify-between' : 'justify-end';
    });

    const iconSize = '18px';

    return {
      classes,
      iconSize,
    };
  },
});
</script>

<template>
  <div
    class="full-width flex items-center justify-between q-py-sm"
    :class="classes"
  >
    <!-- RTWBB logo -->
    <div>
      <header-logo v-if="showLogo" data-cy="header-logo" />
    </div>
    <!-- Content -->
    <div class="flex items-center gap-24">
      <!-- Help icon link for displaying modal dialog-->
      <help-button>
        <template #button="{ openDialog }">
          <q-btn
            unelevated
            round
            color="primary"
            size="8px"
            @click.prevent="openDialog"
            data-cy="button-help"
          >
            <q-icon
              name="svguse:/icons/button_icons.svg#question-mark"
              :size="iconSize"
              color="white"
              data-cy="icon-help"
            />
          </q-btn>
        </template>
      </help-button>
      <!-- Notification icon link -->
      <button-notifications />
      <!-- User menu dropdown -->
      <user-select
        v-if="mobile"
        variant="mobile"
        class="lt-md"
        data-cy="user-select-mobile"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo {
  height: 40px;
}
</style>
