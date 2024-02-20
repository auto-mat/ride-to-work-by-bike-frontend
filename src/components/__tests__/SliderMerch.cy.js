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
      cy.dataCy('slider-merch').should('be.visible');
    });
  });
});
