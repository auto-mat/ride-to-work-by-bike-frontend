import VueCardProgress from 'components/VueCardProgress.vue';
import { i18n } from '../../boot/i18n';

const card = {
  title: 'Týmová pravidelnost',
  icon: 'person',
  url: '#',
  progress: 60,
  stats: [],
  duration: {
    current: 14,
    total: 30,
  },
};

describe('<VueCardProgress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['timeline', 'toDate'], 'index.cardProgress', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardProgress, {
        props: {
          card,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#fff')
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-header')
        .find('.q-icon')
        .should('contain', card.icon)
        .should('have.color', '#eceff1') // blue-grey-1
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    });

    it('renders timeline', () => {
      cy.dataCy('card-progress-timeline')
        .should('be.visible')
        .should('contain', card.duration.current)
        .should('contain', card.duration.total)
        .should('contain', i18n.global.t('index.cardProgress.timeline'))
        .should('have.color', '#fff')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400');

      cy.dataCy('card-progress-timeline')
        .find('.q-linear-progress')
        .should('be.visible');
    });

    it.only('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .should('contain', card.progress)
        .should('contain', i18n.global.t('index.cardProgress.toDate'));

      cy.dataCy('card-progress-circular')
        .should('be.visible');
    });

    it('renders stats', () => {
      cy.dataCy('card-progress-stats')
        .should('be.visible')
        .find('.stats-title')
        .first()
        .should('contain', card.stats[0].title)
        .should('have.color', '#fff')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.css', 'font-size', '12px');

      cy.dataCy('card-progress-stats')
        .should('be.visible')
        .find('.stats-value')
        .first()
        .should('contain', card.stats[0].value)
        .should('have.color', '#fff')
        .should('have.css', 'font-weight', '400')
        .should('have.css', 'font-size', '14px');
    });

    // layout
    it('renders card header horizontally', () => {
      cy.dataCy('card-progress-header')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'justify-content', 'space-between')
        .should('have.css', 'align-items', 'center')
        .should('have.css', 'gap', '16px');
    });

    it('renders card content horizontally', () => {
      cy.dataCy('card-progress-content')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'justify-content', 'space-between')
        .should('have.css', 'align-items', 'center');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardProgress, {
        props: {
          card,
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('card-progress-title')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#fff')
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    });

    it('renders title icon', () => {
      cy.dataCy('card-progress-title')
        .find('.q-icon')
        .should('contain', icon)
        .should('have.color', '#eceff1') // blue-grey-1
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    });

    it('renders timeline', () => {
      cy.dataCy('card-progress-timeline')
        .should('be.visible')
        .should('contain', card.duration.current)
        .should('contain', card.duration.total)
        .should('have.color', '#fff')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400');

      cy.dataCy('card-progress-timeline')
        .find('.progress-bar')
        .should('be.visible')
        .should('have.backgroundColor', '#212121');

      cy.dataCy('card-progress-timeline')
        .find('.progress-indicator')
        .should('be.visible')
        .should('have.backgroundColor', '#fff');
    });

    it('renders percentage', () => {
      cy.dataCy('card-progress-percentage')
        .should('be.visible')
        .should('contain', card.percentage)
        .should('contain', i18n.t('index.cardProgress.current'));

      cy.dataCy('card-progress-percentage')
        .find('progress-circle')
        .should('be.visible')
        .should('have.backgroundColor', '#212121');

      cy.dataCy('card-progress-percentage')
        .find('.progress-indicator')
        .should('be.visible')
        .should('have.backgroundColor', '#fff');
    });

    it('renders stats', () => {
      cy.dataCy('card-progress-stats')
        .should('be.visible')
        .find('.stats-title')
        .first()
        .should('contain', card.stats[0].title)
        .should('have.color', '#fff')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.css', 'font-size', '12px');

      cy.dataCy('card-progress-stats')
        .should('be.visible')
        .find('.stats-value')
        .first()
        .should('contain', card.stats[0].value)
        .should('have.color', '#fff')
        .should('have.css', 'font-weight', '400')
        .should('have.css', 'font-size', '14px');
    });

    // layout
    it('wraps items in card header', () => {
      cy.dataCy('card-progress-header')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'flex-wrap', 'wrap')
        .should('have.css', 'gap', '16px');
    });

    it('wraps items in card content', () => {
      cy.dataCy('card-progress-content')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'flex-wrap', 'wrap')
        .should('have.css', 'gap', '16px');
    });
  });
});
