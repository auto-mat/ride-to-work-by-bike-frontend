/**
 * Types for coupon-related operations
 */

import { Ref } from 'vue';

export interface DiscountCouponResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DiscountCoupon[];
}

export interface DiscountCoupon {
  name: string;
  discount: number;
  available: boolean;
}

export interface ValidatedCoupon {
  valid: boolean;
  discount: number;
  name: string;
}

export interface useApiGetDiscountCouponReturn {
  isLoading: Ref<boolean>;
  validateCoupon: (code: string) => Promise<ValidatedCoupon>;
}
