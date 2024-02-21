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
  });
});
