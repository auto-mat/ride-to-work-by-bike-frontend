import { colors } from 'quasar';
import { i18n } from '../../boot/i18n';

import HeadingBackground from '../homepage/HeadingBackground.vue';

// composables
const { getPaletteColor } = colors;

// colors
const primary = getPaletteColor('primary');

// selectors
const selectorHeadingBackground = 'heading-background';
const selectorHeadingBackgroundHighlight = 'heading-background-highlight';
const selectorHeadingBackgroundImage = 'heading-background-image';
const selectorHeadingBackgroundTitle = 'heading-background-title';
const selectorSectionImage = 'section-image';
const selectorSectionText = 'section-text';

// variables
const sectionImageWidthMobile = 100;
const sectionTextWidthMobile = 100;

describe('<HeadingBackground>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['highlightCommunity', 'imageAltText', 'titleCommunity'],
      'index.headingBackground',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(HeadingBackground, {
        props: {},
      });
    });

    coreTests();

    it('renders sections side-by-side', () => {
      cy.viewport('macbook-16');
      cy.testElementsSideBySide(selectorSectionText, selectorSectionImage);
    });

    it('renders image', () => {
      cy.dataCy(selectorHeadingBackgroundImage).then((element) => {
        cy.wrap(element).matchImageSnapshot({
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
          timeout: 5000,
          customDiffConfig: { threshold: 0.5 },
          screenshotsFolder: 'test/cypress/snapshots',
          retries: 2,
          name: `heading-background-image-${Cypress.currentTest.titlePath[0]}`,
        });
      });
    })
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(HeadingBackground, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('renders sections stacked', () => {
      cy.testElementPercentageWidth(
        cy.dataCy(selectorSectionImage),
        sectionImageWidthMobile,
      );
      cy.testElementPercentageWidth(
        cy.dataCy(selectorSectionText),
        sectionTextWidthMobile,
      );
    });

    it('renders image', () => {
      cy.dataCy(selectorHeadingBackgroundImage).then((element) => {
        cy.wrap(element).matchImageSnapshot({
          failureThreshold: 0.1,
          failureThresholdType: 'percent',
          timeout: 5000,
          customDiffConfig: { threshold: 0.5 },
          screenshotsFolder: 'test/cypress/snapshots',
          retries: 2,
          name: `heading-background-image-${Cypress.currentTest.titlePath[0]}`,
        });
      });
    })
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy(selectorHeadingBackground).should('be.visible');
    // highlight
    cy.dataCy(selectorHeadingBackgroundHighlight)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', primary)
      .then(($el) => {
        const textContent = $el.text();
        cy.stripHtmlTags(
          i18n.global.t('index.headingBackground.highlightCommunity'),
        ).then((text) => {
          expect(textContent).to.equal(text);
        });
      });
    // title
    cy.dataCy(selectorHeadingBackgroundTitle)
      .should('be.visible')
      .and('have.css', 'font-size', '40px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', primary)
      .then(($el) => {
        const textContent = $el.text();
        cy.stripHtmlTags(
          i18n.global.t('index.headingBackground.titleCommunity'),
        ).then((text) => {
          expect(textContent).to.equal(text);
        });
      });
    // image
    cy.dataCy(selectorHeadingBackgroundImage)
      .should('be.visible')
      .find('img')
      .invoke('attr', 'alt')
      .should('eq', i18n.global.t('index.headingBackground.imageAltText'));
  });
}
