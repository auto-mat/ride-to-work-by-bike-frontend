<script lang="ts">
/**
 * ProfilePage Component
 *
 * The `ProfilePage` displays information about user's profile.
 *
 * @components
 * - `ProfileTabs` - Component to display tabs in user profile.
 *
 * @layout
 * - `MainLayout`: Default layout with sidebar on desktop.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=X2rh1VOnQ1CkvTqG-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import PageHeading from 'components/global/PageHeading.vue';
import ProfileTabs from '../components/profile/ProfileTabs.vue';

export default defineComponent({
  name: 'ProfilePage',
  components: {
    PageHeading,
    ProfileTabs,
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="profile-page">
    <div class="q-px-lg bg-white q-pt-lg">
      <!-- Page title -->
      <page-heading data-cy="profile-page-title">
        {{ $t('profile.titleProfile') }}
      </page-heading>
    </div>
    <profile-tabs class="bg-white q-pb-xl" data-cy="profile-tabs" />
  </q-page>
</template>
