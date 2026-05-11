import PlayVideoModalDialog from '../global/PlayVideoModalDialog.vue';

import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

describe('<PlayVideoModalDialog>', () => {
  context('desktop', () => {
    const videoFileName = rideToWorkByBikeConfig.urlLogRouteCalendarNumberVideo
      .split('/')
      .pop();
    const transText = i18n.global.t('routes.logRouterCalendarNumberText', {
      expectedFloatNum0: i18n.global.n(2.55, 'routeDistanceDecimalNumber'),
      typedIntNum0: '255',
      expectedFloatNum1: i18n.global.n(14.56, 'routeDistanceDecimalNumber'),
      typedIntNum1: '1456',
      expectedFloatNum2: i18n.global.n(0.34, 'routeDistanceDecimalNumber'),
      typedIntNum2: '034',
      expectedFloatNum3: i18n.global.n(0.09, 'routeDistanceDecimalNumber'),
      typedIntNum3: '009',
    });
    const overlayedTextSlot = `<div class="bg-grey-1w q-px-md video-overlayed-text-linear-gradient" data-cy="overlayed-text">${transText}</div>`;
    beforeEach(() => {
      cy.mount(PlayVideoModalDialog, {
        props: {
          videoUrl: rideToWorkByBikeConfig.urlLogRouteCalendarNumberVideo,
          btnLabel: i18n.global.t('routes.logRouterPlayVideoBtnLabel'),
        },
        slots: {
          overlayedText: overlayedTextSlot,
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests(videoFileName);
  });

  context('mobile', () => {
    const videoFileName = rideToWorkByBikeConfig.urlLogRouteListNumberVideo
      .split('/')
      .pop();
    const transText = i18n.global.t('routes.logRouterCalendarNumberText', {
      expectedFloatNum0: i18n.global.n(1.22, 'routeDistanceDecimalNumber'),
      typedIntNum0: '255',
      expectedFloatNum1: i18n.global.n(14.56, 'routeDistanceDecimalNumber'),
      typedIntNum1: '1456',
      expectedFloatNum2: i18n.global.n(0.34, 'routeDistanceDecimalNumber'),
      typedIntNum2: '034',
      expectedFloatNum3: i18n.global.n(0.09, 'routeDistanceDecimalNumber'),
      typedIntNum3: '009',
    });
    const overlayedTextSlot = `<div class="bg-grey-1w q-px-md video-overlayed-text-linear-gradient" data-cy="overlayed-text">${transText}</div>`;
    beforeEach(() => {
      cy.mount(PlayVideoModalDialog, {
        props: {
          videoUrl: rideToWorkByBikeConfig.urlLogRouteListNumberVideo,
          btnLabel: i18n.global.t('routes.logRouterPlayVideoBtnLabel'),
        },
        slots: {
          overlayedText: overlayedTextSlot,
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests(videoFileName);
  });
});

function coreTests(videoFileName) {
  it('renders component', () => {
    cy.playVideoModalDialog(videoFileName, i18n);
  });
}
