// libraries
import { ref } from 'vue';

// adapters
import { couponAdapter } from '../adapters/couponAdapter';

// composables
import { useApi } from './useApi';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  DiscountCouponResponse,
  ValidatedCoupon,
  useApiGetDiscountCouponReturn,
} from '../components/types/Coupon';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get discount coupon composable
 * Used for validating discount coupons
 * @param {Logger | null} logger
 * @returns {useApiGetDiscountCouponReturn}
 */
export const useApiGetDiscountCoupon = (
  logger: Logger | null,
): useApiGetDiscountCouponReturn => {
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Validate discount coupon
   * @param {string} code - Coupon code to validate
   * @returns {Promise<ValidatedCoupon>} - Promise resolving to validation result
   */
  const validateCoupon = async (code: string): Promise<ValidatedCoupon> => {
    logger?.info(`Get discount coupon <${code}> from the API.`);
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    const { data } = await apiFetch<DiscountCouponResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiDiscountCoupon}${code}`,
      method: 'get',
      translationKey: 'getDiscountCoupon',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    const response = couponAdapter.toValidatedCoupon(data);

    logger?.debug(
      `Discount coupon parsed validation response data <${JSON.stringify(response, null, 2)}>.`,
    );

    isLoading.value = false;
    return response;
  };

  return {
    isLoading,
    validateCoupon,
  };
};
