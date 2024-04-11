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
 * - `RoutesCalendar`: Component to render the calendar view.
 * - `RoutesListDisplay`: Component to render the list view (display mode)
 * - `RoutesListEdit`: Component to render the list view (edit mode)
 *
 * @example
 * <route-tabs></route-tabs>
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A106366&mode=dev)
 */

// libraries
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

// composables
import { useUrlParams } from '../../composables/useUrlParams';

// types
import type { Ref } from 'vue';
import type { RouteTab } from '../types/Route';

export default defineComponent({
  name: 'RouteTabs',
  props: {
    locked: {
      type: Array as () => RouteTab[],
      default: () => [],
    },
  },
  setup(props) {
    const { setUrlParam, getUrlParam } = useUrlParams();
    // active tab with default value from URL
    const activeTab: Ref<RouteTab> = ref(
      getUrlParam('activeTab', 'calendar') as RouteTab,
    );
    // function to set active tab and write into URL
    const setActiveTab = (tab: string | number) => {
      activeTab.value = String(tab) as RouteTab;
      setUrlParam('activeTab', String(tab));
    };
    // change tab on popstate
    const handlePopstate = () => {
      activeTab.value = getUrlParam('activeTab', 'calendar') as RouteTab;
    };
    // initialize popstate listener
    onMounted(() => {
      window.addEventListener('popstate', handlePopstate);
    });
    onUnmounted(() => {
      window.removeEventListener('popstate', handlePopstate);
    });

    // list locked tabs - exposed for testing and further logic
    const lockedTabs = props.locked;
    // getter function for locked state
    const isLocked = (tab: RouteTab): boolean => {
      return lockedTabs.includes(tab);
    };

    return {
      activeTab,
      lockedTabs,
      isLocked,
      setActiveTab,
    };
  },
});
</script>

<template>
  <div>
    <!-- Tab buttons -->
    <q-tabs
      v-model="activeTab"
      inline-label
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="center"
      data-cy="route-tabs"
    >
      <q-tab
        name="calendar"
        icon="mdi-calendar-blank"
        alert-icon="mdi-lock"
        :alert="isLocked('calendar')"
        :disable="isLocked('calendar')"
        :label="$t('routes.tabCalendar')"
        data-cy="route-tabs-button-calendar"
      />
      <q-tab
        name="list"
        icon="mdi-format-list-bulleted"
        alert-icon="mdi-lock"
        :alert="isLocked('list')"
        :disable="isLocked('list')"
        :label="$t('routes.tabList')"
        data-cy="route-tabs-button-list"
      />
      <q-tab
        name="map"
        icon="mdi-map"
        alert-icon="mdi-lock"
        :alert="isLocked('map')"
        :disable="isLocked('map')"
        :label="$t('routes.tabMap')"
        data-cy="route-tabs-button-map"
      />
      <q-tab
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
    <q-tab-panels
      v-model="activeTab"
      animated
      @transition="setActiveTab($event)"
    >
      <!-- Panel: Calendar -->
      <q-tab-panel name="calendar" data-cy="route-tabs-panel-calendar">
        <div class="text-h6">Mails</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <!-- Panel: List -->
      <q-tab-panel name="list" data-cy="route-tabs-panel-list">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <!-- Panel: Map -->
      <q-tab-panel name="map" data-cy="route-tabs-panel-map">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <!-- Panel: App -->
      <q-tab-panel name="app" data-cy="route-tabs-panel-app">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
