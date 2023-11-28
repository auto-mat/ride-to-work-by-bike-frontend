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
 *
 * @components
 * - `MenuLinks`: Component to display navigation links.
 * - `ListFaq`: Component to display a list of frequently asked questions.
 * - `ContactForm`: Component for a contact form.
 * - `UserSelect`: Component to allow user selection or user-related actions.
 * - `DialogStates`: Component for displaying dialogs with switchable states.
 *
 * @example
 * <drawer-header :showLogo="isLogoShown" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=2709%3A42457&mode=dev)
 */

// libraries
import { defineComponent, computed } from 'vue';

// import components
import HelpButton from './HelpButton.vue';
import UserSelect from './UserSelect.vue';

export default defineComponent({
  name: 'DrawerHeader',
  components: {
    HelpButton,
    UserSelect,
  },
  props: {
    showLogo: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const classes = computed((): string => {
      return props.showLogo ? 'justify-between' : 'justify-end';
    });

    return {
      classes,
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
    <img
      class="logo"
      src="~assets/svg/logo.svg"
      :alt="$t('index.logoAltText')"
      data-cy="logo"
    />
    <!-- Content -->
    <div class="flex items-center gap-24">
      <!-- Help icon link for displaying modal dialog-->
      <help-button size="8px" />
      <!-- Notification icon link -->
      <a href="#">
        <q-icon
          name="notifications"
          size="sm"
          color="black"
          data-cy="icon-notification"
        />
      </a>
      <!-- User menu dropdown -->
      <user-select variant="mobile" class="lt-md" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo {
  height: 40px;
}
</style>
