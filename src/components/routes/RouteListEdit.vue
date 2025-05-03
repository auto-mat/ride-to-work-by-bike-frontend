<script lang="ts">
/**
 * RouteListEdit Component
 *
 * @description * Use this component to render routes which can be edited
 * by the user. The number of routes to log is defined by global config var
 * `challengeLoggingWindowDays`.
 *
 * @components
 * - `RouteItemEdit`: Component to render a single route in edit mode.
 *
 * @example
 * <route-list-edit :routes="routes" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A104042&mode=dev)
 */

// libraries
import { Notify, Screen } from 'quasar';
import { computed, defineComponent, inject, ref, watch } from 'vue';
import type { QForm } from 'quasar';

// adapters
import { tripsAdapter } from '../../adapters/tripsAdapter';

// component
import RouteItemEdit from './RouteItemEdit.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useApiPostTrips } from '../../composables/useApiPostTrips';
import { useRoutes } from 'src/composables/useRoutes';

// enums
import { TransportDirection } from '../types/Route';

// stores
import { useTripsStore } from 'src/stores/trips';

// types
import type { Logger } from '../types/Logger';
import type { RouteItem, RouteDay } from '../types/Route';

export default defineComponent({
  name: 'RouteListEdit',
  components: {
    RouteItemEdit,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const tripsStore = useTripsStore();

    const isLoadingTrips = computed((): boolean => {
      return tripsStore.getIsLoading;
    });

    // route composables
    const {
      isEntryEnabled,
      getLoggableDaysWithRoutes,
      formatDate,
      formatDateName,
    } = useRoutes();

    // initialize API composable
    const { postTrips } = useApiPostTrips(logger);

    // get route items from store
    const routeItems = computed<RouteItem[]>(() => tripsStore.getRouteItems);

    const days = ref<RouteDay[]>(getLoggableDaysWithRoutes(routeItems.value));
    // update current days when route items change in store
    watch(routeItems, () => {
      days.value = getLoggableDaysWithRoutes(routeItems.value);
    });

    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    /**
     * Get all route items that are dirty
     */
    const routeItemsDirty = computed<RouteItem[]>((): RouteItem[] => {
      const routeItems = days.value.flatMap((day) => [
        day.fromWork,
        day.toWork,
      ]);
      return routeItems.filter((routeItem) => routeItem.dirty) as RouteItem[];
    });

    // dirty state will be tracked within UI to show change count
    const dirtyCount = computed((): number => routeItemsDirty.value.length);

    const formRef = ref<QForm | null>(null);

    const onSave = async (): Promise<void> => {
      logger?.info('Saving selected routes.');
      // validate form before submitting
      const isValid = await formRef.value?.validate();
      if (!isValid) {
        Notify.create({
          type: 'negative',
          message: i18n.global.t('postTrips.messageFormValidationFailed'),
        });
        return;
      }
      // if entry is not enabled, show notification
      if (!isEntryEnabled.value) {
        Notify.create({
          type: 'negative',
          message: i18n.global.t('postTrips.messageEntryNotEnabled'),
        });
        return;
      }
      // send to API
      const response = await postTrips(routeItemsDirty);
      // handle success
      if (
        response.success &&
        response.data?.trips &&
        response.data.trips.length > 0
      ) {
        logger?.info('Routes saved successfully.');
        logger?.debug(
          `Saved trips <${JSON.stringify(response.data.trips, null, 2)}>.`,
        );
        // convert saved trips to route items
        const savedRouteItems = response.data.trips.map((trip) =>
          tripsAdapter.toRouteItem(trip),
        );
        logger?.info('Saving new routes to store.');
        // update store with new route items
        tripsStore.updateRouteItems(savedRouteItems);
        logger?.debug(
          `Updated store route items <${JSON.stringify(tripsStore.getRouteItems, null, 2)}>.`,
        );
      }
    };

    return {
      days,
      dirtyCount,
      formatDate,
      formatDateName,
      isLargeScreen,
      isLoadingTrips,
      onSave,
      routeItemsDirty,
      TransportDirection,
      formRef,
    };
  },
});
</script>

