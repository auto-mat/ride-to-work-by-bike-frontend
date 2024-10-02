<script lang="ts">
/**
 * EmailConfirmation Component
 *
 * @description * Use this component to ... .
 * You can adjust its appearance by ... .
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @slots
 * - `content`: For ... .
 *   exposed props and methods:
 *     - `state`
 *
 * @components
 * - `CHILD`: Component to ... .
 *
 * @example
 * <email-confirmation />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-103496&t=PEybZ3QfO934YQow-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// stores
import { useRegisterStore } from '../../stores/register';

export default defineComponent({
  name: 'EmailConfirmation',
  setup() {
    const registerStore = useRegisterStore();
    const email = computed(() => registerStore.getEmail);

    return {
      email,
    };
  },
});
</script>

<template>
  <div class="bg-primary text-white" data-cy="email-confirmation">
    <!-- Heading -->
    <div class="q-mb-lg">
      <h1
        class="text-h5 text-bold q-my-none"
        data-cy="email-confirmation-title"
      >
        {{ $t('register.form.titleEmailConfirmation') }}
      </h1>
    </div>
    <div
      data-cy="email-confirmation-text"
      class="q-mb-xl"
      v-html="$t('register.form.textEmailConfirmation', { email })"
    />
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
