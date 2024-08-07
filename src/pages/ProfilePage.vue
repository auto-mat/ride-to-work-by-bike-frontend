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

// components
import ProfileTabs from '../components/profile/ProfileTabs.vue';

export default {
  name: 'ProfilePage',
  components: {
    ProfileTabs,
  },
};
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white q-pb-xl q-pt-lg">
      <!-- Page title -->
      <div>
        <h1
          class="text-h5 q-my-none text-weight-bold"
          data-cy="profile-page-title"
        >
          {{ $t('profile.titleProfile') }}
        </h1>
      </div>
    </div>
    <profile-tabs class="bg-white" data-cy="profile-tabs" />
  </q-page>
</template>
