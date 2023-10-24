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

// libraries
import { defineComponent, ref, reactive } from 'vue';
import { setCssVar } from 'quasar';

// types
import { ConfigGlobal } from 'components/types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
setCssVar('primary', rideToWorkByBikeConfig.colorPrimary);

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
    <!-- Input: email -->
    <div data-cy="form-login-email">
      <!-- Label -->
      <label for="form-login-email" class="text-caption text-bold">
        {{ $t('login.form.email') }}
      </label>
      <!-- Input -->
      <q-input
        dense
        outlined
        v-model="formLogin.email"
        :rules="[(val) => isValid(val) || $t('login.form.emailReqired')]"
        bg-color="grey-1"
        id="form-login-email"
        name="subject"
        class="q-mt-sm"
        data-cy="form-login-email-input" />
    </div>
    <!-- Input: password -->
    <div data-cy="form-login-password">
      <!-- Label -->
      <label for="form-login-password" class="text-caption text-bold">
        {{ $t('login.form.password') }}
      </label>
      <!-- Input -->
      <q-input
        dense
        outlined
        hide-bottom-space
        bg-color="grey-1"
        v-model="formLogin.password"
        id="form-login-password"
        :type="isPwd ? 'password' : 'text'"
        :rules="[(val) => isValid(val) || $t('login.form.passwordRequired')]"
        class="q-mt-sm"
        data-cy="form-login-password-input"
      >
        <!-- Icon: show password -->
        <template v-slot:append>
          <q-icon color="primary" :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" size="18px" @click="isPwd = !isPwd" data-cy="form-login-password-icon" />
        </template>
      </q-input>
      <!-- Link: fogotten password -->
      <div class="flex justify-end q-mt-sm">
        <a href="#" class="text-caption">Forgotten password?</a>
      </div>
    </div>
  </q-form>
</template>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
  &:before {
    border-color: transparent;
  }
}
</style>
