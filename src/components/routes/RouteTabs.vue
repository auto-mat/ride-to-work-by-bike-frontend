<script lang="ts">
/**
 * RouteTabs Component
 *
 * @description * Use this component to render tabs on the Routes page.
 *
 * @props
 * - `locked` (RouteTab[]): Array of tab names that are locked - disabled.
 * - `hidden` (RouteTab[]): Array of tab names that are hidden - not displayed.
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
import { Screen } from 'quasar';
import { computed, defineComponent, ref, watch } from 'vue';

// components
import RoutesApps from './RoutesApps.vue';
import RoutesCalendar from './RoutesCalendar.vue';
import RouteListDisplay from './RouteListDisplay.vue';
import RouteListEdit from './RouteListEdit.vue';
import RoutesMap from './RoutesMap.vue';

// enums
import { RouteTab } from '../types/Route';

// routes
import { routesConf } from 'src/router/routes_conf';

export default defineComponent({
  name: 'RouteTabs',
  components: {
    RoutesApps,
    RoutesCalendar,
    RouteListDisplay,
    RouteListEdit,
    RoutesMap,
  },
  props: {
    locked: {
      type: Array as () => RouteTab[],
      default: () => [],
    },
    hidden: {
      type: Array as () => RouteTab[],
      default: () => [],
    },
  },
  setup(props) {
    const routesCalendarTab = ref(null);
    const routesListTab = ref(null);
    // getter function for locked state
    const isLocked = (tab: RouteTab): boolean => {
      return props.locked.includes(tab);
    };
    const isHidden = (tab: RouteTab): boolean => {
      return props.hidden.includes(tab);
    };

    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    let activeTab = ref(RouteTab.list);
    if (isLargeScreen.value) {
      activeTab.value = RouteTab.calendar;
    }

    watch(isLargeScreen, (isLargeScreen) => {
      if (isLargeScreen) {
        routesCalendarTab.value.$el.click();
      } else {
        routesListTab.value.$el.click();
      }
    });

    return {
      activeTab,
      routesCalendarTab,
      routesListTab,
      routesConf,
      RouteTab,
      isLocked,
      isHidden,
      isLargeScreen,
    };
  },
});
</script>

<template>
  <div>
    <!-- Tab buttons -->
    <q-tabs
      inline-label
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      v-model="activeTab"
      align="center"
      data-cy="route-tabs"
    >
      <q-route-tab
        :class="{ hidden: isHidden(RouteTab.calendar) || !isLargeScreen }"
        :to="routesConf['routes_calendar'].path"
        :name="RouteTab.calendar"
        icon="mdi-calendar-blank"
        alert-icon="mdi-lock"
        :alert="isLocked(RouteTab.calendar)"
        :disable="isLocked(RouteTab.calendar)"
        :label="$t('routes.tabCalendar')"
        data-cy="route-tabs-button-calendar"
        ref="routesCalendarTab"
      />
      <q-route-tab
        v-if="!isHidden(RouteTab.list)"
        :to="routesConf['routes_list'].path"
        :name="RouteTab.list"
        icon="mdi-format-list-bulleted"
        alert-icon="mdi-lock"
        :alert="isLocked(RouteTab.list)"
        :disable="isLocked(RouteTab.list)"
        :label="$t('routes.tabList')"
        data-cy="route-tabs-button-list"
        ref="routesListTab"
      />
      <q-route-tab
        v-if="!isHidden(RouteTab.map)"
        :to="routesConf['routes_map'].path"
        :name="RouteTab.map"
        icon="mdi-map"
        alert-icon="mdi-lock"
        :alert="isLocked(RouteTab.map)"
        :disable="isLocked(RouteTab.map)"
        :label="$t('routes.tabMap')"
        data-cy="route-tabs-button-map"
      />
      <q-route-tab
        v-if="!isHidden(RouteTab.app)"
        :to="routesConf['routes_app'].path"
        :name="RouteTab.app"
        icon="mdi-cellphone"
        alert-icon="mdi-lock"
        :alert="isLocked(RouteTab.app)"
        :disable="isLocked(RouteTab.app)"
        :label="$t('routes.tabApp')"
        data-cy="route-tabs-button-app"
      />
    </q-tabs>
    <!-- Separator -->
    <q-separator />
    <!-- Tab panels -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Panel: Calendar -->
      <q-tab-panel
        v-if="!isHidden(RouteTab.calendar) && isLargeScreen"
        :name="RouteTab.calendar"
        data-cy="route-tabs-panel-calendar"
      >
        <routes-calendar />
      </q-tab-panel>
      <!-- Panel: List -->
      <q-tab-panel
        v-if="!isHidden(RouteTab.list)"
        :name="RouteTab.list"
        data-cy="route-tabs-panel-list"
      >
        <div class="text-h6">{{ $t('routes.tabList') }}</div>
        <route-list-edit data-cy="route-list-edit" />
        <route-list-display data-cy="route-list-display" />
      </q-tab-panel>
      <!-- Panel: Map -->
      <q-tab-panel
        v-if="!isHidden(RouteTab.map)"
        :name="RouteTab.map"
        data-cy="route-tabs-panel-map"
      >
        <div class="text-h6">{{ $t('routes.tabMap') }}</div>
        <RoutesMap />
      </q-tab-panel>
      <!-- Panel: App -->
      <q-tab-panel
        v-if="!isHidden(RouteTab.app)"
        :name="RouteTab.app"
        data-cy="route-tabs-panel-app"
      >
        <div class="text-h6">{{ $t('routes.tabApp') }}</div>
        <routes-apps data-cy="routes-apps" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
