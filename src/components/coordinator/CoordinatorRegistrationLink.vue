<script lang="ts">
/**
 * CoordinatorRegistrationLink Component
 *
 * @description * Use this component to show an information banner when a user
 * is a company coordinator/admin but has not completed their registration
 * into the challenge.
 *
 * Note: This component is used on `ProfilePage`.
 *
 * @example
 * <coordinator-registration-link />
 */

// libraries
import { Screen, colors } from 'quasar';
import { computed, defineComponent } from 'vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// router
import { routesConf } from '../../router/routes_conf';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

export default defineComponent({
  name: 'CoordinatorRegistrationLink',
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();
    const { borderRadiusCardSmall: borderRadius } = rideToWorkByBikeConfig;
    const { getPaletteColor, changeAlpha } = colors;
    const primary = getPaletteColor('primary');
    const primaryOpacity = changeAlpha(
      primary,
      rideToWorkByBikeConfig.colorPrimaryOpacity,
    );

    const isLargeScreen = computed((): boolean => {
      return Screen.gt.sm;
    });

    const showBanner = computed((): boolean => {
      return (
        registerChallengeStore.getIsUserOrganizationAdmin === true &&
        !registerChallengeStore.getIsRegistrationComplete
      );
    });

    const registrationRoute = {
      name: routesConf['register_challenge']['children']['name'],
    };

    return {
      borderRadius,
      isLargeScreen,
      primaryOpacity,
      registrationRoute,
      showBanner,
    };
  },
});
</script>

<template>
  <q-banner
    v-if="showBanner"
    dense
    :inline-actions="isLargeScreen"
    rounded
    class="text-grey-10"
    :style="{ 'border-radius': borderRadius, backgroundColor: primaryOpacity }"
    data-cy="coordinator-registration-link"
  >
    <!-- Banner text -->
    <div class="q-ma-none q-px-sm" data-cy="coordinator-registration-link-text">
      {{ $t('coordinator.textBannerRegistrationIncomplete') }}
    </div>
    <template v-slot:action>
      <!-- Button: Go to registration -->
      <q-btn
        flat
        color="primary"
        :label="$t('coordinator.buttonGoToRegistration')"
        :to="registrationRoute"
        data-cy="coordinator-registration-link-button"
      />
    </template>
  </q-banner>
</template>
