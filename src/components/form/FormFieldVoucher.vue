<script lang="ts">
/**
 * FormFieldVoucher Component
 *
 * @description * Use this component to render a Voucher widget.
 * It handles voucher submission and validation and emits
 * the data about the voucher.
 *
 * Used in `RegisterChallengePayment` component.
 *
 * @events
 * - `update:voucher`: Emitted after voucher is successfully applied.
 *
 * @components
 * - `FormFieldTextRequired`: Component to render required text field.
 *
 * @example
 * <form-field-voucher :voucher="voucher" @update:voucher="onUpdateVoucher" />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6410-2305&t=gB7ERmDZorpD4TdE-1)
 */

// libraries
import { Notify } from 'quasar';
import { defineComponent, ref } from 'vue';

// components
import FormFieldTextRequired from '../global/FormFieldTextRequired.vue';

// composables
import { i18n } from '../../boot/i18n';

// enums
import { TestPaymentVoucher } from '../types/Form';

// types
import type { FormPaymentVoucher } from '../types/Form';

// fixtures
import voucherFull from '../../../test/cypress/fixtures/registerPaymentVoucherFull.json';
import voucherHalf from '../../../test/cypress/fixtures/registerPaymentVoucherHalf.json';

export default defineComponent({
  name: 'FormFieldVoucher',
  components: {
    FormFieldTextRequired,
  },
  props: {
    activeVoucher: {
      type: Object as () => FormPaymentVoucher | null,
      default: null,
    },
  },
  emits: ['remove:voucher', 'update:voucher'],
  setup(props, { emit }) {
    const code = ref('');
    const voucher = ref<FormPaymentVoucher | null>(
      props.activeVoucher ? props.activeVoucher : null,
    );

    /**
     * Submits voucher data to API
     * If voucher is valid it emits the data
     * @returns {void}
     */
    const onSubmitVoucher = (): void => {
      // TODO: Add API call and remove dummy data
      if (code.value === TestPaymentVoucher.full) {
        voucher.value = voucherFull;
      }
      if (code.value === TestPaymentVoucher.half) {
        voucher.value = voucherHalf;
      }
      if (voucher.value) {
        Notify.create({
          type: 'positive',
          message: i18n.global.t('notify.voucherApplySuccess'),
        });
        emit('update:voucher', voucher.value);
      } else {
        Notify.create({
          type: 'negative',
          message: i18n.global.t('notify.voucherApplyError'),
        });
        emit('remove:voucher');
      }
    };

    /**
     * Resets the code and voucher values and emits a 'remove:voucher' event.
     * @return {void}
     */
    const onRemoveVoucher = (): void => {
      code.value = '';
      voucher.value = null;
      emit('remove:voucher');
    };

    return {
      code,
      voucher,
      onRemoveVoucher,
      onSubmitVoucher,
    };
  },
});
</script>

<template>
  <div data-cy="form-field-voucher">
    <q-banner
      v-if="voucher"
      inline-actions
      rounded
      class="bg-grey-2 q-my-lg"
      data-cy="voucher-banner"
    >
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-sm text-grey-10" data-cy="voucher-banner-code">
          {{ $t('form.textVoucher') }}: {{ voucher.code }}
        </div>
        <div
          class="col-12 col-sm-auto text-weight-bold text-primary"
          data-cy="voucher-banner-name"
        >
          {{ voucher.name }}
        </div>
      </div>
      <template v-slot:action>
        <q-btn
          dense
          flat
          color="primary"
          icon="mdi-close"
          size="18px"
          data-cy="voucher-button-remove"
          @click.prevent="onRemoveVoucher"
        />
      </template>
    </q-banner>
    <div
      v-else
      class="row items-center q-col-gutter-md"
      data-cy="voucher-widget"
    >
      <div class="col">
        <!-- Input: Voucher -->
        <form-field-text-required
          v-model="code"
          name="voucher"
          label="form.labelVoucher"
          data-cy="form-field-voucher-input"
        />
      </div>
      <div class="col-auto">
        <!-- Button: Submit -->
        <q-btn
          rounded
          unelevated
          color="primary"
          :label="$t('form.buttonVoucherSubmit')"
          @click="onSubmitVoucher"
          class="q-mt-sm"
          data-cy="form-field-voucher-submit"
        />
      </div>
    </div>
  </div>
</template>
