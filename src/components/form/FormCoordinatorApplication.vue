<script lang="ts">
/**
 * FormCoordinatorApplication Component
 *
 * @description * Use this component to render a form for applying for
 * the position of a company coordinator.
 *
 * Note: This component is commonly used in `BecomeCoordinatorPage`.
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
import { QForm, Notify } from 'quasar';
import { defineComponent, ref, inject, reactive } from 'vue';

// adapters
import { registerCoordinatorAdapter } from '../../adapters/registerCoordinatorAdapter';

// composables
import { useValidation } from '../../composables/useValidation';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';
import FormFieldPhone from '../global/FormFieldPhone.vue';
import ShowRegisterChallengeStoreValues from '../debug/ShowRegisterChallengeStoreValues.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// i18n
import { i18n } from '../../boot/i18n';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useRegisterStore } from '../../stores/register';

// types
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'FormCoordinatorApplication',
  components: {
    FormFieldTextRequired,
    FormFieldPhone,
    ShowRegisterChallengeStoreValues,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const registerChallengeStore = useRegisterChallengeStore();
    const registerStore = useRegisterStore();

    // Get initial values from store (create independent copies)
    const personalDetails = registerChallengeStore.getPersonalDetails;
    const organizationId = registerChallengeStore.getOrganizationId;

    // Create reactive form data initialized from store with independent values
    const formCoordinatorData = reactive({
      firstName: personalDetails.firstName || '',
      lastName: personalDetails.lastName || '',
      organizationId: organizationId,
      jobTitle: '',
      newsletter: personalDetails.newsletter || [],
      phone: '',
      responsibility: false,
      terms: personalDetails.terms || false,
    });

    const { challengeMonth } = rideToWorkByBikeConfig;

    const { isPhone } = useValidation();

    const formCoordinatorApplicationRef = ref<typeof QForm | null>(null);
    const onSubmit = async () => {
      // check that internal values are loaded and not empty
      if (!formCoordinatorData.firstName || !formCoordinatorData.lastName) {
        Notify.create({
          type: 'negative',
          message: i18n.global.t(
            'registerCoordinator.messageMissingPersonalDetails',
          ),
        });
        return;
      }
      if (!formCoordinatorData.organizationId) {
        Notify.create({
          type: 'negative',
          message: i18n.global.t(
            'registerCoordinator.messageMissingOrganizationId',
          ),
        });
        return;
      }
      // create payload for submission
      const payload =
        registerCoordinatorAdapter.registerCoordinatorToApiPayload(
          formCoordinatorData,
        );
      logger?.debug(
        `Register coordinator payload <${JSON.stringify(payload)}>`,
      );
      if (!payload) {
        Notify.create({
          type: 'negative',
          message: i18n.global.t('form.messageCoordinatorPayloadError'),
        });
        return;
      }

      await registerStore.registerCoordinator(payload, false);

      // reset form
      formCoordinatorApplicationRef.value?.reset();
    };

    const onReset = () => {
      formCoordinatorData.jobTitle = '';
      formCoordinatorData.phone = '';
      formCoordinatorData.responsibility = false;
      formCoordinatorData.terms = true;
    };

    return {
      challengeMonth,
      formCoordinatorApplicationRef,
      formCoordinatorData,
      isPhone,
      onSubmit,
      onReset,
    };
  },
});
</script>

<template>
  <q-form
    autofocus
    @submit.prevent="onSubmit"
    @reset="onReset"
    ref="formCoordinatorApplicationRef"
    data-cy="form-coordinator-application"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <!-- Input: Company job position -->
        <form-field-text-required
          v-model="formCoordinatorData.jobTitle"
          name="name"
          label="form.labelYourPosition"
          data-cy="form-coordinator-position"
        />
      </div>
      <div class="col-12 col-sm-6">
        <!-- Input: Telephone number -->
        <form-field-phone
          v-model="formCoordinatorData.phone"
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
          :model-value="formCoordinatorData.responsibility"
          :rules="[(val) => !!val || $t('form.messageResponsibilityRequired')]"
          data-cy="form-coordinator-responsibility"
        >
          <q-checkbox
            dense
            id="form-coordinator-responsibility"
            v-model="formCoordinatorData.responsibility"
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
          :model-value="formCoordinatorData.terms"
          :rules="[(val) => !!val || $t('form.messageTermsRequired')]"
          data-cy="form-coordinator-terms"
        >
          <q-checkbox
            dense
            id="form-coordinator-terms"
            v-model="formCoordinatorData.terms"
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
          class="q-mt-lg"
          data-cy="form-coordinator-submit"
        />
      </div>
    </div>
    <!-- Debug component: Show register challenge store values -->
    <show-register-challenge-store-values :keys="['getTelephone']" />
  </q-form>
</template>
