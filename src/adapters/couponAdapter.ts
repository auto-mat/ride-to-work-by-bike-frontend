// types
import type { DiscountCouponResponse } from 'src/components/types/Coupon';
import type { ValidatedCoupon } from 'src/components/types/Coupon';

export const couponAdapter = {
  /**
   * Convert a DiscountCouponResponse to a ValidatedCoupon
   * @param { DiscountCouponResponse | null } response - coupon response
   * @returns { ValidatedCoupon } validated coupon object used internally
   */
  toValidatedCoupon(response: DiscountCouponResponse | null): ValidatedCoupon {
    const coupon = response?.results?.[0];
    return {
      valid: !!coupon?.available,
      discount: coupon?.discount || 0,
      name: coupon?.name || '',
    };
  },
};
