// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { PaymentSubject } from '../components/enums/Payment';
import { PaymentCategory } from '../components/types/ApiPayu';

// stores
import { useChallengeStore } from 'src/stores/challenge';

// types
import type {
  PayuCreateOrderPayload,
  PayuProduct,
} from '../components/types/ApiPayu';
import type { ValidatedCoupon } from 'src/components/types/Coupon';

// utils
import { defaultPaymentAmountMinComputed } from '../utils/price_levels';

/**
 * Adapter for PayU-related data transformations
 */
export const payuAdapter = {
  /**
   * Create PayU order payload based on payment details
   * @param {PaymentSubject} paymentSubject - Selected payment subject
   * @param {number} paymentAmount - Total amount to pay
   * @param {string} clientIp - Client IP address
   * @returns {PayuCreateOrderPayload | null} PayU order payload or null if
   *   entered data are invalid.
   */
  toPayuOrderPayload(
    paymentSubject: PaymentSubject,
    paymentAmount: number,
    voucher: ValidatedCoupon | null,
    clientIp: string,
  ): PayuCreateOrderPayload | null {
    // get default payment amount from store
    const challengeStore = useChallengeStore();
    const priceLevels = challengeStore.getCurrentPriceLevels;
    const defaultPaymentAmountBasic =
      defaultPaymentAmountMinComputed(priceLevels);
    let defaultPaymentAmountCoupon = defaultPaymentAmountBasic;
    if (voucher?.valid && voucher.discount) {
      defaultPaymentAmountCoupon = Math.round(
        defaultPaymentAmountBasic -
          (defaultPaymentAmountBasic * voucher.discount) / 100,
      );
    }

    const products: PayuProduct[] = [];
    let paymentCategory: PaymentCategory;
    let amountEntryFee = 0;
    let amountDonation = 0;

    // determine the entry fee amount and donation amount
    switch (paymentSubject) {
      case PaymentSubject.individual: {
        if (paymentAmount < defaultPaymentAmountBasic) {
          // invalid - individual payment must be at least min amount
          return null;
        } else if (paymentAmount === defaultPaymentAmountBasic) {
          amountEntryFee = paymentAmount;
        } else if (paymentAmount > defaultPaymentAmountBasic) {
          amountEntryFee = defaultPaymentAmountBasic;
          amountDonation = paymentAmount - defaultPaymentAmountBasic;
        } else {
          // invalid - no comparable value
          return null;
        }
        break;
      }
      case PaymentSubject.voucher: {
        // voucher allows discounted payment
        if (paymentAmount < defaultPaymentAmountCoupon) {
          // invalid - coupon payment must be at least the value of coupon
          return null;
        } else if (paymentAmount === defaultPaymentAmountCoupon) {
          amountEntryFee = paymentAmount;
        } else if (paymentAmount > defaultPaymentAmountCoupon) {
          amountEntryFee = defaultPaymentAmountCoupon;
          amountDonation = paymentAmount - defaultPaymentAmountCoupon;
        } else {
          // invalid - no comparable value
          return null;
        }
        break;
      }
      case PaymentSubject.company:
      case PaymentSubject.school: {
        if (paymentAmount > 0) {
          amountDonation = paymentAmount;
        } else {
          // invalid - value 0 should not be handled by PayU
          return null;
        }
        break;
      }
      default: {
        // invalid - no payment subject
        return null;
      }
    }

    const hasDonation = amountDonation > 0;
    const hasEntryFee = amountEntryFee > 0;

    // entry fee product
    if (hasEntryFee) {
      products.push({
        name: rideToWorkByBikeConfig.rtwbbChallengeEntryFeeOrderedProductName,
        unitPrice: amountEntryFee,
        quantity: 1,
      });
    }

    // donation product
    if (hasDonation) {
      products.push({
        name: rideToWorkByBikeConfig.rtwbbDonationOrderedProductName,
        unitPrice: amountDonation,
        quantity: 1,
      });
    }

    // set payment category
    if (hasEntryFee && hasDonation) {
      paymentCategory = PaymentCategory.entryFeeDonation;
    } else if (hasDonation) {
      paymentCategory = PaymentCategory.donation;
    } else if (hasEntryFee) {
      paymentCategory = PaymentCategory.entryFee;
    } else {
      return null;
    }

    return {
      amount: paymentAmount,
      client_ip: clientIp,
      payment_subject: paymentSubject,
      payment_category: paymentCategory,
      products,
    };
  },
};
