import { rideToWorkByBikeConfig } from '../boot/global_vars';

/**
 * Checks if the current challenge is September or October.
 * @return {boolean} - Whether the current challenge is September or October.
 */
export const isSeptemberChallenge = (): boolean => {
  return (
    rideToWorkByBikeConfig.challengeMonth === 'september' ||
    rideToWorkByBikeConfig.challengeMonth === 'october'
  );
};
