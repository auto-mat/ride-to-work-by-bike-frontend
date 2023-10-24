<script lang="ts">
/**
 * FormLogin Component
 *
 * The `FormLogin`
 *
 * @description * Use this component to render login form.
 * Login form contains password reset.
 *
 * @events
 * - `formSubmit`: Emitted on form submit.
 *
 * @example
 * <form-login />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6274%3A28441&mode=dev)
 */

import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'FormLogin',
  emits: ['formSubmit'],
  setup(props, { emit }) {
    const formLogin = reactive({
      email: '',
      password: '',
    });

    const isPwd = ref(true)

    const isValid = (val: string): boolean => val?.length > 0;

    const onSubmit = () => {
      emit('formSubmit');
      // noop
    };

    return {
      formLogin,
      isPwd,
      isValid,
      onSubmit,
    };
  },
});
</script>

<template>
  <q-form @submit.prevent="onSubmit">
    <div data-cy="form-login-email">
      <label for="form-login-email" class="text-caption text-bold">
        {{ $t('login.form.email') }}
      </label>
      <q-input
        dense
        outlined
        v-model="formLogin.email"
        id="form-login-email"
        name="subject"
        lazy-rules
        color="white"
        :rules="[(val) => isValid(val) || $t('login.form.emailReqired')]"
        class="q-mt-sm"
        data-cy="contact-form-subject-input" />
    </div>
    <div data-cy="form-login-password">
      <label for="form-login-password" class="text-caption text-bold">
        {{ $t('login.form.password') }}
      </label>
      <q-input
        v-model="formLogin.password"
        id="form-login-password"
        filled
        :type="isPwd ? 'password' : 'text'"
        :rules="[(val) => isValid(val) || $t('login.form.passwordRequired')]"
        hint="Password with toggle"
      >
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
        </template>
      </q-input>

    </div>
  </q-form>
</template>
