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
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6356%3A25476&mode=dev)
 */

// libraries
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// components
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';
import FormRegisterCoordinator from 'components/register/FormRegisterCoordinator.vue';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';
import { routesConf } from 'src/router/routes_conf';

// stores
import { useRegisterChallengeStore } from 'stores/registerChallenge';

export default defineComponent({
  name: 'RegisterCoordinatorPage',
  components: {
    LoginRegisterHeader,
    FormRegisterCoordinator,
  },
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();
    const router = useRouter();

    onMounted(async () => {
      await registerChallengeStore.checkIsUserOrganizationAdmin();
      // if user is admin of organization, redirect to home page
      if (registerChallengeStore.getIsUserOrganizationAdmin) {
        if (router) {
          logger?.debug(
            `User is organization admin <${registerChallengeStore.getIsUserOrganizationAdmin}>,` +
              ` redirect to home page <${routesConf['home'].path}> URL.`,
          );
          router.push(routesConf['home'].path);
        }
      }
    });

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const challengeMonth = rideToWorkByBikeConfig.challengeMonth;
    const containerFormWidth = rideToWorkByBikeConfig.containerFormWidth;
    const urlRegisterAsUser = routesConf['register_challenge'].path;

    return {
      borderRadius,
      challengeMonth,
      containerFormWidth,
      urlRegisterAsUser,
    };
  },
});
</script>

<template>
  <q-page padding class="text-grey-10">
    <!-- Page header -->
    <login-register-header data-cy="login-register-header" />

    <!-- Container -->
    <div
      class="q-mx-auto q-mt-xl row"
      :style="{ 'max-width': containerFormWidth }"
    >
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
        <!-- Link: Register as a participant -->
        <div class="q-mt-md">
          <router-link
            :to="urlRegisterAsUser"
            class="text-grey-10"
            data-cy="info-link-register-as-participant"
          >
            {{ $t('register.form.linkRegisterAsParticipant') }}
          </router-link>
        </div>
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
