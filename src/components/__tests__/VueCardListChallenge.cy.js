import VueCardListChallenge from '../VueCardListChallenge.vue';
import { i18n } from '../../boot/i18n';

describe('<VueCardListChallenge>', () => {
  beforeEach(() => {
    cy.mount(VueCardListChallenge, {
      props: {
        cards: [
          {
            title: 'Challenge 1',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
          {
            title: 'Challenge 2',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
          {
            title: 'Challenge 3',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
          {
            title: 'Challenge 4',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
          {
            title: 'Challenge 5',
            url: '#',
            dates: '1. říj. – 31. říj. 2022',
          },
        ],
      },
    });
  });

  it('has translation for all strings', () => {
    const translationKeyList = ['index.cardList.title'];

    translationKeyList.forEach((translationKey) => {
      const defaultEnglishString = i18n.global.t(translationKey, 'en');

      const locales = i18n.global.availableLocales;
      locales.filter((locale) => locale !== 'en').forEach((locale) => {
        i18n.global.locale = locale;
        const translatedString = i18n.global.t(translationKey);

        cy.wrap(translatedString)
          .should('be.a', 'string')
          .and('not.equal', defaultEnglishString);
      })
    })
  })

  it('renders title', () => {
    cy.window().then(() => {
      cy.dataCy('card-list-title')
        .should('be.visible')
        .should('contain', i18n.global.t("index.cardList.title"));
    });

  });

  it('renders correct number of items', () => {
    cy.window().then(() => {
      cy.dataCy('card-list-item').should('have.length', 5);
    });
  });

  it('renders cards in a responsive grid', () => {

    cy.dataCy('card-list')
      .should('have.css', 'display', 'flex')
      .should('have.css', 'flex-wrap', 'wrap');

      cy.viewport('iphone-6');
      cy.dataCy('card-list-item')
      .then($element => {
        expect(calculatePercentageWidth($element)).to.be.closeTo(100, 0.5);
      });

      cy.viewport('macbook-13');
      cy.dataCy('card-list-item')
      .then($element => {
        expect(calculatePercentageWidth($element)).to.be.closeTo(50, 0.5);
      });

      cy.viewport('macbook-15');
      cy.dataCy('card-list-item')
      .then($element => {
        expect(calculatePercentageWidth($element)).to.be.closeTo(33, 0.5);
      });
  });

  function calculatePercentageWidth($element) {
    const elementWidth = $element[0].clientWidth;
    const parentWidth = $element[0].parentNode.clientWidth;
    return (elementWidth / parentWidth) * 100;
  }
});
