<script lang="ts">
/**
 * FormFieldPassword Component
 *
 * The `FormFieldPassword` displays password input.
 *
 * @description * Use this component to render password input in forms.
 *
 * Note: This component is commonly used in `FormRegisterCoordinator`,
 * `FormChallenge`.
 *
 * @props
 * - `value` (string, required): The object representing user input.
 *   It should be of type `string`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-password-register />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6385%3A26514&mode=dev)
 */

// libraries
import { computed, defineComponent, ref } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';

export default defineComponent({
  name: 'FormFieldPassword',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String as () => 'white' | 'transparent',
      default: 'transparent',
    },
    testing: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const password = computed({
      get() {
        return props.modelValue;
      },
      set(value: string) {
        emit('update:modelValue', value);
      },
    });

    const { isFilled, isStrongPassword } = useValidation();

    const isHiddenPassword = ref(true);

    return {
      password,
      isHiddenPassword,
      isFilled,
      isStrongPassword,
    };
  },
});
</script>

<template>
  <div class="col-12 col-sm-6" data-cy="form-register-coordinator-password">
    <!-- Label -->
    <label
      for="form-register-coordinator-password"
      class="text-caption text-bold"
    >
      {{ $t('register.coordinator.form.labelPassword') }}
    </label>
    <!-- Input -->
    <q-input
      dense
      outlined
      hide-bottom-space
      v-model="password"
      id="form-register-coordinator-password"
      :hint="$t('register.coordinator.form.hintPassword')"
      :type="isHiddenPassword ? 'password' : 'text'"
      :rules="[
        (val) =>
          isFilled(val) ||
          $t('register.coordinator.form.messageFieldRequired', {
            fieldName: $t('register.coordinator.form.labelPassword'),
          }),
        (val) =>
          isStrongPassword(val) ||
          $t('register.coordinator.form.messagePasswordStrong'),
      ]"
      lazy-rules
      class="q-mt-sm"
      data-cy="form-register-coordinator-password-input"
    >
      <!-- Icon: show password -->
      <template v-slot:append>
        <q-icon
          color="primary"
          :name="isHiddenPassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          size="18px"
          @click="isHiddenPassword = !isHiddenPassword"
          data-cy="form-register-coordinator-password-icon"
        />
      </template>
    </q-input>
  </div>
</template>
