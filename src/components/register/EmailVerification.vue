<script lang="ts">
/**
 * EmailVerification Component
 *
 * @description * Renders a confirmation message after user registers,
 * prompting user to confirm their address by clicking the link in the email.
 *
 * @example
 * <email-verification />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-103494&t=6I4I349ASWWgGjGu-1)
 */

// libraries
import { colors } from 'quasar';
import { computed, defineComponent, inject, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { routesConf } from '../../router/routes_conf';

// stores
import { useRegisterStore } from '../../stores/register';

// types
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'EmailVerification',
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const registerStore = useRegisterStore();
    const email = computed(() => registerStore.getEmail);
    const isEmailVerified = computed(() => registerStore.getIsEmailVerified);

    const checkIsEmailVerified = async (): void => {
      if (!isEmailVerified.value) {
        logger?.info(
          'Check if email is verified by <checkIsEmailVerified()> function.',
        );
        await registerStore.checkEmailVerification();
      } else {
        logger?.debug(
          'Email is verified, disable <checkIsEmailVerified()>' +
            ` function runned in every <${rideToWorkByBikeConfig.checkIsEmailVerifiedInterval}> seconds.`,
        );
        clearTimeout(checkIsEmailVerifiedId);
      }
    };
    logger?.debug(
      'Email verification process <checkIsEmailVerified()> function' +
        ` run in every <${rideToWorkByBikeConfig.checkIsEmailVerifiedInterval}> seconds.`,
    );
    const checkIsEmailVerifiedId = setInterval(
      checkIsEmailVerified,
      rideToWorkByBikeConfig.checkIsEmailVerifiedInterval * 1000,
    );
    // check email verification on page load
    onMounted(() => {
      checkIsEmailVerified();
    });
    const router = useRouter();
    // once email is verified, redirect to home page
    watch(isEmailVerified, (newValue) => {
      if (newValue) {
        logger?.debug(
          `Email address <${email.value}> was verified successfully, redirect to <${routesConf['home']['path']}> URL.`,
        );
        router.push(routesConf['home']['path']);
      }
    });

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const white = getPaletteColor('white');
    const whiteOpacity = changeAlpha(
      white,
      rideToWorkByBikeConfig.opacityWhiteBackground,
    );

    return {
      email,
      white,
      whiteOpacity,
    };
  },
});
</script>

<template>
  <div class="bg-primary text-white" data-cy="email-verification">
    <!-- Graphics -->
    <div class="q-mb-lg" data-cy="email-verification-graphics">
      <q-avatar
        size="64px"
        :style="{ backgroundColor: whiteOpacity }"
        :color="white"
        data-cy="email-verification-avatar"
      >
        <!-- Icon -->
        <q-icon
          size="40px"
          color="white"
          name="svguse:icons/email_confirmation/icons.svg#email"
          data-cy="email-verification-icon"
        />
      </q-avatar>
    </div>
    <!-- Heading -->
    <div class="q-mb-lg">
      <h1
        class="text-h5 text-bold q-my-none"
        data-cy="email-verification-title"
      >
        {{ $t('register.form.titleEmailVerification') }}
      </h1>
    </div>
    <!-- Text -->
    <div
      data-cy="email-verification-text"
      class="q-mb-xl"
      v-html="$t('register.form.textEmailVerification', { email })"
    />
    <!-- Link: Register again -->
    <div data-cy="email-verification-wrong-email-hint">
      {{ $t('register.form.hintWrongEmail') }}
      <router-link
        class="text-white"
        to="register"
        data-cy="email-verification-register-link"
        >{{ $t('register.form.linkRegister') }}</router-link
      >.
    </div>
  </div>
</template>
