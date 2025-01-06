<script lang="ts">
/**
 * EmailConfirmation Component
 *
 * @description * Renders a confirmation message after user clicks
 * on confirmation email link.
 *
 * @example
 * <email-confirmation />
 */

// libraries
import { colors } from 'quasar';
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { routesConf } from '../../router/routes_conf';

// stores
import { useRegisterStore } from '../../stores/register';
import { useLoginStore } from '../../stores/login';

export default defineComponent({
  name: 'EmailConfirmation',

  setup() {
    const loginStore = useLoginStore();
    const registerStore = useRegisterStore();
    const router = useRouter();
    const route = useRoute();
    const key = route.query.key;
    const email = route.query.email;

    if (typeof key !== 'string' || typeof email !== 'string') {
      if (loginStore.isUserLoggedIn) {
        router.push(routesConf['verify_email']['path']);
      } else {
        router.push(routesConf['register']['path']);
      }
    }

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const whiteOpacity = changeAlpha(
      getPaletteColor('white'),
      rideToWorkByBikeConfig.colorWhiteBackgroundOpacity,
    );

    const confirmEmail = async () => {
      const result = await registerStore.confirmEmail(key as string);
      if (result) router.push(routesConf['register_challenge']['path']);
    };

    return {
      confirmEmail,
      key,
      email,
      router,
      registerStore,
      whiteOpacity,
    };
  },
});
</script>

<template>
  <div class="bg-primary text-white" data-cy="email-confirmation">
    <!-- Graphics -->
    <div class="q-mb-lg" data-cy="email-confirmation-graphics">
      <q-avatar
        size="64px"
        :style="{ backgroundColor: whiteOpacity, color: 'white' }"
        data-cy="email-confirmation-avatar"
      >
        <!-- Icon -->
        <q-icon
          size="40px"
          color="white"
          name="svguse:icons/email_confirmation/icons.svg#email"
          data-cy="email-confirmation-icon"
        />
      </q-avatar>
    </div>
    <!-- Heading -->
    <div class="q-mb-lg">
      <h1
        class="text-h5 text-bold q-my-none"
        data-cy="email-confirmation-title"
      >
        {{ $t('register.form.titleEmailConfirmation') }}
      </h1>
    </div>
    <!-- Text -->
    <div
      data-cy="email-confirmation-text"
      v-html="$t('register.form.textEmailConfirmation', { email })"
    />
    <q-btn
      @click="confirmEmail"
      unelevated
      rounded
      padding="xs xl"
      type="button"
      color="secondary q-mt-lg"
      text-color="primary"
      :label="$t('register.form.submitConfirmation')"
      data-cy="email-confirmation-submit"
    />
  </div>
</template>
