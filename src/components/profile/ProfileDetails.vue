<script lang="ts">
/**
 * ProfileDetails Component
 *
 * @description * Use this component to display a ProfileDetails section
 * on the profile page.
 * Note: This component is used on `ProfilePage` in `ProfileTabs` component.
 *
 * @components
 * - `DetailsItem`: Component to display a row of data.
 * - `FormUpdateEmail`: Component to render a form for updating email.
 * - `FormUpdateGender`: Component to render a form for updating gender.
 * - `FormUpdateNickname`: Component to render a form for updating nickname.
 * - `LanguageSwitcher`: Component to render a language switcher.
 * - `SectionHeading`: Component to render a section heading.
 * - `DeleteAccount`: Component to render delete account section with
 * confirmation dialog.
 *
 * @example
 * <profile-details />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=31rhAtfu6ZZ8sEf1-1)
 */

// libraries
import { Notify } from 'quasar';
import { computed, defineComponent, inject, onMounted } from 'vue';

// adapters
import { registerChallengeAdapter } from '../../adapters/registerChallengeAdapter';
import { subsidiaryAdapter } from '../../adapters/subsidiaryAdapter';

// components
import DetailsItem from '../profile/DetailsItem.vue';
import FormUpdateEmail from '../form/FormUpdateEmail.vue';
import FormUpdateGender from '../form/FormUpdateGender.vue';
import FormUpdateNickname from '../form/FormUpdateNickname.vue';
import FormUpdatePhone from '../form/FormUpdatePhone.vue';
import LanguageSwitcher from '../global/LanguageSwitcher.vue';
import ProfileCoordinatorContact from './ProfileCoordinatorContact.vue';
import SectionHeading from '../global/SectionHeading.vue';
import DeleteAccount from './DeleteAccount.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useApiPutRegisterChallenge } from '../../composables/useApiPutRegisterChallenge';
import { useOrganizations } from '../../composables/useOrganizations';

// enums
import { Gender } from '../types/Profile';
import { PaymentSubject } from '../../components/enums/Payment';

// fixtures
import formPersonalDetails from '../../../test/cypress/fixtures/formPersonalDetails.json';

// stores
import { useLoginStore } from '../../stores/login';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { Logger } from '../types/Logger';
import type { ToApiPayloadStoreState } from '../../components/types/ApiRegistration';

// utils
import { getGenderLabel } from '../../utils/get_gender_label';

