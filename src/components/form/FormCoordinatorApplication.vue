<script lang="ts">
/**
 * FormCoordinatorApplication Component
 *
 * @description * Use this component to render a form for applying for
 * the position of a company coordinator.
 *
 * Note: This component is commonly used in `CompanyCoordinatorPage`.
 *
 * Component uses lazy-rules="ondemand" which means that validation will be
 * triggered only when component’s validate() method is manually called or
 * when the wrapper QForm submits itself.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render required field.
 * - `FormFieldPhone`: Component to render required phone field.
 *
 * @example
 * <form-coordinator-application />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105730&t=0rvmPgpn944BuMav-1)
 */

// libraries
import { QForm } from 'quasar';
import { defineComponent, ref } from 'vue';

// composables
import { useValidation } from '../../composables/useValidation';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';
import FormFieldPhone from '../global/FormFieldPhone.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'FormCoordinatorApplication',
  components: {
    FormFieldTextRequired,
    FormFieldPhone,
  },
  setup() {
    const phone = ref('');
    const position = ref('');
    const responsibility = ref(false);
    const terms = ref(false);

    const { isPhone } = useValidation();
    const formCoordinatorApplicationRef = ref<typeof QForm | null>(null);
    const onSubmit = () => {
      formCoordinatorApplicationRef.value?.validate();
    };

    const { challengeMonth } = rideToWorkByBikeConfig;

    return {
      challengeMonth,
      formCoordinatorApplicationRef,
      phone,
      position,
      responsibility,
      terms,
      isPhone,
      onSubmit,
    };
  },
});
</script>

<template>
  <q-form
    ref="formCoordinatorApplicationRef"
    data-cy="form-coordinator-application"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <!-- Input: Company job position -->
        <form-field-text-required
          v-model="position"
          name="name"
          label="form.labelYourPosition"
          data-cy="form-coordinator-position"
        />
      </div>
      <div class="col-12 col-sm-6">
        <!-- Input: Telephone number -->
        <form-field-phone
          v-model="phone"
          name="phone"
          label="form.labelYourPhone"
          data-cy="form-coordinator-phone"
        />
      </div>
      <div class="col-12">
        <!-- Input: Coordinator's responsibilities -->
        <q-field
          dense
          borderless
          hide-bottom-space
          :model-value="responsibility"
          :rules="[(val) => !!val || $t('form.messageResponsibilityRequired')]"
          data-cy="form-coordinator-responsibility"
        >
          <q-checkbox
            dense
            id="form-coordinator-terms"
            v-model="responsibility"
            color="primary"
            :true-value="true"
            :false-value="false"
            rules="required"
            class="text-grey-10"
            data-cy="form-responsibility-input"
          >
            <!-- Default slot: label -->
            <span>
              {{ $t('form.labelCoordinatorResponsibility') }}
            </span>
          </q-checkbox>
        </q-field>
      </div>
      <div class="col-12">
        <!-- Input: Terms and conditions -->
        <q-field
          dense
          borderless
          hide-bottom-space
          :model-value="terms"
          :rules="[(val) => !!val || $t('form.messageTermsRequired')]"
          data-cy="form-coordinator-terms"
        >
          <q-checkbox
            dense
            id="form-coordinator-terms"
            v-model="terms"
            color="primary"
            :true-value="true"
            :false-value="false"
            rules="required"
            class="text-grey-10"
            data-cy="form-terms-input"
          >
            <!-- Link: consent -->
            <span>
              {{ $t('form.labelPrivacyConsent') }}
              <!-- TODO: Link to privacy consent page -->
              <a
                href="#"
                target="_blank"
                class="text-primary"
                @click.stop
                data-cy="form-terms-link"
                >{{ $t('form.linkPrivacyConsent') }}</a
              >
            </span>
            {{ $t('global.and') }}
            <!-- Link: terms -->
            <span>
              <!-- TODO: Link to terms page -->
              <a
                href="#"
                target="_blank"
                class="text-primary"
                @click.stop
                data-cy="form-terms-link"
                >{{ $t(`form.labelTermsChallenge.${challengeMonth}`) }}</a
              >.
            </span>
          </q-checkbox>
        </q-field>
      </div>
      <div class="col-12 flex justify-end">
        <!-- Button: submit -->
        <q-btn
          rounded
          unelevated
          type="submit"
          color="primary"
          :label="$t('form.buttonCoordinatorApplication')"
          @click.prevent="onSubmit"
          class="q-mt-lg"
          data-cy="form-coordinator-submit"
        />
      </div>
    </div>
  </q-form>
</template>
