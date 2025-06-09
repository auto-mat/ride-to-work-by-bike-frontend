<script lang="ts">
/**
 * StravaApp Component
 *
 * @description * Use this component to render a banner for Strava integration
 * in the `RoutesApps` view. It displays the connection status and allows
 * users to connect/disconnect their Strava account.

 * @example
 * <strava-app />
 */

// libraries
import { Screen } from 'quasar';
import { computed, defineComponent, onMounted, ref } from 'vue';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// stores
import { useStravaStore } from '../../stores/strava';

// enums
import { StravaScope } from '../enums/Strava';

export default defineComponent({
  name: 'StravaApp',
  setup() {
    const isSyncAll = ref<boolean>(false);
    const stravaStore = useStravaStore();

    const stravaUserAccount = computed(() => {
      return stravaStore.getAccount;
    });

    const userInfo = computed(() => {
      if (!stravaUserAccount.value) {
        return '';
      }
      if (!stravaUserAccount.value.strava_username) {
        return `${stravaUserAccount.value.first_name} ${stravaUserAccount.value.last_name}`;
      }
      return `${stravaUserAccount.value.first_name} ${stravaUserAccount.value.last_name} (${stravaUserAccount.value.strava_username})`;
    });

    const syncError = computed<string>((): string => {
      if (
        stravaUserAccount.value?.sync_outcome?.result &&
        'error' in stravaUserAccount.value.sync_outcome.result
      ) {
        return stravaUserAccount.value.sync_outcome.result?.error || '';
      }
      return '';
    });

    const showSyncLimitWarning = computed<boolean>((): boolean => {
      return stravaStore.getIsNearSyncLimit;
    });

    const showSyncButton = computed<boolean>((): boolean => {
      return !stravaStore.getHasReachedSyncLimit;
    });

    const hasSyncResult = computed<boolean>((): boolean => {
      return !!stravaStore.getSyncResult;
    });

    const userActivities = computed<string[]>((): string[] => {
      return stravaStore.getSyncResult?.activities || [];
    });

    const newTripsCount = computed<number>((): number => {
      return stravaStore.getSyncResult?.new_trips || 0;
    });

    const syncedTripsCount = computed<number>((): number => {
      return stravaStore.getSyncResult?.synced_trips || 0;
    });

    const syncedActivitiesCount = computed<number>((): number => {
      return stravaStore.getSyncResult?.synced_activities || 0;
    });

    const hashtagTo = computed<string>((): string => {
      return stravaStore.getHashtagTo || '';
    });

    const hashtagFrom = computed<string>((): string => {
      return stravaStore.getHashtagFrom || '';
    });

    onMounted(async () => {
      // allows Cypress component test to register intercept
      if (window.Cypress) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (!stravaStore.getAccount) {
        await stravaStore.loadAccount();
      }
    });

    const handleConnect = async (): Promise<void> => {
      const scope: StravaScope = isSyncAll.value
        ? StravaScope.readAll
        : StravaScope.read;
      await stravaStore.loadAuthUrl(scope);
      if (stravaStore.getAuthUrl) {
        window.location.href = stravaStore.getAuthUrl;
      }
    };

    const handleDisconnect = async (): Promise<void> => {
      await stravaStore.disconnectAccount();
    };

    const handleSync = async (): Promise<void> => {
      await stravaStore.syncAccount();
    };

    const { urlFaq, urlHelpdesk, urlStravaPrivacyZones } =
      rideToWorkByBikeConfig;

    const textMaxWidth = Screen.sizes.sm;

    return {
      isSyncAll,
      stravaStore,
      stravaUserAccount,
      handleConnect,
      handleDisconnect,
      handleSync,
      userInfo,
      newTripsCount,
      syncedTripsCount,
      syncedActivitiesCount,
      hashtagTo,
      hashtagFrom,
      hasSyncResult,
      syncError,
      textMaxWidth,
      showSyncButton,
      showSyncLimitWarning,
      urlFaq,
      urlHelpdesk,
      urlStravaPrivacyZones,
      userActivities,
    };
  },
});
</script>