<template>
  <div>
    <q-form ref="formRef" data-cy="route-list-edit">
      <!-- First save routes button on the large screen -->
      <div
        v-if="isLargeScreen"
        class="flex items-center justify-center q-mt-lg"
      >
        <q-btn
          rounded
          unelevated
          type="submit"
          color="primary"
          size="16px"
          class="text-weight-bold"
          :loading="isLoadingTrips"
          :disable="isLoadingTrips || dirtyCount === 0"
          data-cy="button-save-top"
          @click.prevent="onSave"
        >
          {{
            $t('routes.buttonSaveChangesCount', dirtyCount, {
              count: dirtyCount,
            })
          }}
        </q-btn>
      </div>
      <!-- Item: Day -->
      <div
        v-for="(day, index) in days"
        :key="day.date"
        :class="index === 0 ? 'q-mb-lg' : 'q-my-lg'"
        data-cy="route-list-day"
      >
        <!-- Title: Date -->
        <h3
          class="text-18 text-grey-10 q-my-none"
          data-cy="route-list-day-date"
        >
          {{ formatDateName(day.date) }} ({{ formatDate(day.date) }})
        </h3>
        <div class="q-py-md" :data-date="day.date">
          <div class="row q-col-gutter-lg">
            <!-- Item: Route to work -->
            <div class="col-12 col-sm-6" data-cy="route-list-item-wrapper">
              <route-item-edit
                :route="day.toWork"
                :edited-routes="routeItemsDirty"
                class="full-height"
                data-cy="route-list-item"
                :data-direction="TransportDirection.toWork"
                :data-id="day.toWork?.id"
                @update:route="day.toWork = $event"
              />
            </div>
            <!-- Item: Route from work -->
            <div class="col-12 col-sm-6" data-cy="route-list-item-wrapper">
              <route-item-edit
                :route="day.fromWork"
                :edited-routes="routeItemsDirty"
                class="full-height"
                data-cy="route-list-item"
                :data-direction="TransportDirection.fromWork"
                :data-id="day.fromWork?.id"
                @update:route="day.fromWork = $event"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Save routes button on the large screen -->
      <div v-if="isLargeScreen" class="flex items-center justify-center">
        <q-btn
          rounded
          unelevated
          type="submit"
          color="primary"
          size="16px"
          class="text-weight-bold"
          :loading="isLoadingTrips"
          :disable="isLoadingTrips || dirtyCount === 0"
          data-cy="button-save-bottom"
          @click.prevent="onSave"
        >
          {{
            $t('routes.buttonSaveChangesCount', dirtyCount, {
              count: dirtyCount,
            })
          }}
        </q-btn>
      </div>
      <!-- Sticky save routes button on the mobile screen -->
      <teleport to="body">
        <q-layout v-if="!isLargeScreen" style="min-height: 0">
          <q-page-sticky position="bottom" :offset="[0, 80]">
            <div class="bg-white" style="border-radius: 999px">
              <q-btn
                rounded
                unelevated
                type="submit"
                color="primary"
                size="16px"
                class="text-weight-bold"
                :loading="isLoadingTrips"
                :disable="isLoadingTrips || dirtyCount === 0"
                data-cy="button-save-sticky"
                @click.prevent="onSave"
              >
                {{
                  $t('routes.buttonSaveChangesCount', dirtyCount, {
                    count: dirtyCount,
                  })
                }}
              </q-btn>
            </div>
          </q-page-sticky>
        </q-layout>
      </teleport>
    </q-form>
    <!-- Loading spinner -->
    <q-inner-loading
      :showing="isLoadingTrips"
      color="primary"
      data-cy="spinner-route-list-edit"
    />
  </div>
</template>
