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
import LoginRegisterHeader from 'components/LoginRegisterHeader.vue';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

export default defineComponent({
  name: 'RegisterCoordinatorPage',
  components: {
    LoginRegisterHeader,
  },
  setup() {
    const challengeMonth = rideToWorkByBikeConfig.challengeMonth;
    const containerWidth = rideToWorkByBikeConfig.containerWidth;

    return {
      challengeMonth,
      containerWidth,
    };
  },
});
</script>

<template>
  <q-page padding class="bg-secondary">
    <!-- Page header -->
    <login-register-header data-cy="login-register-header" />

    <!-- Container -->
    <div class="q-mx-auto q-mt-xl row" :style="{ 'max-width': containerWidth }">
      <!-- Page title -->
      <h1
        class="col-sm-6 text-h5 text-bold text-white q-my-none"
        data-cy="login-register-title"
        v-html="$t(`register.coordinator.title.${challengeMonth}`)"
      ></h1>
    </div>
  </q-page>
</template>

<style scoped lang="scss"></style>
