<script lang="ts">
/**
 * FormPersonalDetails Component
 *
 * The `FormPersonalDetails`
 *
 * @description * Use this component to display contact details form.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render name, surname, nickname...
 * - `FormFieldRadioRequired`: Component to render gender radio buttons.
 * - `FormFieldNewsletter`: Component to render newsletter subscription form with options.
 *
 * @example
 * <form-personal-details />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A102976&mode=dev)
 */

// libraries
import { computed, defineComponent, inject } from 'vue';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';
import FormFieldRadioRequired from './FormFieldRadioRequired.vue';
import FormFieldNewsletter from './FormFieldNewsletter.vue';

// composables
import { i18n } from '../../boot/i18n';
import { defaultLocale } from '../../i18n/def_locale';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { routesConf } from 'src/router/routes_conf';

// enums
import { Gender } from 'src/components/types/Profile';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { FormOption } from 'src/components/types/Form';
import type { RegisterChallengePersonalDetailsForm } from 'src/components/types/RegisterChallenge';
import type { Logger } from '../types/Logger';

import { getApiBaseUrlWithLang } from '../../utils/get_api_base_url_with_lang';

export default defineComponent({
  name: 'FormPersonalDetails',
  components: {
    FormFieldTextRequired,
    FormFieldRadioRequired,
    FormFieldNewsletter,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const store = useRegisterChallengeStore();

    const personalDetails = computed<RegisterChallengePersonalDetailsForm>({
      get: (): RegisterChallengePersonalDetailsForm => store.getPersonalDetails,
      set: (newVal: RegisterChallengePersonalDetailsForm): void =>
        store.setPersonalDetails(newVal),
    });

    const isUserOrganizationAdmin = computed(
      () => store.getIsUserOrganizationAdmin,
    );

    const getHasOrganizationAdmin = computed(
      () => store.getHasOrganizationAdmin,
    );

    const genderOptions: FormOption[] = [
      {
        label: i18n.global.t('global.man'),
        value: Gender.male,
      },
      {
        label: i18n.global.t('global.woman'),
        value: Gender.female,
      },
    ];

    const urlAppDataPrivacyPolicy = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlAppDataPrivacyPolicy,
        defaultLocale,
        i18n,
      );
    });

    const urlAppDataTermsOfService = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlAppDataTermsOfService,
        defaultLocale,
        i18n,
      );
    });

    const { challengeAllowRegisterOrganizationAdmin } = rideToWorkByBikeConfig;
    const urlRegisterAsCoordinator = routesConf['register_coordinator'].path;

    return {
      challengeAllowRegisterOrganizationAdmin,
      getHasOrganizationAdmin,
      genderOptions,
      isUserOrganizationAdmin,
      personalDetails,
      urlAppDataPrivacyPolicy,
      urlAppDataTermsOfService,
      urlRegisterAsCoordinator,
    };
  },
});
</script>

<template>
  <div>
    <div v-if="personalDetails" class="row q-col-gutter-md">
      <!-- Input: First name -->
      <div class="col-12 col-sm">
        <form-field-text-required
          v-model="personalDetails.firstName"
          name="firstName"
          label="form.labelFirstName"
          autocomplete="given-name"
          data-cy="form-personal-details-first-name"
        />
      </div>
      <!-- Input: Last name -->
      <div class="col-12 col-sm">
        <form-field-text-required
          v-model="personalDetails.lastName"
          name="lastName"
          label="form.labelLastName"
          autocomplete="family-name"
          data-cy="form-personal-details-last-name"
        />
      </div>
      <!-- Input: Nickname -->
      <div class="col-12">
        <div data-cy="form-personal-details-nickname">
          <label
            for="form-nickname"
            class="text-grey-10 text-caption text-bold"
          >
            {{ $t('form.labelNicknameOptional') }}
          </label>
          <q-input
            dense
            outlined
            type="text"
            v-model="personalDetails.nickname"
            name="nickname"
            :hint="$t('form.hintNickname')"
            id="form-nickname"
            class="q-mt-sm hint-no-padding"
            data-cy="form-nickname-input"
          />
        </div>
      </div>
      <!-- Input: Gender -->
      <div class="col-12" data-cy="form-personal-details-gender">
        <!-- Label -->
        <label for="form-gender" class="text-grey-10 text-caption text-bold">
          {{ $t('form.personalDetails.titleGender') }}
        </label>
        <!-- Radio group -->
        <form-field-radio-required
          inline
          v-model="personalDetails.gender"
          :options="genderOptions"
          :hint="$t('form.personalDetails.hintGender')"
          class="q-mt-sm"
        />
      </div>
      <!-- Link: Register as coordinator -->
      <div
        v-if="
          !isUserOrganizationAdmin &&
          !getHasOrganizationAdmin &&
          challengeAllowRegisterOrganizationAdmin === 'enable'
        "
        class="col-12"
        data-cy="form-personal-details-register-as-coordinator"
      >
        <p
          class="q-my-none q-mt-sm"
          data-cy="form-personal-details-register-as-coordinator-text"
        >
          {{ $t('register.form.hintRegisterAsCoordinator') }}
        </p>
        <div class="q-mt-xs q-mb-md">
          <router-link
            :to="urlRegisterAsCoordinator"
            class="text-grey-10"
            data-cy="form-personal-details-register-as-coordinator-link"
          >
            {{ $t('register.form.linkRegisterAsCoordinator') }}
          </router-link>
        </div>
      </div>
      <!-- Input: Newsletter -->
      <div class="col-12">
        <form-field-newsletter v-model="personalDetails.newsletter" />
      </div>
      <!-- Input: confirm consent -->
      <div class="col-12" data-cy="form-personal-details-terms">
        <q-field
          dense
          borderless
          hide-bottom-space
          :model-value="personalDetails.terms"
          :rules="[(val) => !!val || $t('form.messageTermsRequired')]"
        >
          <q-checkbox
            dense
            id="form-personal-details-terms"
            v-model="personalDetails.terms"
            color="primary"
            :true-value="true"
            :false-value="false"
            rules="required"
            class="text-grey-10"
            data-cy="form-terms-input"
          >
            <!-- Default slot: label -->
            <span>
              {{ $t('form.labelPrivacyConsent') }}
              <!-- Link: terms -->
              <a
                :href="urlAppDataPrivacyPolicy"
                target="_blank"
                class="text-primary"
                @click.stop
                data-cy="form-terms-link"
              >
                {{ $t('form.linkPrivacyConsent') }}
              </a>
              <span>{{ ` ${$t('global.and')} ` }}</span>
              <a
                :href="urlAppDataTermsOfService"
                target="_blank"
                class="text-primary"
                @click.stop
                data-cy="form-service-link"
              >
                {{ $t('form.linkTermsOfService') }} </a
              >.
            </span>
          </q-checkbox>
        </q-field>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hint-no-padding {
  .q-field__bottom {
    padding: 8px 0 0;
  }
}
</style>
