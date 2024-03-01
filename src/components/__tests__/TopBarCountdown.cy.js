import { colors } from 'quasar';

import TopBarCountdown from '../global/TopBarCountdown.vue';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const red = getPaletteColor('red');

const { challengeMonth, challengeStartDate } = rideToWorkByBikeConfig;

describe('TopBarCountdown', () => {
  const releaseDate = new Date(challengeStartDate);
  const currentTime = new Date(challengeStartDate);
  currentTime.setDate(releaseDate.getDate() - 1);

  beforeEach(() => {
    cy.mount(TopBarCountdown, {
      props: {
        releaseDate,
      },
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['textCountdownSeptember', 'textCountdownOctober', 'textCountdownMay'],
      'register.challenge',
      i18n,
    );
  });

  it('displays internationalized labels based on month', () => {
    cy.clock(currentTime.getTime()).then(() => {
      cy.dataCy('top-bar-countdown')
        .should('be.visible')
        .and('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', white)
        .and('have.backgroundColor', red);
      if (challengeMonth === 'may') {
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownMay', {
            days: '1',
            hours: '0',
            minutes: '0',
            seconds: '0',
          }),
        );
      }
      if (challengeMonth === 'september') {
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownSeptember', {
            days: '1',
            hours: '0',
            minutes: '0',
            seconds: '0',
          }),
        );
      }
      if (challengeMonth === 'october') {
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownOctober', {
            days: '1',
            hours: '0',
            minutes: '0',
            seconds: '0',
          }),
        );
      }
    });
  });

  it('counts down correctly', () => {
    cy.clock(currentTime.getTime()).then(() => {
      if (challengeMonth === 'may') {
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownMay', {
            days: '1',
            hours: '0',
            minutes: '0',
            seconds: '0',
          }),
        );
        cy.tick(1000);
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownMay', {
            days: '0',
            hours: '23',
            minutes: '59',
            seconds: '59',
          }),
        );
        cy.tick(60 * 60 * 1000);
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownMay', {
            days: '0',
            hours: '22',
            minutes: '59',
            seconds: '59',
          }),
        );
      }
      if (challengeMonth === 'september') {
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownSeptember', {
            days: '1',
            hours: '0',
            minutes: '0',
            seconds: '0',
          }),
        );
        cy.tick(1000);
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownSeptember', {
            days: '0',
            hours: '23',
            minutes: '59',
            seconds: '59',
          }),
        );
        cy.tick(60 * 60 * 1000);
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownMay', {
            days: '0',
            hours: '22',
            minutes: '59',
            seconds: '59',
          }),
        );
      }
      if (challengeMonth === 'october') {
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownOctober', {
            days: '1',
            hours: '0',
            minutes: '0',
            seconds: '0',
          }),
        );
        cy.tick(1000);
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownOctober', {
            days: '0',
            hours: '23',
            minutes: '59',
            seconds: '59',
          }),
        );
        cy.tick(60 * 60 * 1000);
        cy.dataCy('top-bar-countdown').should(
          'contain.text',
          i18n.global.t('register.challenge.textCountdownMay', {
            days: '0',
            hours: '22',
            minutes: '59',
            seconds: '59',
          }),
        );
      }
    });
  });
});
