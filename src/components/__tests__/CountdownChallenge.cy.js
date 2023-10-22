import CountdownChallenge from 'components/CountdownChallenge.vue';
import { i18n } from '../../boot/i18n';

const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG
);
const colorInfo = rideToWorkByBikeConfig.colorGrayLight;

describe('<CountdownChallenge>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['title'], 'index.countdownChallenge', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CountdownChallenge, {
        props: {
          dateEnd: '2023-10-24',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('countdown-challenge-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '700')
          .should('have.css', 'margin-top', '16px')
          .should('have.css', 'margin-bottom', '16px')
          .should('have.color', '#000')
      });
    });

    it('renders wrapper with padding', () => {
      cy.dataCy('countdown-challenge')
        .should('have.css', 'padding', '24px')
        .should('have.backgroundColor', `${colorInfo}`);
    });

    it('renders gray background', () => {
      cy.dataCy('countdown-challenge')
        .should('have.class', 'bg-info')
        .should('have.backgroundColor', `${colorInfo}`);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CountdownChallenge, {
        props: {
          dateEnd: '2023-10-24',
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('countdown-challenge-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '700')
          .should('have.css', 'margin-top', '16px')
          .should('have.css', 'margin-bottom', '16px')
          .should('have.color', '#000')
    });

    it('renders wrapper with padding', () => {
      cy.dataCy('countdown-challenge')
        .should('have.css', 'padding', '24px')
        .should('have.backgroundColor', `${colorInfo}`);
    });

    it('renders gray background', () => {
      cy.dataCy('countdown-challenge')
      .should('have.class', 'bg-info')
      .should('have.backgroundColor', `${colorInfo}`);
    });
  });
});
