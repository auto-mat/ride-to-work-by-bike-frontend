<script lang="ts">
/**
 * EmailConfirmation Component
 *
 * @description * Renders a confirmation message after user registers,
 * prompting user to confirm their address by clicking the link in the email.
 *
 * @example
 * <email-confirmation />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-103494&t=6I4I349ASWWgGjGu-1)
 */

// libraries
import { colors } from 'quasar';
import { computed, defineComponent } from 'vue';

// stores
import { useRegisterStore } from '../../stores/register';

export default defineComponent({
  name: 'EmailConfirmation',
  setup() {
    const registerStore = useRegisterStore();
    const email = computed(() => registerStore.getEmail);

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const white = getPaletteColor('white');
    const whiteOpacity20 = changeAlpha(white, 0.2);

    return {
      email,
      white,
      whiteOpacity20,
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
        :style="{ backgroundColor: whiteOpacity20 }"
        :color="white"
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
      class="q-mb-xl"
      v-html="$t('register.form.textEmailConfirmation', { email })"
    />
    <!-- Link: Register again -->
    <div data-cy="email-confirmation-wrong-email-hint">
      {{ $t('register.form.hintWrongEmail') }}
      <router-link
        class="text-white"
        to="register"
        data-cy="email-confirmation-register-link"
        >{{ $t('register.form.linkRegister') }}</router-link
      >.
    </div>
  </div>
</template>