export default defineComponent({
  name: 'ProfileDetails',
  components: {
    DetailsItem,
    FormUpdateEmail,
    FormUpdateGender,
    FormUpdateNickname,
    FormUpdatePhone,
    LanguageSwitcher,
    ProfileCoordinatorContact,
    SectionHeading,
    DeleteAccount,
  },
  setup() {
    // TODO: Enable additional elements
    const isEnabledCoordinatorContact = false;
    const isEnabledDeleteAccount = false;
    const isEnabledDownloadInvoice = false;
    const isEnabledPackageState = false;
    const isEnabledTrackingNumber = false;

    const logger = inject('vuejs3-logger') as Logger | null;
    const iconSize = '18px';

    const loginStore = useLoginStore();
    const registerChallengeStore = useRegisterChallengeStore();
    // refresh on mounted
    onMounted(async () => {
      await registerChallengeStore.loadRegisterChallengeToStore();
      // load all data
      if (!registerChallengeStore.getOrganizations.length) {
        registerChallengeStore.loadOrganizationsToStore(logger);
      }
      if (!registerChallengeStore.getTeams.length) {
        registerChallengeStore.loadTeamsToStore(logger);
      }
      if (!registerChallengeStore.getSubsidiaries.length) {
        registerChallengeStore.loadSubsidiariesToStore(logger);
      }
      if (!registerChallengeStore.getMerchandiseItems.length) {
        registerChallengeStore.loadMerchandiseToStore(logger);
      }
    });

    // profile details
    const profile = computed(() => {
      return registerChallengeStore.getPersonalDetails;
    });

    const registrationId = computed(() => {
      return registerChallengeStore.getRegistrationId;
    });

    const { getOrganizationLabels } = useOrganizations();
    const organizationType = computed(() => {
      return getOrganizationLabels(registerChallengeStore.getOrganizationType)
        .labelShort;
    });

    const organization = computed(() => {
      const org = registerChallengeStore.getOrganizations.find(
        (organization) =>
          organization.id === registerChallengeStore.getOrganizationId,
      );
      if (org) {
        return org.name;
      }
      return '';
    });

    const subsidiary = computed(() => {
      const sub = registerChallengeStore.getSubsidiaries.find(
        (subsidiary) =>
          subsidiary.id === registerChallengeStore.getSubsidiaryId,
      );
      if (sub) {
        return subsidiaryAdapter.fromFormCompanyAddressFieldsToString(
          sub.address,
        );
      }
      return '';
    });

    const team = computed(() => {
      const team = registerChallengeStore.getTeams.find(
        (team) => team.id === registerChallengeStore.getTeamId,
      );
      if (team) {
        return team.name;
      }
      return '';
    });

    const merchandiseItem = computed(() => {
      return registerChallengeStore.getMerchandiseItems.find(
        (item) => item.id === registerChallengeStore.getMerchId,
      );
    });

    const merchandiseItemLabel = computed(() => {
      if (merchandiseItem.value) {
        return merchandiseItem.value.label;
      }
      // if no merch is selected (ID not found in merchandiseItems)
      else if (registerChallengeStore.getMerchId) {
        return i18n.global.t('form.merch.labelNoMerch');
      }
      return '';
    });

    const merchandiseItemSize = computed(() => {
      if (merchandiseItem.value) {
        return merchandiseItem.value.size;
      }
      return '';
    });

    const phone = computed(() => {
      return registerChallengeStore.getTelephone;
    });

    const isPaymentComplete = computed(() => {
      return registerChallengeStore.getIsPaymentComplete;
    });

    const paymentSubject = computed(() => {
      return registerChallengeStore.getPaymentSubject;
    });

    const labelPaymentState = computed(() => {
      if (isPaymentComplete.value) {
        switch (paymentSubject.value) {
          case PaymentSubject.company:
          case PaymentSubject.school:
            return i18n.global.t('profile.labelPaymentStatePaidByCompany');
          case PaymentSubject.individual:
          case PaymentSubject.voucher:
            return i18n.global.t('profile.labelPaymentStatePaid');
          default:
            return i18n.global.t('profile.labelPaymentStateNotPaid');
        }
      } else {
        return i18n.global.t('profile.labelPaymentStateNotPaid');
      }
    });

    const iconPaymentColor = computed(() => {
      return isPaymentComplete.value ? 'positive' : 'negative';
    });

    const iconPaymentState = computed(() => {
      return isPaymentComplete.value
        ? 'mdi-check-circle-outline'
        : 'mdi-close-circle-outline';
    });

    const telephoneOptIn = computed({
      get: () => registerChallengeStore.getTelephoneOptIn,
      set: async (value) => {
        await onUpdateRegisterChallengeDetails({ telephoneOptIn: value });
      },
    });

    // update register challenge data
    const { isLoading, updateChallenge } = useApiPutRegisterChallenge(
      registerChallengeStore.$log,
    );
    const onUpdateRegisterChallengeDetails = async (
      data: ToApiPayloadStoreState,
    ): Promise<void> => {
      const payload = registerChallengeAdapter.toApiPayload(data);
      // post payload to API
      if (registrationId.value) {
        await updateChallenge(registrationId.value, payload);
        registerChallengeStore.loadRegisterChallengeToStore();
      } else {
        Notify.create({
          message: i18n.global.t('profile.messageProfileIdMissing'),
          color: 'negative',
        });
      }
    };

    const onUpdateEmail = async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<void> => {
      await onUpdateRegisterChallengeDetails({
        personalDetails: { email },
      });
      // re-authenticate
      await loginStore.login(
        {
          username: email,
          password: password,
        },
        {
          redirectAfterLogin: false,
          showErrorMessage: false,
          showSuccessMessage: false,
        },
      );
    };

    /**
     * Get gender label
     * @param {Gender | null} gender - Gender enum value or null
     * @returns {string} - Gender label or empty string
     */
    const genderLabel = (gender: Gender | null): string => {
      if (!gender) {
        return '';
      }
      return getGenderLabel(gender, i18n);
    };

    // TODO: Implement download invoice
    const onDownloadInvoice = () => {};

    return {
      telephoneOptIn,
      iconPaymentColor,
      iconPaymentState,
      iconSize,
      isLoading,
      labelPaymentState,
      merchandiseItemLabel,
      merchandiseItemSize,
      organization,
      organizationType,
      phone,
      profile,
      subsidiary,
      team,
      onDownloadInvoice,
      onUpdateRegisterChallengeDetails,
      onUpdateEmail,
      formPersonalDetails,
      genderLabel,
      isEnabledCoordinatorContact,
      isEnabledDeleteAccount,
      isEnabledDownloadInvoice,
      isEnabledPackageState,
      isEnabledTrackingNumber,
    };
  },
});
</script>

