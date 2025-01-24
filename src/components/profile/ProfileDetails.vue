<script lang="ts">
/**
 * ProfileDetails Component
 *
 * @description * Use this component to display a ProfileDetails section
 * on the profile page.
 * Note: This component is used on `ProfilePage` in `ProfileTabs` component.
 *
 * @components
 * - `AddressDisplay`: Component to display an address.
 * - `DetailsItem`: Component to display a row of data.
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
import { computed, defineComponent, onMounted, ref } from 'vue';

// adapters
import { registerChallengeAdapter } from '../../adapters/registerChallengeAdapter';

// components
import AddressDisplay from '../global/AddressDisplay.vue';
import DetailsItem from '../profile/DetailsItem.vue';
import FormUpdateGender from '../form/FormUpdateGender.vue';
import FormUpdateNickname from '../form/FormUpdateNickname.vue';
import LanguageSwitcher from '../global/LanguageSwitcher.vue';
import ProfileCoordinatorContact from './ProfileCoordinatorContact.vue';
import SectionHeading from '../global/SectionHeading.vue';
import DeleteAccount from './DeleteAccount.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useApiPutRegisterChallenge } from '../../composables/useApiPutRegisterChallenge';

// enums
import { Gender, PaymentState } from '../types/Profile';

// fixtures
import formPersonalDetails from '../../../test/cypress/fixtures/formPersonalDetails.json';

// stores
import { useLoginStore } from '../../stores/login';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { ToApiPayloadStoreState } from '../../components/types/ApiRegistration';

// utils
import { getGenderLabel } from '../../utils/get_gender_label';

export default defineComponent({
  name: 'ProfileDetails',
  components: {
    AddressDisplay,
    DetailsItem,
    FormUpdateGender,
    FormUpdateNickname,
    LanguageSwitcher,
    ProfileCoordinatorContact,
    SectionHeading,
    DeleteAccount,
  },
  setup() {
    const iconSize = '18px';

    const registerChallengeStore = useRegisterChallengeStore();
    // refresh on mounted
    onMounted(() => {
      registerChallengeStore.loadRegisterChallengeToStore();
    });
    // profile details
    const profile = computed(() => {
      return registerChallengeStore.getPersonalDetails;
    });

    const loginStore = useLoginStore();
    const user = computed(() => loginStore.getUser);

    const allowContactPhone = ref(false);

    const labelPaymentState = computed(() => {
      switch (formPersonalDetails.paymentState) {
        case PaymentState.paidByOrganization:
          return i18n.global.t('profile.labelPaymentStatePaidByCompany');
        case PaymentState.paid:
          return i18n.global.t('profile.labelPaymentStatePaid');
        default:
          return i18n.global.t('profile.labelPaymentStateNotPaid');
      }
    });

    const iconPaymentColor = computed(() => {
      return [PaymentState.paid, PaymentState.paidByOrganization].includes(
        formPersonalDetails.paymentState as PaymentState,
      )
        ? 'green'
        : 'red';
    });

    const iconPaymentState = computed(() => {
      return [PaymentState.paid, PaymentState.paidByOrganization].includes(
        formPersonalDetails.paymentState as PaymentState,
      )
        ? 'mdi-check-circle-outline'
        : 'mdi-close-circle-outline';
    });

    const onDownloadInvoice = () => {
      // TODO: Implement download invoice
    };

    // update register challenge data
    const { isLoading, updateChallenge } = useApiPutRegisterChallenge(
      registerChallengeStore.$log,
    );
    const onUpdatePersonalDetails = async (
      data: ToApiPayloadStoreState,
    ): Promise<void> => {
      const payload = registerChallengeAdapter.toApiPayload(data);
      // post payload to API
      await updateChallenge(profile.value.id, payload);
      registerChallengeStore.loadRegisterChallengeToStore();
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

    return {
      allowContactPhone,
      iconPaymentColor,
      iconPaymentState,
      iconSize,
      isLoading,
      labelPaymentState,
      profile,
      onDownloadInvoice,
      onUpdatePersonalDetails,
      formPersonalDetails,
      user,
      genderLabel,
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
            @update:value="
              onUpdatePersonalDetails({ personalDetails: { nickname: $event } })
            "
            data-cy="profile-details-form-nickname"
          />
        </template>
      </details-item>
      <!-- Email -->
      <details-item
        :label="$t('profile.labelEmail')"
        :value="user.email"
        :dialog-title="$t('profile.titleUpdateEmail')"
        :empty-label="$t('profile.labelEmailEmpty')"
        class="q-mb-lg"
        data-cy="profile-details-email"
      />
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
            @update:value="
              onUpdatePersonalDetails({ personalDetails: { gender: $event } })
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
          :value="formPersonalDetails.organizationType"
          class="col-12 col-sm-6"
          data-cy="profile-details-organization-type"
        />
        <!-- Organization -->
        <details-item
          :label="$t('profile.labelOrganization')"
          :value="formPersonalDetails.organization"
          class="col-12 col-sm-6"
          data-cy="profile-details-organization"
        />
        <!-- Address / Subsidiary -->
        <details-item
          :label="$t('profile.labelAddressSubsidiary')"
          class="col-12 col-sm-6"
          data-cy="profile-details-address-subsidiary"
        >
          <template #value>
            <address-display
              :address="formPersonalDetails.subsidiary.address"
            />
          </template>
        </details-item>
        <!-- Team -->
        <details-item
          :label="$t('profile.labelTeam')"
          :value="formPersonalDetails.team"
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
          :value="formPersonalDetails.package.title"
          class="col-12 col-sm-6"
          data-cy="profile-details-package"
        >
          <template #value>
            <a
              :href="formPersonalDetails.package.url"
              data-cy="profile-details-package-link"
            >
              {{ formPersonalDetails.package.title }}
            </a>
          </template>
        </details-item>
        <!-- Size -->
        <details-item
          :label="$t('profile.labelSize')"
          :value="formPersonalDetails.package.size"
          class="col-12 col-sm-6"
          data-cy="profile-details-size"
        />
        <!-- State -->
        <details-item
          :label="$t('profile.labelState')"
          :value="formPersonalDetails.package.state"
          class="col-12 col-sm-6"
          data-cy="profile-details-state"
        />
        <!-- Tracking number -->
        <details-item
          :label="$t('profile.labelTrackingNumber')"
          :value="formPersonalDetails.package.trackingNumber"
          class="col-12 col-sm-6"
          data-cy="profile-details-tracking-number"
        />
        <!-- Delivery address -->
        <details-item
          :label="$t('profile.labelDeliveryAddress')"
          class="col-12 col-sm-6"
          data-cy="profile-details-delivery-address"
        >
          <template #value>
            <address-display :address="formPersonalDetails.deliveryAddress" />
          </template>
        </details-item>
        <!-- Phone number -->
        <details-item
          :label="$t('profile.labelPhone')"
          :value="formPersonalDetails.phone"
          class="col-12 col-sm-6"
          data-cy="profile-details-phone"
        />
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
          :value="formPersonalDetails.package.title"
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
        <div class="col-12 col-md-6">
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

    <!-- Delete account -->
    <delete-account data-cy="delete-account" />

    <!-- Contact participation -->
    <div class="q-mt-xl">
      <q-toggle
        :label="$t('profile.labelAllowContactPhone')"
        v-model="allowContactPhone"
        data-cy="profile-allow-contact-phone"
      />
    </div>

    <!-- Coordinator contact -->
    <profile-coordinator-contact
      class="q-mt-xl"
      data-cy="profile-coordinator-contact"
    />
  </div>
</template>
