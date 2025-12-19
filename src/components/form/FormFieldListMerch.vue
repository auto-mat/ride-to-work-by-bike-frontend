<script lang="ts">
/**
 * FormFieldListMerch Component
 *
 * The `FormFieldListMerch`
 *
 * @description * Use this component to render a list of t-shirts.
 *
 * Note: This component is commonly used in `FormRegisterChallenge`.
 *
 * @props
 * - `formValue` (FormMerchFields, required): The object representing form state.
 *   It should be of type `FormMerchFields`.
 *
 * @events
 * - `update:formValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Component to display dialog.
 * - `FormCardMerch`: Component to render a merch card (option).
 * - `FormFieldPhone`: Component to render phone input.
 * - `FormFieldRadioRequired`: Component to render radio buttons.
 * - `SliderMerch`: Component to render images in a slider.
 *
 * @example
 * <form-field-list-merch />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=7003%3A32273&mode=dev)
 */

// libraries
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue';
import { QCard, QForm } from 'quasar';

// components
import DialogDefault from '../global/DialogDefault.vue';
import FormCardMerch from '../form/FormCardMerch.vue';
import FormFieldPhone from '../global/FormFieldPhone.vue';
import FormFieldRadioRequired from '../form/FormFieldRadioRequired.vue';
import SliderMerch from './SliderMerch.vue';

// composables
import { i18n } from '../../boot/i18n';
import { defaultLocale } from '../../i18n/def_locale';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import { useChallengeStore } from 'src/stores/challenge';

// enums
import { Gender } from '../types/Profile';

// types
import type { FormOption } from '../types/Form';
import type { MerchandiseCard, MerchandiseItem } from '../types/Merchandise';
import type { Logger } from '../types/Logger';

import { getApiBaseUrlWithLang } from '../../utils/get_api_base_url_with_lang';

