import { colors } from 'quasar';

import HelpButton from '../HelpButton.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const white = getPaletteColor('white');
const grey10 = getPaletteColor('grey-10');

const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);
const colorPrimary = rideToWorkByBikeConfig.colorPrimary;

describe('<HelpButton>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.help', i18n);
  });

  context('button grey', () => {
    beforeEach(() => {
      cy.mount(HelpButton, {
        props: {
          color: 'grey-10',
          size: '13px',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders help button', () => {
      cy.window().then(() => {
        cy.dataCy('button-help')
          .should('be.visible')
          .and('have.css', 'font-size', '13px')
          .and('have.css', 'font-weight', '500')
          .and('have.backgroundColor', grey10)
          .and('have.css', 'border-radius', '50%') // round
          .and('contain', 'question_mark');
      });
    });

    it('renders help button with correct size', () => {
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('button-help').invoke('height').should('be.equal', 39);
      cy.dataCy('button-help').invoke('width').should('be.equal', 39);
    });

    it('renders help icon', () => {
      cy.dataCy('icon-help')
        .should('contain', 'question_mark')
        .and('have.color', white);
      cy.dataCy('icon-help')
        .invoke('height')
        .should('be.gt', 22)
        .and('be.lt', 24);
      cy.dataCy('icon-help')
        .invoke('width')
        .should('be.gt', 22)
        .and('be.lt', 24);
    });
  });

  context('button primary', () => {
    beforeEach(() => {
      cy.mount(HelpButton, {
        props: {
          color: 'primary',
          size: '13px',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders help button', () => {
      cy.window().then(() => {
        cy.dataCy('button-help')
          .should('be.visible')
          .and('have.css', 'font-size', '13px')
          .and('have.css', 'font-weight', '500')
          .and('have.backgroundColor', `${colorPrimary}`)
          .and('have.css', 'border-radius', '50%'); // round
        cy.dataCy('button-help').should('contain', 'question_mark');
      });
    });

    it('renders help button with correct size', () => {
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('button-help').invoke('height').should('be.equal', 39);
      cy.dataCy('button-help').invoke('width').should('be.equal', 39);
    });

    it('renders help icon', () => {
      cy.dataCy('icon-help')
        .should('contain', 'question_mark')
        .and('have.color', white);
      cy.dataCy('icon-help')
        .invoke('height')
        .should('be.gt', 22)
        .and('be.lt', 24);
      cy.dataCy('icon-help')
        .invoke('width')
        .should('be.gt', 22)
        .and('be.lt', 24);
    });
  });

  context('button small', () => {
    beforeEach(() => {
      cy.mount(HelpButton, {
        props: {
          color: 'grey-10',
          size: '8px',
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders help button', () => {
      cy.dataCy('button-help')
        .should('be.visible')
        .and('have.css', 'font-size', '8px')
        .and('have.css', 'font-weight', '500')
        .and('have.backgroundColor', grey10)
        .and('have.css', 'border-radius', '50%'); // round
      cy.dataCy('button-help').should('contain', 'question_mark');
    });

    it('renders help button with correct size', () => {
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('button-help').invoke('height').should('be.equal', 24);
      cy.dataCy('button-help').invoke('width').should('be.equal', 24);
    });

    it('renders help icon', () => {
      cy.dataCy('icon-help')
        .should('contain', 'question_mark')
        .and('have.color', white);
      cy.dataCy('icon-help')
        .invoke('height')
        .should('be.gt', 12)
        .and('be.lt', 14);
      cy.dataCy('icon-help')
        .invoke('width')
        .should('be.gt', 12)
        .and('be.lt', 14);
    });
  });

  context('dialog', () => {
    beforeEach(() => {
      cy.mount(HelpButton, {
        props: {
          color: 'grey-10',
          size: '13px',
        },
      });
      cy.viewport('macbook-16');
    });

    it('shows modal dialog on click', () => {
      cy.window().then(() => {
        cy.dataCy('button-help').should('be.visible');
        cy.dataCy('button-help').click();
        cy.dataCy('dialog-help').should('be.visible');
      });
    });

    it('renders modal title', () => {
      cy.window().then(() => {
        cy.dataCy('button-help').should('be.visible');
        cy.dataCy('button-help').click();
        cy.dataCy('dialog-header')
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('contain', i18n.global.t('index.help.titleStateDefault'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.help.titleStateDefault'),
            );
          });
      });
    });

    it('renders guide section with title and button', () => {
      cy.window().then(() => {
        cy.dataCy('button-help').should('be.visible');
        cy.dataCy('button-help').click();
        // TODO: Find if you can calculate height exact height of the sections
        cy.dataCy('dialog-content').scrollTo(0, 1060);
        cy.dataCy('title-guide')
          .should('be.visible')
          .and('have.css', 'font-size', '24px')
          .and('have.css', 'font-weight', '700')
          .and('contain', i18n.global.t('index.help.titleGuide'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('index.help.titleGuide'),
            );
          });
        cy.dataCy('button-guide')
          .should('be.visible')
          .and('contain.text', i18n.global.t('index.help.buttonGuide'))
          .then(($button) => {
            expect($button.text()).to.equal(
              i18n.global.t('index.help.buttonGuide'),
            );
          });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(HelpButton, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
