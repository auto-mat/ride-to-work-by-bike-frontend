// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// types
import type { Logger } from '../components/types/Logger';

/**
 * Check if a voucher code indicates a "without reward" voucher
 * based on configured regex pattern.
 *
 * @param {string} voucherCode - The voucher code to validate
 * @param {Logger | null} logger - Optional logger instance
 * @returns {boolean} - True if voucher is without reward, false otherwise
 */
export const isVoucherWithoutReward = (
  voucherCode: string,
  logger?: Logger | null,
): boolean => {
  if (!voucherCode) return false;
  const regexPattern = rideToWorkByBikeConfig.voucherWithoutRewardPattern;
  if (!regexPattern) {
    logger?.error('No voucher pattern configured.');
    return false;
  }
  try {
    // create regex (case insensitive)
    const regex = new RegExp(regexPattern, 'i');
    return regex.test(voucherCode);
  } catch (error) {
    // If regex is invalid, log error and return false
    logger?.error(
      `Invalid voucher pattern regex <${regexPattern}>, <${error}>.`,
    );
    return false;
  }
};

/**
 * Inverse helper for isVoucherWithoutReward
 * @param {string} voucherCode - The voucher code to validate
 * @param {Logger | null} logger - Optional logger instance
 * @returns {boolean} - True if voucher is WITH reward, false otherwise
 */
export const isVoucherWithReward = (
  voucherCode: string,
  logger?: Logger | null,
): boolean => {
  return !isVoucherWithoutReward(voucherCode, logger);
};
