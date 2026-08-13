<script lang="ts">
/**
 * FormFieldOptionGroup Component
 *
 * The `FormFieldOptionGroup` displays option group input.
 *
 * @description * Use this component to render option groups with icon title
 * and description in the form of cards.
 *
 * Note: This component is commonly used in `FormRegisterChallenge`.
 *
 * @props
 * - `modelValue` (string, required): The object representing user input.
 * - `name` (string, required): The name used for id and test selectors.
 * - `label` (string, required): The translation key for the label.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @example
 * <form-field-option-group v-model="value" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=5350%3A24169&mode=dev)
 */

// libraries
import { colors } from 'quasar';
import { defineComponent, computed, inject } from 'vue';

// composables
import { useValidation } from 'src/composables/useValidation';
import { i18n } from 'src/boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

import { onTrack } from '../../utils/track';

// enums
import { OrganizationType } from 'src/components/types/Organization';
import { PaymentSubject } from 'src/components/enums/Payment';

// types
import type { FormOption } from '../../components/types/Form';
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'FormFieldOptionGroup',
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;

    const organizationType = computed({
      get: (): OrganizationType => registerChallengeStore.getOrganizationType,
      set: (value: OrganizationType) => {
        // set value
        registerChallengeStore.setOrganizationType(value);
      },
    });

    const onOrganizationTypeChange = () => {
      onTrack({
        detail: {
          targetName: 'organizationName',
          timestamp: Date.now(),
          value: organizationType.value,
        },
      });
      // reset organizationId on organizationType change
      registerChallengeStore.setOrganizationId(null);
      logger?.debug(
        'Organization type change, reset' +
          ` organization ID <${registerChallengeStore.getOrganizationId}>.`,
      );
      // reset subsidiaryId on organizationType change
      registerChallengeStore.setSubsidiaryId(null);
      logger?.debug(
        'Organization type change, reset' +
          ` subsidiary ID <${registerChallengeStore.getSubsidiaryId}>.`,
      );
      // reset teamId on organizationType change
      registerChallengeStore.setTeamId(null);
      logger?.debug(
        'Organization type change, reset' +
          ` team ID <${registerChallengeStore.getTeamId}>.`,
      );
    };

    const { isFilled } = useValidation();

    // get payment subject from registerChallenge store
    const registerChallengeStore = useRegisterChallengeStore();
    const paymentSubject = computed(
      () => registerChallengeStore.getPaymentSubject,
    );

    const options = computed<FormOption[]>(() => [
      {
        label: i18n.global.t('form.participation.labelColleagues'),
        description: i18n.global.t('form.participation.textColleagues'),
        value: OrganizationType.company,
        icon: 'svguse:icons/form_field_option_group/icons.svg#colleagues',
        disable: paymentSubject.value === PaymentSubject.school,
      },
      {
        label: i18n.global.t('form.participation.labelSchoolmates'),
        description: i18n.global.t('form.participation.textSchoolmates'),
        value: OrganizationType.school,
        icon: 'svguse:icons/form_field_option_group/icons.svg#schoolmates',
        disable: paymentSubject.value === PaymentSubject.company,
      },
      {
        label: i18n.global.t('form.participation.labelFamily'),
        value: OrganizationType.family,
        icon: 'svguse:icons/form_field_option_group/icons.svg#family',
        disable: [PaymentSubject.company, PaymentSubject.school].includes(
          paymentSubject.value,
        ),
      },
    ]);

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    const { getPaletteColor, changeAlpha } = colors;
    const grey3 = getPaletteColor('grey-3');
    const primary = getPaletteColor('primary');
    const primaryOpacity = changeAlpha(
      primary,
      rideToWorkByBikeConfig.colorPrimaryOpacity,
    );

    return {
      borderRadius,
      grey3,
      organizationType,
      options,
      primary,
      primaryOpacity,
      isFilled,
      onOrganizationTypeChange,
    };
  },
});
</script>

<template>
  <q-field
    dense
    borderless
    hide-bottom-space
    :model-value="organizationType"
    :rules="[(val) => !!val || $t('form.messageOptionRequired')]"
  >
    <q-option-group
      v-model="organizationType"
      type="radio"
      :options="options"
      class="q-gutter-md"
      data-cy="form-field-option-group"
      @update:model-value="onOrganizationTypeChange"
    >
      <!-- Custom option content -->
      <template v-slot:label="opt">
        <div
          class="full-width row items-center bg-white q-py-md q-px-md"
          :class="[opt.value === organizationType ? '' : 'bg-white']"
          :style="{
            'border-radius': borderRadius,
            'border-width': '1px',
            'border-style': 'solid',
            'border-color': opt.value === organizationType ? primary : grey3,
          }"
          data-cy="form-field-option"
        >
          <!-- First column: Icon -->
          <div v-if="opt.label" class="col-auto q-mr-md">
            <q-avatar
              round
              :style="{ backgroundColor: primaryOpacity }"
              data-cy="form-field-option-avatar"
            >
              <q-icon
                :name="opt.icon"
                color="primary"
                size="24px"
                data-cy="form-field-option-icon"
              />
            </q-avatar>
          </div>
          <!-- Second column: Label -->
          <div class="col" data-cy="form-field-option-title">
            <div v-if="opt.label" class="text-body1 text-black">
              {{ opt.label }}
            </div>
            <div v-if="opt.description" class="text-caption text-black">
              {{ opt.description }}
            </div>
          </div>
          <!-- Third column: Check -->
          <div class="col-auto q-ml-md">
            <q-avatar round size="24px" data-cy="form-field-option-check">
              <q-icon
                v-show="opt.value === organizationType"
                name="done"
                color="primary"
                size="24px"
              />
            </q-avatar>
          </div>
        </div>
      </template>
    </q-option-group>
  </q-field>
</template>
<style scoped lang="scss">
// hide radio button
:deep(.q-radio__inner) {
  display: none;
}
:deep(.q-radio) {
  width: 100%;
}
:deep(.q-radio__label) {
  width: 100%;
}
</style>