export default defineComponent({
  name: 'FormFieldListMerch',
  components: {
    DialogDefault,
    FormCardMerch,
    FormFieldPhone,
    FormFieldRadioRequired,
    SliderMerch,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    // show merch checkbox
    const isNotMerch = ref<boolean>(false);

    // template ref
    const formMerchRef = ref<typeof QForm | null>(null);

    // selected options
    const selectedGender = ref<string>(Gender.female);
    const selectedSize = computed<number | null>({
      get: () => registerChallengeStore.getMerchId,
      set: (value: number | null) => registerChallengeStore.setMerchId(value),
    });
    const phone = computed<string>({
      get: () => registerChallengeStore.getTelephone,
      set: (value: string) => registerChallengeStore.setTelephone(value),
    });
    const telephoneOptIn = computed<boolean>({
      get: () => registerChallengeStore.getTelephoneOptIn,
      set: (value: boolean) => registerChallengeStore.setTelephoneOptIn(value),
    });
    // dialog
    const isOpen = ref<boolean>(false);

    // merch tabs
    const tabsMerchRef = ref<typeof QCard | null>(null);

    // get merchandise data
    const registerChallengeStore = useRegisterChallengeStore();
    const challengeStore = useChallengeStore();

    // load merchandise on mount
    onMounted(async () => {
      await registerChallengeStore.loadMerchandiseToStore(logger);

      // Automatic selection "no merch" when merchandise options are empty
      if (optionsEmpty.value) {
        logger?.info(
          'Merchandise options empty, automatic selection "no merch" option.',
        );
        isNotMerch.value = true;
        await loadNoMerchId();
        return;
      }

      // if merch ID is set, select the corresponding item
      if (registerChallengeStore.getMerchId) {
        logger?.debug(
          `Merch ID <${registerChallengeStore.getMerchId}> is set.`,
        );
        // find card that contains the merch ID
        const item = merchandiseItems.value.find(
          (item: MerchandiseItem) =>
            item.id === registerChallengeStore.getMerchId,
        );
        // select gender and size
        if (item) {
          isNotMerch.value = false;
          logger?.debug(`Found item <${JSON.stringify(item, null, 2)}>.`);
          selectedGender.value = item.gender;
          selectedSize.value = item.id;
        } else {
          isNotMerch.value = true;
          logger?.debug(
            `No item found for merch ID <${registerChallengeStore.getMerchId}>,` +
              ` setting isNotMerch to <${isNotMerch.value}>.`,
          );
        }
      }
      // set isNotMerch to true if payment with reward is disabled
      if (!registerChallengeStore.getIsPaymentWithReward) {
        isNotMerch.value = true;
        onCheckboxUpdate(true);
      }
    });

    // ensure tracking of isPaymentWithReward changes
    watch(
      () => registerChallengeStore.getIsPaymentWithReward,
      (newVal: boolean) => {
        if (!newVal) {
          isNotMerch.value = true;
          onCheckboxUpdate(true);
        }
      },
    );

    const isPaymentWithReward = computed<boolean>(
      (): boolean => registerChallengeStore.isPaymentWithReward,
    );

    const merchandiseItems = computed(
      () => registerChallengeStore.getMerchandiseItems,
    );
    const merchandiseCards = computed(
      () => registerChallengeStore.getMerchandiseCards,
    );
    const isLoading = computed(
      () => registerChallengeStore.isLoadingMerchandise,
    );

    const selectedOption = computed<MerchandiseItem | null>(
      (): MerchandiseItem | null => {
        if (!merchandiseItems.value) return null;
        return (
          merchandiseItems.value.find(
            (item) => item.id === selectedSize.value,
          ) || null
        );
      },
    );

    // computed properties for gender-specific options
    const optionsFemale = computed((): MerchandiseCard[] => {
      const options = Object.values(
        merchandiseCards.value[Gender.female] || {},
      );
      return options.filter((option) => option.available);
    });

    const optionsMale = computed((): MerchandiseCard[] => {
      const options = Object.values(merchandiseCards.value[Gender.male] || {});
      return options.filter((option) => option.available);
    });

    const optionsUnisex = computed((): MerchandiseCard[] => {
      const options = Object.values(
        merchandiseCards.value[Gender.unisex] || {},
      );
      return options.filter((option) => option.available);
    });

    const optionsEmpty = computed((): boolean => {
      return (
        optionsFemale.value.length === 0 &&
        optionsMale.value.length === 0 &&
        optionsUnisex.value.length === 0
      );
    });

    const showMerchUnavailableBanner = computed((): boolean => {
      const isPriceLevelEmpty = challengeStore.getPriceLevel.length === 0;
      logger?.debug(
        'Show merch unavailable banner check' +
          ` optionsEmpty <${optionsEmpty.value}>,` +
          ` isPriceLevelEmpty <${isPriceLevelEmpty}>.`,
      );
      return optionsEmpty.value && !isPriceLevelEmpty;
    });

    // get current item's options
    const currentGenderOptions = computed((): FormOption[] => {
      return selectedOption.value?.genderOptions || [];
    });

    const currentSizeOptions = computed((): FormOption[] => {
      return selectedOption.value?.sizeOptions || [];
    });

    const currentItemLabelSize = computed((): string => {
      switch (selectedOption.value?.gender) {
        case Gender.female:
          return i18n.global.t('form.merch.labelSizeFemale');
        case Gender.male:
          return i18n.global.t('form.merch.labelSizeMale');
        case Gender.unisex:
          return i18n.global.t('form.merch.labelSizeUnisex');
        default:
          return '';
      }
    });

    /**
     * Checks if given option is selected.
     * Used to display "selected" version of the card button.
     * @param option MerchandiseCard
     */
    const isSelected = (option: MerchandiseCard): boolean => {
      return (
        !!selectedOption.value &&
        !!option.itemIds?.includes(selectedOption.value?.id)
      );
    };

    /**
     * When gender changes, find appropriate card option.
     * Then run onSelectCardOption logic without opening the dialog.
     */
    const onGenderChange = (newGender: string) => {
      logger?.debug(`Gender was changed to <${newGender}>.`);
      // find card option in merchandiseCards
      const cardOption = merchandiseCards.value[newGender as Gender].find(
        (card) => card.label === selectedOption.value?.label,
      );
      if (cardOption) {
        logger?.debug(
          `Card option for gender <${newGender}> has been` +
            ` found <${JSON.stringify(cardOption, null, 2)}>.`,
        );
        onSelectCardOption(cardOption, false);
      } else {
        logger?.debug(`No card option found for gender <${newGender}>.`);
        return;
      }
    };

    // watch for gender changes
    watch(selectedGender, onGenderChange);

    /**
     * Handles the card "select" button click.
     * Opens the dialog with more details.
     * @param option MerchandiseCard
     */
    const onSelectCardOption = (
      option: MerchandiseCard,
      openDialog: boolean = true,
    ): void => {
      // find items from the given card option
      const cardItems = merchandiseItems.value.filter((item) =>
        option.itemIds?.includes(item.id),
      );
      logger?.debug(`Card items <${JSON.stringify(cardItems, null, 2)}>.`);
      // find item that matches current selected size (compares string labels)
      const item = cardItems.find(
        (item) => item.size === selectedOption.value?.size,
      );
      // if same-size item exists, select it
      if (item) {
        logger?.debug(
          'Found item matching current size ' +
            `<${JSON.stringify(item, null, 2)}>.`,
        );
        selectedSize.value = item.id;
        selectedGender.value = item.gender;
        // if parameter is not overridden, open the dialog
        if (openDialog) {
          isOpen.value = true;
        }
      }
      // if same-size item does not exist, select the first available item
      else if (cardItems.length) {
        logger?.debug(
          'No item matching current size, selecting the first available ' +
            `item <${JSON.stringify(cardItems[0], null, 2)}>.`,
        );
        selectedGender.value = cardItems[0].gender;
        selectedSize.value = cardItems[0].id;
        // if parameter is not overridden, open the dialog
        if (openDialog) {
          isOpen.value = true;
        }
      }
      // if there are no items, do nothing
      else {
        logger?.debug('No items match the selected option.');
      }
    };

    /**
     * Submits form within the dialog.
     * Validates the entered details and closes the dialog.
     */
    const onSubmit = async (): Promise<void> => {
      // validate form
      if (!formMerchRef.value) return;
      const isFormMerchValid: boolean = await formMerchRef.value.validate();
      if (isFormMerchValid) {
        // close dialog
        isOpen.value = false;
      } else {
        formMerchRef.value.$el.scrollIntoView({ behavior: 'smooth' });
      }
      registerChallengeStore.setIsMerchandiseSavedIntoDb(false);
    };

    let iDontWantMerchandiseCachedId: number | null = null;
    /**
     * Load "no merch" merch ID and set it into the store.
     */
    const loadNoMerchId = async function (): Promise<void> {
      if (!iDontWantMerchandiseCachedId) {
        logger?.info("Get 'I don't want any merchandise' ID from the API.");
        await registerChallengeStore.loadFilteredMerchandiseToStore(
          logger,
          rideToWorkByBikeConfig.iDontWantMerchandiseItemCode,
        );
        iDontWantMerchandiseCachedId = registerChallengeStore.getMerchId;
        logger?.debug(
          `Save 'I don't want any merchandise' ID <${iDontWantMerchandiseCachedId}> into cache.`,
        );
      } else {
        logger?.debug(
          `Use 'I don't want any merchandise' ID <${iDontWantMerchandiseCachedId}> from the cache.`,
        );
        registerChallengeStore.setMerchId(iDontWantMerchandiseCachedId);
      }
    };

    /**
     * Scroll to merch tabs if you uncheck
     * "I don't want merch" checkbox widget
     */
    const onCheckboxUpdate = function (val: boolean): void {
      if (optionsEmpty.value) {
        logger?.info('Update checkbox state aborted, checkbox is disabled.');
        return;
      }
      if (val) {
        loadNoMerchId();
      } else {
        nextTick(() => {
          // if no merch is selected, reset selected size
          selectedSize.value = null;
          // scroll to merch tabs
          tabsMerchRef.value?.$el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      }
      registerChallengeStore.setIsMerchandiseSavedIntoDb(false);
    };

    const hintInputPhone = computed((): string => {
      if (isNotMerch.value) {
        return i18n.global.t('form.merch.hintPhoneNoMerch');
      }
      return i18n.global.t('form.merch.hintPhoneWithMerch');
    });

    const labelPhoneOptIn = computed((): string => {
      if (isNotMerch.value) {
        return i18n.global.t('form.merch.labelPhoneOptInNoMerch');
      }
      return i18n.global.t('form.merch.labelPhoneOptInWithMerch');
    });

    const urlSizeConversionChart = computed(() => {
      return getApiBaseUrlWithLang(
        logger,
        rideToWorkByBikeConfig.urlSizeConversionChart,
        defaultLocale,
        i18n,
      );
    });
    return {
      currentItemLabelSize,
      formMerchRef,
      Gender,
      hintInputPhone,
      isNotMerch,
      isOpen,
      labelPhoneOptIn,
      telephoneOptIn,
      optionsFemale,
      optionsMale,
      optionsUnisex,
      optionsEmpty,
      showMerchUnavailableBanner,
      phone,
      selectedOption,
      selectedSize,
      selectedGender,
      currentGenderOptions,
      currentSizeOptions,
      onSelectCardOption,
      onSubmit,
      isSelected,
      tabsMerchRef,
      onCheckboxUpdate,
      isLoading,
      isPaymentWithReward,
      merchandiseCards,
      urlSizeConversionChart,
    };
  },
});
</script>

<template>
  <!-- Message: Merch unavailable -->
  <q-banner
    v-if="showMerchUnavailableBanner"
    class="bg-warning text-grey-10 rounded-borders q-mb-md"
    data-cy="text-merch-unavailable"
  >
    {{ $t('form.merch.textMerchUnavailable') }}
  </q-banner>
  <!-- Checkbox: No merch -->
  <q-item tag="label" v-ripple data-cy="no-merch">
    <q-item-section avatar top>
      <q-checkbox
        dense
        v-model="isNotMerch"
        :val="true"
        color="primary"
        :disable="!isPaymentWithReward || optionsEmpty"
        @update:model-value="onCheckboxUpdate"
        data-cy="form-merch-no-merch-checkbox"
      />
    </q-item-section>
    <q-item-section>
      <!-- Checkbox title -->
      <q-item-label class="text-grey-10" data-cy="no-merch-label">{{
        $t('form.merch.labelNoMerch')
      }}</q-item-label>
      <!-- Checkbox hint -->
      <q-item-label class="text-grey-8" caption data-cy="no-merch-hint">
        {{ $t('form.merch.hintNoMerch') }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <!-- Tabs: Merch -->
  <q-card ref="tabsMerchRef" flat class="q-mt-lg" style="max-width: 1024px">
    <div v-show="!isNotMerch && !optionsEmpty" data-cy="list-merch">
      <!-- Tab buttons -->
      <q-tabs
        v-model="selectedGender"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        data-cy="list-merch-tabs"
      >
        <!-- Button: Female -->
        <q-tab
          :name="Gender.female"
          :label="$t('global.female')"
          data-cy="list-merch-tab-female"
        />
        <!-- Button: Male -->
        <q-tab
          :name="Gender.male"
          :label="$t('global.male')"
          data-cy="list-merch-tab-male"
        />
        <!-- Button: Unisex -->
        <q-tab
          :name="Gender.unisex"
          :label="$t('global.unisex')"
          data-cy="list-merch-tab-unisex"
        />
      </q-tabs>
      <q-separator />
      <!-- Tab panels -->
      <q-tab-panels v-model="selectedGender" animated>
        <!-- Tab panel: Female -->
        <q-tab-panel :name="Gender.female" class="q-pa-none">
          <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
            <!-- Card: Merch (includes dialog) -->
            <FormCardMerch
              v-for="option in optionsFemale"
              :option="option"
              :key="`${option.label}-${Gender.female}`"
              :selected="isSelected(option)"
              class="col-12 col-md-6 col-lg-4"
              data-cy="form-card-merch-female"
              @select-option="onSelectCardOption(option)"
            />
          </div>
        </q-tab-panel>
        <!-- Tab panel: Male -->
        <q-tab-panel :name="Gender.male">
          <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
            <!-- Card: Merch (includes dialog) -->
            <FormCardMerch
              v-for="option in optionsMale"
              :option="option"
              :key="`${option.label}-${Gender.male}`"
              :selected="isSelected(option)"
              class="col-12 col-md-6 col-lg-4"
              data-cy="form-card-merch-male"
              @select-option="onSelectCardOption(option)"
            />
          </div>
        </q-tab-panel>
        <!-- Tab panel: Unisex -->
        <q-tab-panel :name="Gender.unisex">
          <div class="row q-gutter-x-none" data-cy="list-merch-option-group">
            <!-- Card: Merch (includes dialog) -->
            <FormCardMerch
              v-for="option in optionsUnisex"
              :option="option"
              :key="`${option.label}-${Gender.unisex}`"
              :selected="isSelected(option)"
              class="col-12 col-md-6 col-lg-4"
              data-cy="form-card-merch-unisex"
              @select-option="onSelectCardOption(option)"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Input: Merch size (card) - duplicated in dialog -->
    <div
      v-if="!isNotMerch && !optionsEmpty && currentSizeOptions.length > 1"
      class="q-pt-sm"
    >
      <span
        class="text-caption text-weight-medium text-grey-10"
        v-if="currentItemLabelSize"
        >{{ currentItemLabelSize }}</span
      >
      <form-field-radio-required
        inline
        v-model="selectedSize"
        :options="currentSizeOptions"
        class="q-mt-sm"
        data-cy="form-field-merch-size"
      />
    </div>

    <div v-if="!optionsEmpty" class="q-mb-md">
      <a
        class="text-primary"
        :href="urlSizeConversionChart"
        target="_blank"
        data-cy="form-merch-size-conversion-chart-link"
        >{{ $t('form.merch.labelUrlSizeConversionChartLink') }}</a
      >
    </div>

    <!-- Input: Phone number -->
    <form-field-phone
      v-model="phone"
      :hint="hintInputPhone"
      :required="true"
      data-cy="form-merch-phone-input"
    />
    <!-- Input: News checkbox -->
    <q-item tag="label" v-ripple class="q-mt-md" data-cy="phone-opt-in">
      <q-item-section avatar top>
        <q-checkbox
          dense
          v-model="telephoneOptIn"
          :false-value="false"
          :true-value="true"
          color="primary"
          data-cy="form-merch-phone-opt-in-input"
        />
      </q-item-section>
      <q-item-section>
        <!-- Checkbox title -->
        <q-item-label class="text-grey-10" data-cy="phone-opt-in-label">
          {{ labelPhoneOptIn }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- Dialog -->
    <dialog-default v-model="isOpen" data-cy="dialog-merch">
      <template #title>
        <!-- Merch Title -->
        <span v-if="selectedOption">{{ selectedOption.label }}</span>
      </template>
      <template #content>
        <div v-if="selectedOption">
          <!-- Merch Image Slider -->
          <slider-merch :items="selectedOption.images" />
          <!-- Merch Description -->
          <div v-html="selectedOption.description"></div>
          <q-form ref="formMerchRef">
            <!-- Input: Merch gender -->
            <div v-if="currentGenderOptions.length" class="q-pt-sm">
              <span class="text-caption text-weight-medium text-grey-10">{{
                $t('form.merch.labelVariant')
              }}</span>
              <form-field-radio-required
                inline
                v-model="selectedGender"
                :options="currentGenderOptions"
                class="q-mt-sm"
                data-cy="form-field-merch-gender"
              />
            </div>
            <!-- Input: Merch size (dialog) - duplicated in card -->
            <div class="q-pt-sm" v-if="currentSizeOptions.length > 1">
              <span
                class="text-caption text-weight-medium text-grey-10"
                v-if="currentItemLabelSize"
                >{{ currentItemLabelSize }}</span
              >
              <form-field-radio-required
                inline
                v-model="selectedSize"
                :options="currentSizeOptions"
                class="q-mt-sm"
                data-cy="form-field-merch-size"
              />
            </div>
            <!-- TODO: Add size legend -->
            <div class="q-mt-lg flex justify-end">
              <q-btn
                rounded
                unelevated
                color="primary"
                :label="$t('navigation.select')"
                text-color="white"
                @click="onSubmit"
                data-cy="button-submit-merch"
              />
            </div>
          </q-form>
        </div>
      </template>
    </dialog-default>
  </q-card>
</template>
