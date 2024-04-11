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
  setup() {
    const { setUrlParam, getUrlParam } = useUrlParams();
    const activeTab: Ref<RouteTab> = ref(
      getUrlParam('activeTab', 'calendar') as RouteTab,
    );
    const setActiveTab = (tab: string | number) => {
      activeTab.value = String(tab) as RouteTab;
      setUrlParam('activeTab', String(tab));
    };
    const handlePopstate = () => {
      activeTab.value = getUrlParam('activeTab', 'calendar') as RouteTab;
    };
    onMounted(() => {
      window.addEventListener('popstate', handlePopstate);
    });
    onUnmounted(() => {
      window.removeEventListener('popstate', handlePopstate);
    });

    return {
      activeTab,
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
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="center"
    >
      <q-tab name="calendar" label="Calendar" />
      <q-tab name="list" label="List" />
      <q-tab name="map" label="Map" />
      <q-tab name="app" label="App" />
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
      <q-tab-panel name="calendar">
        <div class="text-h6">Mails</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <!-- Panel: List -->
      <q-tab-panel name="list">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <!-- Panel: Map -->
      <q-tab-panel name="map">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <!-- Panel: App -->
      <q-tab-panel name="app">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
