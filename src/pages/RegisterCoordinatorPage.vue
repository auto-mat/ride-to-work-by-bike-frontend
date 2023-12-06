<script lang="ts">
/**
 * RegisterCoordinatorPage Component
 *
 * The `RegisterCoordinatorPage` displays registration form for coordinators.
 *
 * @description * Use this component to allow users to register with the
 * role of a coordinator.
 *
 * @components
 * - `LoginRegisterHeader`: Header for login and registration pages.
 *
 * @layout
 * - `LoginRegisterLayout`: Layout for login and registration pages.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// components
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';
import FormRegisterCoordinator from 'components/register/FormRegisterCoordinator.vue';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

export default defineComponent({
  name: 'RegisterCoordinatorPage',
  components: {
    LoginRegisterHeader,
    FormRegisterCoordinator,
  },
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const challengeMonth = rideToWorkByBikeConfig.challengeMonth;
    const containerWidth = rideToWorkByBikeConfig.containerWidth;

    return {
      borderRadius,
      challengeMonth,
      containerWidth,
    };
  },
});
</script>

<template>
  <q-page padding class="bg-grey-6 text-grey-10">
    <!-- Page header -->
    <login-register-header data-cy="login-register-header" />

    <!-- Container -->
    <div class="q-mx-auto q-mt-xl row" :style="{ 'max-width': containerWidth }">
      <!-- Page title -->
      <h1
        class="col-sm-6 text-h5 text-bold text-white q-my-none"
        data-cy="register-coordinator-title"
        v-html="$t(`register.coordinator.title.${challengeMonth}`)"
      ></h1>

      <!-- Card: information -->
      <div
        class="col-12 q-pa-lg q-mt-lg bg-secondary"
        :style="{ 'border-radius': borderRadius }"
        data-cy="info-card"
      >
        <h2 class="text-body1 text-bold q-my-none" data-cy="info-title">
          {{ $t('register.coordinator.titleInfo') }}
        </h2>
        <div
          class="text-subtitle2 text-weight-regular q-mt-sm"
          v-html="$t('register.coordinator.info')"
          data-cy="info-content"
        ></div>
      </div>

      <div
        class="col-12 q-pa-lg q-mt-lg bg-white"
        :style="{ 'border-radius': borderRadius }"
      >
        <form-register-coordinator data-cy="register-coordinator-form" />
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
// last paragraph of the card
:deep(p:last-child) {
  margin-bottom: 0;
}
</style>
