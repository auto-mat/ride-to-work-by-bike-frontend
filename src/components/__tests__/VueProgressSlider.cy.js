import VueProgressSlider from 'components/VueProgressSlider.vue';
import { hexToRgb } from '../../../test/cypress/utils';
import { i18n } from '../../boot/i18n';

const title = 'Vaše výsledky';
const stats = [
  {
    icon: 'route',
    label: 'udržitelných cest',
    value: '18',
  },
  {
    icon: 'distance',
    label: '312,25 km',
    value: '',
  },
  {
    icon: 'leaf',
    label: 'ušetřeno',
    value: '420 g CO2',
  },
];
const cards = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
];
const button = {
  title: 'Všechny výsledky',
};

describe('<VueProgressSlider>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueProgressSlider, {
        props: {
          title,
          stats,
          cards,
          button,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('progress-slider-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders list of stats', () => {
      cy.window().then(() => {
        cy.dataCy('progress-slider-stats-item').should('have.length', 3);

        cy.dataCy('progress-slider-stats-item').each(($item, index) => {
          cy.wrap($item)
            .should('have.css', 'font-size', '14px')
            .should('have.css', 'font-weight', '400')
            .should('have.color', '#212121');

          cy.wrap($item)
            .find('.q-icon')
            .should('contain', stats[index].icon)
            .should('have.color', '#b0bec5')
            .should('have.css', 'width', '18px')
            .should('have.css', 'height', '18px');

          cy.wrap($item)
            .find('span')
            .should('contain', stats[index].label)
            .should('have.color', '#212121');

          cy.wrap($item)
            .find('strong')
            .should('contain', stats[index].value)
            .should('have.color', '#212121')
            .should('have.css', 'font-weight', '700');
        });
      });
    });

    it('renders a slider with stat cards', () => {
      cy.window().then(() => {
        cy.dataCy('progress-slider-swiper').should('be.visible');
      });
    });

    it('renders swiper navigation buttons', () => {
      cy.window().then(() => {
        cy.get('.swiper-button-prev')
          .should('be.visible')
          .should('have.css', 'width', '38px')
          .should('have.css', 'height', '38px')
          .should('have.css', 'border', `1px solid ${hexToRgb('#bdbdbd')}`);
        cy.get('.swiper-button-next')
          .should('be.visible')
          .should('have.css', 'width', '38px')
          .should('have.css', 'height', '38px')
          .should('have.css', 'border', `1px solid ${hexToRgb('#212121')}`);
      });
    });

    it('navigates after button click', () => {
      cy.window().then(() => {
        cy.get('.swiper-slide:nth-child(1)').should('be.visible');
        cy.get('.swiper-slide:nth-child(2)').should('not.be.visible');
        cy.get('.swiper-button-next').click();
        cy.get('.swiper-slide:nth-child(1)').should('not.be.visible');
        cy.get('.swiper-slide:nth-child(2)').should('be.visible');
        cy.get('.swiper-button-prev').click();
        cy.get('.swiper-slide:nth-child(1)').should('be.visible');
        cy.get('.swiper-slide:nth-child(2)').should('not.be.visible');
      });
    });

    it('changes button disabled state after navigation', () => {
      cy.window().then(() => {
        cy.get('.swiper-button-prev').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#bdbdbd')}`
        );
        cy.get('.swiper-button-next').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
        cy.get('.swiper-button-next').click();
        cy.get('.swiper-button-prev').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
        cy.get('.swiper-button-next').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
        cy.get('.swiper-button-prev').click();
        cy.get('.swiper-button-prev').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#bdbdbd')}`
        );
        cy.get('.swiper-button-next').should(
          'have.css',
          'border',
          `1px solid ${hexToRgb('#212121')}`
        );
      });
    });

    it('renders button with title', () => {
      cy.dataCy('progress-slider-button')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '500')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.color', '#212121')
        .should('have.css', 'border-radius', '28px')
        .should('contain', button.title)
        .then(($title) => {
          expect($title.text()).to.equal(button.title);
        });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueProgressSlider, {
        props: {
          title,
          stats,
          cards,
          button,
        },
      });
      cy.viewport('iphone-6');
    });
  });
});
