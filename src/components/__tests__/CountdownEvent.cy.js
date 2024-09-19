import { colors } from 'quasar';

import CountdownEvent from '../homepage/CountdownEvent.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const grey8 = getPaletteColor('grey-8');
const { colorPrimary, borderRadiusCard, colorSecondaryOpacity } =
  rideToWorkByBikeConfig;

describe('<CountdownEvent>', () => {
  const releaseDate = new Date('2023-10-01T12:00:00');
  const currentTime = new Date('2023-09-30T12:00:00');

  beforeEach(() => {
    cy.mount(CountdownEvent, {
      props: {
        releaseDate,
      },
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['title', 'days', 'hours', 'minutes', 'seconds'],
      'index.countdown',
      i18n,
    );
  });

  it('displays internationalized labels', () => {
    cy.dataCy('countdown-label-days').should(
      'contain.text',
      i18n.global.t('index.countdown.days'),
    );
    cy.dataCy('countdown-label-hours').should(
      'contain.text',
      i18n.global.t('index.countdown.hours'),
    );
    cy.dataCy('countdown-label-minutes').should(
      'contain.text',
      i18n.global.t('index.countdown.minutes'),
    );
    cy.dataCy('countdown-label-seconds').should(
      'contain.text',
      i18n.global.t('index.countdown.seconds'),
    );
  });

  it('renders a title with correct styles', () => {
    cy.window().then(() => {
      cy.dataCy('title')
        .should('be.visible')
        .and('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10);
    });
  });

  it('renders the date in correct format', () => {
    cy.dataCy('title').should('be.visible').and('contain', '1. 10.');
  });

  it('renders the numbers in correct format', () => {
    let fontSize;
    const fontWeight = '700';
    cy.window()
      .then((win) => {
        fontSize = win.countdownEvent.fontSize;
      })
      .then(() => {
        cy.dataCy('countdown-days')
          .should('be.visible')
          .and('have.css', 'font-size', fontSize)
          .and('have.css', 'font-weight', fontWeight)
          .and('have.color', colorPrimary);
        cy.dataCy('countdown-hours')
          .should('be.visible')
          .and('have.css', 'font-size', fontSize)
          .and('have.css', 'font-weight', fontWeight)
          .and('have.color', colorPrimary);
        cy.dataCy('countdown-minutes')
          .should('be.visible')
          .and('have.css', 'font-size', fontSize)
          .and('have.css', 'font-weight', fontWeight)
          .and('have.color', colorPrimary);
        cy.dataCy('countdown-seconds')
          .should('be.visible')
          .and('have.css', 'font-size', fontSize)
          .and('have.css', 'font-weight', fontWeight)
          .and('have.color', colorPrimary);
      });
  });

  it('renders the labels in correct format', () => {
    const fontSize = '14px';
    const fontWeight = '400';
    cy.dataCy('countdown-label-days')
      .should('be.visible')
      .and('have.css', 'font-size', fontSize)
      .and('have.css', 'font-weight', fontWeight)
      .and('have.color', grey8);
    cy.dataCy('countdown-label-hours')
      .should('be.visible')
      .and('have.css', 'font-size', fontSize)
      .and('have.css', 'font-weight', fontWeight)
      .and('have.color', grey8);
    cy.dataCy('countdown-label-minutes')
      .should('be.visible')
      .and('have.css', 'font-size', fontSize)
      .and('have.css', 'font-weight', fontWeight)
      .and('have.color', grey8);
    cy.dataCy('countdown-label-seconds')
      .should('be.visible')
      .and('have.css', 'font-size', fontSize)
      .and('have.css', 'font-weight', fontWeight)
      .and('have.color', grey8);
  });

  it('has correct background', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .should('be.visible')
        .and('have.css', 'border-radius', borderRadiusCard)
        .and('have.backgroundColor', colorSecondaryOpacity);
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
