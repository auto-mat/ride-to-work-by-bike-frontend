<script lang="ts">
/**
 * ProfileTabs Component
 *
 * @description * Use this component to render tabs on the Profile page.
 * Note: Used on `ProfilePage`.
 *
 * @components
 * - `NewsletterFeature`: Component to display a newsletter section.
 * - `ProfileDetails`: Component to display a ProfileDetails section.
 * - `ProfileQuestionnaires`: Component to display a table of questionnaires.
 * - `TableNotifications`: Component to display a table of notifications.
 *
 * @example
 * <profile-tabs />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=X2rh1VOnQ1CkvTqG-1)
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import NewsletterFeature from '../homepage/NewsletterFeature.vue';
import ProfileDetails from './ProfileDetails.vue';
import ProfileQuestionnaires from './ProfileQuestionnaires.vue';
import TableNotifications from './TableNotifications.vue';

// routes
import { routesConf } from '../../router/routes_conf';

enum tabsProfile {
  details = 'details',
  questionnaires = 'questionnaires',
  newsletter = 'newsletter',
  notifications = 'notifications',
  none = '',
}

export default defineComponent({
  name: 'ProfileTabs',
  components: {
    NewsletterFeature,
    ProfileDetails,
    ProfileQuestionnaires,
    TableNotifications,
  },
  setup() {
    const activeTab = ref(tabsProfile.none);

    return {
      activeTab,
      routesConf,
      tabsProfile,
    };
  },
});
</script>

<template>
  <div>
    <!-- Tab buttons -->
    <q-tabs
      inline-label
      v-model="activeTab"
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="center"
      data-cy="profile-tabs"
    >
      <q-route-tab
        :to="routesConf['profile_details'].path"
        :name="tabsProfile.details"
        :label="$t('profile.tabDetails')"
        data-cy="profile-tabs-button-details"
      />
      <q-route-tab
        :to="routesConf['profile_forms'].path"
        :name="tabsProfile.questionnaires"
        :label="$t('profile.tabForms')"
        data-cy="profile-tabs-button-questionnaires"
      />
      <q-route-tab
        :to="routesConf['profile_newsletter'].path"
        :name="tabsProfile.newsletter"
        :label="$t('profile.tabNewsletter')"
        data-cy="profile-tabs-button-newsletter"
      />
      <q-route-tab
        :to="routesConf['profile_notifications'].path"
        :name="tabsProfile.notifications"
        :label="$t('profile.tabNotifications')"
        data-cy="profile-tabs-button-notifications"
      />
    </q-tabs>
    <!-- Separator -->
    <q-separator />
    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Panel: Details -->
      <q-tab-panel
        :name="tabsProfile.details"
        class="q-px-lg"
        data-cy="profile-tabs-panel-details"
      >
        <profile-details />
      </q-tab-panel>
      <!-- Panel: Questionnaires -->
      <q-tab-panel
        :name="tabsProfile.questionnaires"
        data-cy="profile-tabs-panel-questionnaires"
      >
        <profile-questionnaires />
      </q-tab-panel>
      <!-- Panel: Newsletter -->
      <q-tab-panel
        :name="tabsProfile.newsletter"
        data-cy="profile-tabs-panel-newsletter"
      >
        <newsletter-feature class="q-mt-lg" />
      </q-tab-panel>
      <!-- Panel: Notifications -->
      <q-tab-panel
        :name="tabsProfile.notifications"
        data-cy="profile-tabs-panel-notifications"
      >
        <table-notifications />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
