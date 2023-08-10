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
    cy.testLanguageStringsInContext(
      ['title', 'days', 'hours', 'minutes', 'seconds'],
      'index.countdown',
      i18n
    );
  });

  it('displays internationalized labels', () => {
    cy.dataCy('countdown-label-days').should(
      'contain.text',
      i18n.global.t('index.countdown.days')
    );
    cy.dataCy('countdown-label-hours').should(
      'contain.text',
      i18n.global.t('index.countdown.hours')
    );
    cy.dataCy('countdown-label-minutes').should(
      'contain.text',
      i18n.global.t('index.countdown.minutes')
    );
    cy.dataCy('countdown-label-seconds').should(
      'contain.text',
      i18n.global.t('index.countdown.seconds')
    );
  });

  it('renders a title with correct styles', () => {
    cy.window().then(() => {
      cy.dataCy('title')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '700');
    });
  });

  it('renders the date in correct format', () => {
    cy.dataCy('title').should('be.visible').should('contain', '1. 10.');
  });

  it('renders the numbers in correct format', () => {
    cy.dataCy('countdown-days')
      .should('be.visible')
      .should('have.css', 'font-size', '64px')
      .should('have.css', 'font-weight', '700');
    cy.dataCy('countdown-hours')
      .should('be.visible')
      .should('have.css', 'font-size', '64px')
      .should('have.css', 'font-weight', '700');
    cy.dataCy('countdown-minutes')
      .should('be.visible')
      .should('have.css', 'font-size', '64px')
      .should('have.css', 'font-weight', '700');
    cy.dataCy('countdown-seconds')
      .should('be.visible')
      .should('have.css', 'font-size', '64px')
      .should('have.css', 'font-weight', '700');
  });

  it('renders the labels in correct format', () => {
    cy.dataCy('countdown-label-days')
      .should('be.visible')
      .should('have.css', 'font-size', '14px')
      .should('have.css', 'font-weight', '400');
    cy.dataCy('countdown-label-hours')
      .should('be.visible')
      .should('have.css', 'font-size', '14px')
      .should('have.css', 'font-weight', '400');
    cy.dataCy('countdown-label-minutes')
      .should('be.visible')
      .should('have.css', 'font-size', '14px')
      .should('have.css', 'font-weight', '400');
    cy.dataCy('countdown-label-seconds')
      .should('be.visible')
      .should('have.css', 'font-size', '14px')
      .should('have.css', 'font-weight', '400');
  });

  it('has gray background', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .should('be.visible')
        .should('have.css', 'background-color', 'rgb(243, 247, 255)');
    });
  });

  it('counts down correctly', () => {
    cy.clock(currentTime.getTime()).then(() => {
      cy.dataCy('countdown-days').should('have.text', '1');
      cy.dataCy('countdown-hours').should('have.text', '0');
      cy.dataCy('countdown-minutes').should('have.text', '0');
      cy.dataCy('countdown-seconds').should('have.text', '0');

      cy.tick(1000);

      cy.dataCy('countdown-days').should('have.text', '0');
      cy.dataCy('countdown-hours').should('have.text', '23');
      cy.dataCy('countdown-minutes').should('have.text', '59');
      cy.dataCy('countdown-seconds').should('have.text', '59');

      cy.tick(60 * 60 * 1000);

      cy.dataCy('countdown-days').should('have.text', '0');
      cy.dataCy('countdown-hours').should('have.text', '22');
      cy.dataCy('countdown-minutes').should('have.text', '59');
      cy.dataCy('countdown-seconds').should('have.text', '59');
    });
  });
});