<template>
  <div data-cy="profile-details">
    <!-- Title -->
    <section-heading data-cy="profile-title-personal-details">
      {{ $t('profile.titlePersonalDetails') }}
    </section-heading>
    <!-- Personal info -->
    <div class="q-mt-lg">
      <!-- Nickname -->
      <details-item
        editable
        :label="$t('profile.labelNickname')"
        :value="profile.nickname"
        :dialog-title="$t('profile.titleUpdateNickname')"
        :description="$t('profile.descriptionNickname')"
        :empty-label="$t('profile.labelNicknameEmpty')"
        class="q-mb-lg"
        data-cy="profile-details-nickname"
      >
        <template #form="{ close }">
          <!-- Form: Update nickname -->
          <form-update-nickname
            :on-close="close"
            :value="profile.nickname"
            :loading="isLoading"
            @update:value="
              onUpdateRegisterChallengeDetails({
                personalDetails: { nickname: $event },
              })
            "
            data-cy="profile-details-form-nickname"
          />
        </template>
      </details-item>
      <!-- Email -->
      <details-item
        editable
        :label="$t('profile.labelEmail')"
        :value="profile.email"
        :dialog-title="$t('profile.titleUpdateEmail')"
        :empty-label="$t('profile.labelEmailEmpty')"
        class="q-mb-lg"
        data-cy="profile-details-email"
      >
        <template #form="{ close }">
          <!-- Form: Update email -->
          <form-update-email
            :on-close="close"
            :value="profile.email"
            :loading="isLoading"
            @update:value="onUpdateEmail"
            data-cy="profile-details-form-email"
          />
        </template>
      </details-item>
      <!-- Gender -->
      <details-item
        editable
        :label="$t('profile.labelGender')"
        :value="genderLabel(profile.gender)"
        :dialog-title="$t('profile.titleUpdateGender')"
        :empty-label="$t('profile.labelGenderEmpty')"
        class="q-mb-lg"
        data-cy="profile-details-gender"
      >
        <template #form="{ close }">
          <!-- Form: Update gender -->
          <form-update-gender
            :on-close="close"
            :value="profile.gender"
            :loading="isLoading"
            @update:value="
              onUpdateRegisterChallengeDetails({
                personalDetails: { gender: $event },
              })
            "
            data-cy="profile-details-form-gender"
          />
        </template>
      </details-item>
      <!-- Language -->
      <details-item
        :label="$t('profile.labelLanguage')"
        :value="formPersonalDetails.language"
        :empty-label="$t('profile.labelLanguageEmpty')"
        class="q-mb-lg"
        data-cy="profile-details-language"
      >
        <template #value>
          <!-- Language switcher -->
          <language-switcher
            variant="light"
            class="full-width justify-start"
            data-cy="profile-details-language-switcher"
          />
        </template>
      </details-item>
    </div>

    <!-- Title -->
    <section-heading class="q-mt-xl" data-cy="profile-title-challenge-details">
      {{ $t('profile.titleChallengeDetails') }}
    </section-heading>
    <!-- Challenge details -->
    <div class="q-mt-lg">
      <div class="row q-col-gutter-lg">
        <!-- Organization type -->
        <details-item
          :label="$t('profile.labelOrganizationType')"
          :value="organizationType"
          class="col-12 col-sm-6"
          data-cy="profile-details-organization-type"
        />
        <!-- Organization -->
        <details-item
          :label="$t('profile.labelOrganization')"
          :value="organization"
          class="col-12 col-sm-6"
          data-cy="profile-details-organization"
        />
        <!-- Address / Subsidiary -->
        <details-item
          :label="$t('profile.labelAddressSubsidiary')"
          :value="subsidiary"
          class="col-12 col-sm-6"
          data-cy="profile-details-address-subsidiary"
        />
        <!-- Team -->
        <details-item
          :label="$t('profile.labelTeam')"
          :value="team"
          class="col-12 col-sm-6"
          data-cy="profile-details-team"
        />
      </div>
    </div>

    <!-- Title -->
    <section-heading class="q-mt-xl" data-cy="profile-title-starter-package">
      {{ $t('profile.titleStarterPackage') }}
    </section-heading>
    <!-- Starter package -->
    <div class="q-mt-lg">
      <div class="row q-col-gutter-lg">
        <!-- Package -->
        <details-item
          :label="$t('profile.labelPackage')"
          :value="merchandiseItemLabel"
          class="col-12 col-sm-6"
          data-cy="profile-details-package"
        />
        <!-- Size -->
        <details-item
          :label="$t('profile.labelSize')"
          :value="merchandiseItemSize"
          class="col-12 col-sm-6"
          data-cy="profile-details-size"
        />
        <!-- State -->
        <details-item
          v-if="isEnabledPackageState"
          :label="$t('profile.labelState')"
          :value="formPersonalDetails.package.state"
          class="col-12 col-sm-6"
          data-cy="profile-details-state"
        />
        <!-- Tracking number -->
        <details-item
          v-if="isEnabledTrackingNumber"
          :label="$t('profile.labelTrackingNumber')"
          :value="formPersonalDetails.package.trackingNumber"
          class="col-12 col-sm-6"
          data-cy="profile-details-tracking-number"
        />
        <!-- Delivery address -->
        <details-item
          :label="$t('profile.labelDeliveryAddress')"
          :value="subsidiary"
          class="col-12 col-sm-6"
          data-cy="profile-details-delivery-address"
        />
        <!-- Phone number -->
        <details-item
          editable
          :label="$t('profile.labelPhone')"
          :dialog-title="$t('profile.titleUpdatePhone')"
          :value="phone"
          class="col-12 col-sm-6"
          data-cy="profile-details-phone"
        >
          <template #form="{ close }">
            <!-- Form: Update phone number -->
            <form-update-phone
              :on-close="close"
              :value="phone"
              :loading="isLoading"
              @update:value="
                onUpdateRegisterChallengeDetails({
                  telephone: $event,
                })
              "
              data-cy="profile-details-form-phone"
            />
          </template>
        </details-item>
      </div>
    </div>

    <!-- Title -->
    <section-heading
      class="q-mt-xl"
      data-cy="profile-title-registration-details"
    >
      {{ $t('profile.titleRegistrationDetails') }}
    </section-heading>
    <!-- Registration details -->
    <div class="q-mt-lg">
      <div class="row q-col-gutter-lg">
        <!-- Package -->
        <details-item
          :label="$t('profile.labelPaymentState')"
          class="col-12 col-md-6 items-center"
          data-cy="profile-details-payment-state"
        >
          <template #value>
            <div class="row q-col-gutter-md justify-between">
              <div class="col-12 col-sm-auto flex items-center gap-8">
                <q-icon
                  :name="iconPaymentState"
                  :size="iconSize"
                  :color="iconPaymentColor"
                  data-cy="profile-details-payment-state-icon"
                />
                <span>{{ labelPaymentState }}</span>
              </div>
            </div>
          </template>
        </details-item>
        <div v-if="isEnabledDownloadInvoice" class="col-12 col-md-6">
          <q-btn
            unelevated
            rounded
            outline
            color="primary"
            data-cy="profile-details-download-invoice"
          >
            <q-icon
              name="mdi-download"
              :size="iconSize"
              class="q-mr-sm"
              @click="onDownloadInvoice"
            />
            {{ $t('profile.buttonDownloadInvoice') }}
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Contact participation -->
    <div class="q-mt-xl">
      <q-toggle
        v-model="telephoneOptIn"
        :disable="isLoading"
        :label="$t('profile.labelTelephoneOptIn')"
        data-cy="profile-details-telephone-opt-in"
      />
    </div>

    <!-- Delete account -->
    <delete-account v-if="isEnabledDeleteAccount" data-cy="delete-account" />

    <!-- Coordinator contact -->
    <profile-coordinator-contact
      v-if="isEnabledCoordinatorContact"
      class="q-mt-xl"
      data-cy="profile-coordinator-contact"
    />
  </div>
</template>
