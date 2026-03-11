import { boot } from 'quasar/wrappers';

import { initMatomo } from '@certible/use-matomo';
import { rideToWorkByBikeConfig } from './global_vars';

/**
 * Matomo Analytics integration for Quasar.
 *
 * @see https://www.npmjs.com/package/@certible/use-matomo
 * @see https://matomo.org/
 */
export default boot(({ app }) => {
  if (rideToWorkByBikeConfig.urlMatomoAnalytics.length > 0) {
    const matomo = initMatomo({
      host: rideToWorkByBikeConfig.urlMatomoAnalytics,
      siteId: rideToWorkByBikeConfig.matomoAnalyticsRtwbbAppSiteId,
      enableLinkTracking: true,
      requireConsent: true, // GDPR compliance
      trackRouter: true, // Automatic SPA page changes via history tracking
    });
    app.provide('matomo', matomo);
  }
});
