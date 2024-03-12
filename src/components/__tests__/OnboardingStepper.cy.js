import { colors } from 'quasar';

import OnboardingStepper from 'components/onboarding/OnboardingStepper.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const grey10 = getPaletteColor('grey-10');

describe('<OnboardingStepper>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['skip'], 'navigation', i18n);
    cy.testLanguageStringsInContext(
      [
        'buttonInviteFriends',
        'descriptionStep1',
        'descriptionStep2',
        'labelInviteEmailAddresses',
        'labelLanguage',
        'messageRequiredAddresses',
        'textMessage',
        'titleMessage',
        'titleStep1',
        'titleStep2',
      ],
      'onboarding',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(OnboardingStepper, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('onboarding-stepper').should('be.visible');
      // title
      cy.dataCy('step1-title')
        .should('be.visible')
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700')
        .and('have.css', 'margin-top', '0px')
        .and('have.css', 'margin-bottom', '0px')
        .and('have.color', black)
        .and('contain', i18n.global.t('onboarding.titleStep1'));
      // description
      cy.dataCy('step1-description')
        .should('be.visible')
        .and('have.css', 'margin-top', '24px')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '500')
        .and('have.color', grey10)
        .and('contain', i18n.global.t('onboarding.descriptionStep1'));
      // video
      cy.dataCy('step1-video').should('be.visible');
      cy.dataCy('step1-video').invoke('height').should('be.gt', 100);
      cy.dataCy('step1-video').invoke('width').should('be.gt', 100);
      // navigation buttons
      cy.dataCy('button-skip')
        .should('be.visible')
        .and('contain', i18n.global.t('navigation.skip'));
      cy.dataCy('button-continue')
        .should('be.visible')
        .and('contain', i18n.global.t('navigation.continue'));
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(OnboardingStepper, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
