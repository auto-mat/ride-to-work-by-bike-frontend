import SliderMerch from 'components/form/SliderMerch.vue';
import { i18n } from '../../boot/i18n';

describe('<SliderMerch>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('sliderMerch').then((images) => {
        cy.mount(SliderMerch, {
          props: {
            items: images,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders component', () => {
      cy.fixture('sliderMerch').then((images) => {
        cy.dataCy('slider-merch').should('be.visible');
        cy.dataCy('swiper-image').should('be.visible');
        cy.dataCy('swiper-image')
          .first()
          .find('img')
          .should('have.attr', 'src', images[0].src);
        cy.dataCy('swiper-image')
          .last()
          .find('img')
          .should('have.attr', 'src', images[2].src);
        cy.testElementPercentageWidth(cy.dataCy('swiper-image'), 100);
      });
    });

    it('renders swiper navigation buttons', () => {
      cy.window().then(() => {
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .should('be.visible')
          .and('have.css', 'width', '38px')
          .and('have.css', 'height', '38px');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .should('be.visible')
          .and('have.css', 'width', '38px')
          .and('have.css', 'height', '38px');
      });
    });

    it('changes button disabled state after navigation', () => {
      cy.window().then(() => {
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .should('have.css', 'opacity', '0.35');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .should('have.css', 'opacity', '1');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .click();
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .should('have.css', 'opacity', '1');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .should('have.css', 'opacity', '1');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .click();
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-prev')
          .should('have.css', 'opacity', '0.35');
        cy.dataCy('swiper-container')
          .shadow()
          .find('.swiper-button-next')
          .should('have.css', 'opacity', '1');
      });
    });
  });
});
