import VueEventCountdown from '../VueEventCountdown.vue';
import { i18n } from '../../boot/i18n';

describe('Event Countdown', () => {
  const releaseDate = new Date('2023-10-01T12:00:00');
  const currentTime = new Date('2023-09-30T12:00:00');

  beforeEach(() => {

    cy.mount(VueEventCountdown, {
      props: {
        releaseDate,
      },
    });
  });

  it('has translation for all strings', () => {
    const translationKeyList = [
      'index.countdown.title',
      'index.countdown.days',
      'index.countdown.hours',
      'index.countdown.minutes',
      'index.countdown.seconds',
    ]

    translationKeyList.forEach((translationKey) => {
      const defaultEnglishString = i18n.global.t(translationKey, 'en');

      const locales = i18n.global.availableLocales;
      locales
        .filter((locale) => locale !== 'en')
        .forEach((locale) => {
          i18n.global.locale = locale;
          const translatedString = i18n.global.t(translationKey);

          cy.wrap(translatedString)
            .should('be.a', 'string')
            .and('not.equal', defaultEnglishString);
        });
    });
  });

  it('should display internationalized labels', () => {
    cy.dataCy("countdown-label-days").should(
      'contain.text',
      i18n.global.t('index.countdown.days')
    );
    cy.dataCy("countdown-label-hours").should(
      'contain.text',
      i18n.global.t('index.countdown.hours')
    );
    cy.dataCy("countdown-label-minutes").should(
      'contain.text',
      i18n.global.t('index.countdown.minutes')
    );
    cy.dataCy("countdown-label-seconds").should(
      'contain.text',
      i18n.global.t('index.countdown.seconds')
    );
  });

  it('should render the date in correct format', () => {
    cy.dataCy("target-date").should('be.visible').should('contain', '1. 10.');
  });

  it('should count down', () => {
    cy.clock(currentTime.getTime()).then(() => {
      cy.dataCy('countdown-days').should('be.visible').should('have.text', '1');
      cy.dataCy('countdown-hours').should('be.visible').should('have.text', '0');
      cy.dataCy('countdown-minutes').should('be.visible').should('have.text', '0');
      cy.dataCy('countdown-seconds').should('be.visible').should('have.text', '0');

      cy.tick(1000);

      cy.dataCy('countdown-days').should('be.visible').should('have.text', '0');
      cy.dataCy('countdown-hours').should('be.visible').should('have.text', '23');
      cy.dataCy('countdown-minutes').should('be.visible').should('have.text', '59');
      cy.dataCy('countdown-seconds').should('be.visible').should('have.text', '59');

      cy.tick(60*60*1000);

      cy.dataCy('countdown-days').should('be.visible').should('have.text', '0');
      cy.dataCy('countdown-hours').should('be.visible').should('have.text', '22');
      cy.dataCy('countdown-minutes').should('be.visible').should('have.text', '59');
      cy.dataCy('countdown-seconds').should('be.visible').should('have.text', '59');
    });


  })
});