<template>
  <div data-cy="strava-app">
    <!-- List -->
    <q-expansion-item
      header-class="rounded-borders"
      data-cy="strava-app-expansion-item"
    >
      <template v-slot:header>
        <div
          class="full-width row items-center gap-8"
          data-cy="strava-app-expansion-item-header"
        >
          <!-- Image -->
          <q-img
            src="/image/logo-strava.webp"
            alt=""
            :ratio="1"
            width="48px"
            height="48px"
            class="col-shrink-0 rounded-borders q-mr-md"
            data-cy="strava-app-image"
          />
          <!-- Text -->
          <div class="col flex items-center justify-between gap-8">
            <!-- Title -->
            <h3 class="text-body1 q-my-none" data-cy="strava-app-title">
              {{ $t('routes.appStrava') }}
            </h3>
            <!-- Buttons -->
            <div class="flex items-center gap-8 q-mr-md">
              <!-- Status (linked) -->
              <q-chip
                v-if="stravaStore.getIsConnected"
                color="secondary"
                class="col-shrink-0 text-teal-10"
                icon="check"
                data-cy="strava-app-chip-linked"
              >
                {{ $t('routes.statusLinked') }}
              </q-chip>
            </div>
          </div>
        </div>
      </template>
      <!-- Metadata -->
      <div class="q-pa-md text-body2">
        <!-- Info: User is connected -->
        <div v-if="stravaStore.getIsConnected">
          <div
            v-if="stravaUserAccount"
            class="flex items-center gap-8 justify-between q-my-sm"
          >
            <!-- Text: Connected user -->
            <p data-cy="strava-app-connected-user" class="q-my-none">
              {{ $t('routes.statusConnectedUser', { userInfo }) }}
            </p>
            <!-- Chip: Sync error -->
            <q-chip
              v-if="syncError"
              color="negative"
              text-color="white"
              class="q-mx-none q-my-sm"
              data-cy="strava-app-chip-error"
              >{{ $t('routes.labelSyncError') }}</q-chip
            >
            <!-- Chip: Sync success -->
            <q-chip
              v-else-if="stravaStore.getLastSyncTime"
              size="sm"
              class="q-mx-none q-my-sm"
              data-cy="strava-app-chip-success"
              >{{ $t('routes.labelLastSync') }}:
              {{ $d(new Date(stravaStore.getLastSyncTime), 'numeric') }}
            </q-chip>
          </div>
          <div
            class="q-my-sm text-pretty"
            :style="{ 'max-width': `${textMaxWidth}px` }"
          >
            <!-- Info: Sync error -->
            <template v-if="syncError">
              <p data-cy="strava-app-status-sync-error">
                {{
                  $t('routes.statusSyncErrorWithMessage', {
                    message: syncError,
                  })
                }}
              </p>
            </template>
            <template v-else-if="hasSyncResult">
              <!-- Info: User has synced trips -->
              <template v-if="syncedTripsCount">
                <p data-cy="strava-app-status-sync-success">
                  {{ $t('routes.statusSyncSuccess') }}
                </p>
                <p
                  class="text-weight-medium"
                  data-cy="strava-app-status-synced-trips"
                >
                  {{
                    $t('routes.statusSyncedTrips', {
                      syncedTrips: syncedTripsCount,
                      newTrips: newTripsCount,
                    })
                  }}
                </p>
              </template>
              <!-- Info: User has no synced trips -->
              <template v-else-if="hasSyncResult">
                <p data-cy="strava-app-instruction-sync-trips-from-strava">
                  {{
                    $t('routes.instructionSyncTripsFromStrava', {
                      syncedActivities: syncedActivitiesCount,
                      hashtagTo,
                      hashtagFrom,
                    })
                  }}
                </p>
                <p data-cy="strava-app-instruction-sync-read-all-settings">
                  {{ $t('routes.instructionSyncReadAllSettings') }}
                </p>
              </template>
              <template v-if="userActivities?.length">
                <p data-cy="strava-app-user-activities-title">
                  {{ $t('routes.titleUserActivities') }}:
                </p>
                <ul data-cy="strava-app-user-activities-list">
                  <li v-for="activity in userActivities" :key="activity">
                    {{ activity }}
                  </li>
                </ul>
              </template>
              <template v-if="showSyncLimitWarning">
                <p
                  data-cy="strava-app-instruction-sync-warn-user"
                  v-html="
                    $t('routes.instructionSyncWarnUser', { url: urlHelpdesk })
                  "
                ></p>
              </template>
            </template>
          </div>
          <div class="q-mt-lg flex items-center gap-8">
            <!-- Button: Sync -->
            <q-btn
              v-if="showSyncButton"
              unelevated
              outline
              rounded
              color="primary"
              class="bg-white"
              :loading="stravaStore.getIsLoading"
              :disabled="stravaStore.getIsLoading"
              @click="handleSync"
              data-cy="strava-app-sync-button"
            >
              {{ $t('routes.buttonSync') }}
            </q-btn>
            <!-- Button: Disconnect -->
            <q-btn
              v-if="stravaStore.getIsConnected"
              unelevated
              outline
              rounded
              color="negative"
              class="bg-white"
              :loading="stravaStore.getIsLoading"
              :disabled="stravaStore.getIsLoading"
              @click="handleDisconnect"
              data-cy="strava-app-disconnect-button"
            >
              {{ $t('routes.buttonDisconnect') }}
            </q-btn>
          </div>
        </div>
        <!-- Info: User is not connected -->
        <div v-else>
          <div
            class="text-pretty"
            :style="{ 'max-width': `${textMaxWidth}px` }"
          >
            <h3
              class="text-subtitle1 q-mb-none"
              data-cy="strava-app-title-not-connected"
            >
              {{ $t('routes.titleStravaNotConnected') }}
            </h3>
            <!-- Option: Scope -->
            <q-toggle
              v-model="isSyncAll"
              :label="$t('routes.labelSyncAll')"
              class="q-my-md"
              data-cy="strava-app-sync-all-toggle"
            />
            <p
              v-html="
                $t('routes.instructionStravaNotConnected', {
                  url: urlStravaPrivacyZones,
                })
              "
              data-cy="strava-app-instruction-not-connected"
            ></p>
            <h3 class="text-subtitle1" data-cy="strava-app-title-how-it-works">
              {{ $t('routes.titleStravaHowItWorks') }}
            </h3>
            <p
              v-html="$t('routes.instructionStravaHowItWorks', { url: urlFaq })"
              data-cy="strava-app-instruction-how-it-works"
            ></p>
          </div>
          <div class="q-mt-lg flex items-center gap-8">
            <!-- Button: Connect -->
            <q-btn
              v-if="!stravaStore.getIsConnected"
              unelevated
              outline
              rounded
              color="primary"
              class="bg-white"
              :disabled="stravaStore.getIsLoading"
              :loading="stravaStore.getIsLoading"
              @click="handleConnect"
              data-cy="strava-app-connect-button"
            >
              {{ $t('routes.buttonLinkToApp') }}
            </q-btn>
          </div>
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<style lang="scss">
.text-pretty {
  text-wrap: pretty;
}
</style>
