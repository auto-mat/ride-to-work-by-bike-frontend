<script lang="ts">
/**
 * RouteTabs Component
 *
 * @description * Use this component to render tabs on the Routes page.
 *
 * @slots
 * - `calendar`: For calendar view.
 * - `list`: For list view.
 * - `map`: For map view.
 * - `app`: For a view of app links.
 *
 * @components
 * - `RoutesApps`: Component to render the Apps view.
 * - `RoutesCalendar`: Component to render the calendar view.
 * - `RouteListDisplay`: Component to render the list view (display mode)
 * - `RoutesListEdit`: Component to render the list view (edit mode)
 *
 * @example
 * <route-tabs></route-tabs>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A106366&mode=dev)
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import RoutesApps from './RoutesApps.vue';
import RouteListDisplay from './RouteListDisplay.vue';
import RouteListEdit from './RouteListEdit.vue';

// types
import type { RouteItem, RouteTab } from '../types/Route';

// routes
import { routesConf } from 'src/router/routes_conf';

// fixtures
import routeListFixture from '../../../test/cypress/fixtures/routeList.json';
// @ts-expect-error to cast routeListFixture to RouteItem type
const routeList: RouteItem[] = routeListFixture as RouteItem[];

export default defineComponent({
  name: 'RouteTabs',
  components: {
    RoutesApps,
    RouteListDisplay,
    RouteListEdit,
  },
  props: {
    locked: {
      type: Array as () => RouteTab[],
      default: () => [],
    },
  },
  setup(props) {
    const activeTab = ref('');
    // list locked tabs - exposed for testing and further logic
    const lockedTabs = props.locked;
    // getter function for locked state
    const isLocked = (tab: RouteTab): boolean => {
      if (!lockedTabs.length) return false;
      return lockedTabs.includes(tab);
    };

    return {
      activeTab,
      lockedTabs,
      routeList,
      routesConf,
      isLocked,
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
      data-cy="route-tabs"
    >
      <q-route-tab
        :to="routesConf['routes_calendar'].path"
        name="calendar"
        icon="mdi-calendar-blank"
        alert-icon="mdi-lock"
        :alert="isLocked('calendar')"
        :disable="isLocked('calendar')"
        :label="$t('routes.tabCalendar')"
        data-cy="route-tabs-button-calendar"
      />
      <q-route-tab
        :to="routesConf['routes_list'].path"
        name="list"
        icon="mdi-format-list-bulleted"
        alert-icon="mdi-lock"
        :alert="isLocked('list')"
        :disable="isLocked('list')"
        :label="$t('routes.tabList')"
        data-cy="route-tabs-button-list"
      />
      <q-route-tab
        :to="routesConf['routes_map'].path"
        name="map"
        icon="mdi-map"
        alert-icon="mdi-lock"
        :alert="isLocked('map')"
        :disable="isLocked('map')"
        :label="$t('routes.tabMap')"
        data-cy="route-tabs-button-map"
      />
      <q-route-tab
        :to="routesConf['routes_app'].path"
        name="app"
        icon="mdi-cellphone"
        alert-icon="mdi-lock"
        :alert="isLocked('app')"
        :disable="isLocked('app')"
        :label="$t('routes.tabApp')"
        data-cy="route-tabs-button-app"
      />
    </q-tabs>
    <!-- Separator -->
    <q-separator />
    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Panel: Calendar -->
      <q-tab-panel name="calendar" data-cy="route-tabs-panel-calendar">
        <div class="text-h6">{{ $t('routes.tabCalendar') }}</div>
      </q-tab-panel>
      <!-- Panel: List -->
      <q-tab-panel name="list" data-cy="route-tabs-panel-list">
        <div class="text-h6">{{ $t('routes.tabList') }}</div>
        <route-list-edit :routes="routeList" data-cy="route-list-edit" />
        <route-list-display :routes="routeList" data-cy="route-list-display" />
      </q-tab-panel>
      <!-- Panel: Map -->
      <q-tab-panel name="map" data-cy="route-tabs-panel-map">
        <div class="text-h6">{{ $t('routes.tabMap') }}</div>
      </q-tab-panel>
      <!-- Panel: App -->
      <q-tab-panel name="app" data-cy="route-tabs-panel-app">
        <div class="text-h6">{{ $t('routes.tabApp') }}</div>
        <routes-apps data-cy="routes-apps" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
