import { colors } from 'quasar';
import CountdownChallenge from '../homepage/CountdownChallenge.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);
const colorInfo = rideToWorkByBikeConfig.colorGrayLight;

describe('<CountdownChallenge>', () => {
  const currentTime = new Date('2023-10-24T12:00:00');
  const dateEnd = new Date('2023-10-27T12:00:00');

  it('has translation for component strings', () => {
    cy.testLanguageStringsInContext(
      ['title'],
      'index.countdownChallenge',
      i18n,
    );
  });

  it('has translation for time strings', () => {
    cy.testLanguageStringsInContext(['day'], 'time', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CountdownChallenge, {
        props: {
          dateEnd,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('countdown-challenge-title')
          .should('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '700')
          .and('have.css', 'margin-top', '16px')
          .and('have.css', 'margin-bottom', '16px')
          .and('have.color', black);
      });
    });

    it('renders wrapper with padding', () => {
      cy.dataCy('countdown-challenge')
        .should('have.css', 'padding', '24px')
        .and('have.backgroundColor', colorInfo);
    });

    it('renders gray background', () => {
      cy.dataCy('countdown-challenge')
        .should('have.class', 'bg-info')
        .and('have.backgroundColor', colorInfo);
    });

    it('counts down correctly', () => {
      // set local time to get correct values
      cy.clock(currentTime.getTime()).then(() => {
        cy.dataCy('countdown-days').should('have.text', '3');
        cy.dataCy('countdown-hours').should('have.text', '0');
        cy.dataCy('countdown-minutes').should('have.text', '0');
        cy.dataCy('countdown-seconds').should('have.text', '0');
        // wait 1 second
        cy.tick(1000);
        cy.dataCy('countdown-days').should('have.text', '2');
        cy.dataCy('countdown-hours').should('have.text', '23');
        cy.dataCy('countdown-minutes').should('have.text', '59');
        cy.dataCy('countdown-seconds').should('have.text', '59');
        // wait 1 minute
        cy.tick(60 * 1000);
        cy.dataCy('countdown-days').should('have.text', '2');
        cy.dataCy('countdown-hours').should('have.text', '23');
        cy.dataCy('countdown-minutes').should('have.text', '58');
        cy.dataCy('countdown-seconds').should('have.text', '59');
        // wait 1 hour
        cy.tick(60 * 60 * 1000);
        cy.dataCy('countdown-days').should('have.text', '2');
        cy.dataCy('countdown-hours').should('have.text', '22');
        cy.dataCy('countdown-minutes').should('have.text', '58');
        cy.dataCy('countdown-seconds').should('have.text', '59');
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CountdownChallenge, {
        props: {
          dateEnd,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('countdown-challenge-title')
          .should('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '700')
          .and('have.css', 'margin-top', '16px')
          .and('have.css', 'margin-bottom', '16px')
          .and('have.color', black);
      });

      it('renders wrapper with padding', () => {
        cy.dataCy('countdown-challenge')
          .should('have.css', 'padding', '24px')
          .and('have.backgroundColor', colorInfo);
      });

      it('renders gray background', () => {
        cy.dataCy('countdown-challenge')
          .should('have.class', 'bg-info')
          .and('have.backgroundColor', colorInfo);
      });
    });
  });
});
