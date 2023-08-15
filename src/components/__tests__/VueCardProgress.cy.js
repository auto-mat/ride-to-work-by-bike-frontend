import VueCardProgress from 'components/VueCardProgress.vue';
import i18n from 'src/boot/i18n';

const card = {
  title: 'Týmová pravidelnost',
  icon: 'person',
  percentage: 60,
  stats: [],
  duration: {
    current: 14,
    total: 30
  }
}

describe('<VueCardProgress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component');
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueCardProgress, {
        props: {
          card
        },
      });
      cy.viewport('macbook-16');
    });

    it.only('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('progress-card-title')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#fff')
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    })

    it('renders title icon', () => {
      cy.dataCy('progress-card-title')
        .find('.q-icon')
        .should('contain', icon)
        .should('have.color', '#eceff1') // blue-grey-1
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    })

    it('renders timeline', () => {
      cy.dataCy('progress-card-timeline')
        .should('be.visible')
        .should('contain', card.duration.current)
        .should('contain', card.duration.total)
        .should('have.color', '#fff')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400');

      cy.dataCy('progress-card-timeline')
        .find('.progress-bar')
        .should('be.visible')
        .should('have.backgroundColor', '#212121');

      cy.dataCy('progress-card-timeline')
        .find('.progress-indicator')
        .should('be.visible')
        .should('have.backgroundColor', '#fff');
    })

    it('renders percentage', () => {
      cy.dataCy('progress-card-percentage')
        .should('be.visible')
        .should('contain', card.percentage)
        .should('contain', i18n.t('index.cardProgress.current'))

      cy.dataCy('progress-card-percentage')
        .find('progress-circle')
        .should('be.visible')
        .should('have.backgroundColor', '#212121');

      cy.dataCy('progress-card-percentage')
        .find('.progress-indicator')
        .should('be.visible')
        .should('have.backgroundColor', '#fff');
    })

    it('renders stats', () => {
      cy.dataCy('progress-card-stats')
        .should('be.visible')
        .find('.stats-title')
        .first()
        .should('contain', card.stats[0].title)
        .should('have.color', '#fff')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.css', 'font-size', '12px')

      cy.dataCy('progress-card-stats')
      .should('be.visible')
        .find('.stats-value')
        .first()
        .should('contain', card.stats[0].value)
        .should('have.color', '#fff')
        .should('have.css', 'font-weight', '400')
        .should('have.css', 'font-size', '14px')
    })

    // layout
    it('renders card header horizontally', () => {
      cy.dataCy('progress-card-header')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'justify-content', 'space-between')
        .should('have.css', 'align-items', 'center')
        .should('have.css', 'gap', '16px');
    })

    it('renders card content horizontally', () => {
      cy.dataCy('progress-card-content')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'justify-content', 'space-between')
        .should('have.css', 'align-items', 'center');
    })

  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueCardProgress, {
        props: {
          card
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('progress-card-title')
          .should('have.css', 'font-size', '16px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#fff')
          .should('contain', card.title)
          .then(($title) => {
            expect($title.text()).to.equal(card.title);
          });
      });
    })

    it('renders title icon', () => {
      cy.dataCy('progress-card-title')
        .find('.q-icon')
        .should('contain', icon)
        .should('have.color', '#eceff1') // blue-grey-1
        .should('have.css', 'width', '18px')
        .should('have.css', 'height', '18px');
    })

    it('renders timeline', () => {
      cy.dataCy('progress-card-timeline')
        .should('be.visible')
        .should('contain', card.duration.current)
        .should('contain', card.duration.total)
        .should('have.color', '#fff')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400');

      cy.dataCy('progress-card-timeline')
        .find('.progress-bar')
        .should('be.visible')
        .should('have.backgroundColor', '#212121');

      cy.dataCy('progress-card-timeline')
        .find('.progress-indicator')
        .should('be.visible')
        .should('have.backgroundColor', '#fff');
    })

    it('renders percentage', () => {
      cy.dataCy('progress-card-percentage')
        .should('be.visible')
        .should('contain', card.percentage)
        .should('contain', i18n.t('index.cardProgress.current'))

      cy.dataCy('progress-card-percentage')
        .find('progress-circle')
        .should('be.visible')
        .should('have.backgroundColor', '#212121');

      cy.dataCy('progress-card-percentage')
        .find('.progress-indicator')
        .should('be.visible')
        .should('have.backgroundColor', '#fff');
    })

    it('renders stats', () => {
      cy.dataCy('progress-card-stats')
        .should('be.visible')
        .find('.stats-title')
        .first()
        .should('contain', card.stats[0].title)
        .should('have.color', '#fff')
        .should('have.css', 'text-transform', 'uppercase')
        .should('have.css', 'font-size', '12px')

      cy.dataCy('progress-card-stats')
      .should('be.visible')
        .find('.stats-value')
        .first()
        .should('contain', card.stats[0].value)
        .should('have.color', '#fff')
        .should('have.css', 'font-weight', '400')
        .should('have.css', 'font-size', '14px')
    })

    // layout
    it('wraps items in card header', () => {
      cy.dataCy('progress-card-header')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'flex-wrap', 'wrap')
        .should('have.css', 'gap', '16px');
    })

    it('wraps items in card content', () => {
      cy.dataCy('progress-card-content')
        .should('be.visible')
        .should('have.css', 'display', 'flex')
        .should('have.css', 'flex-direction', 'row')
        .should('have.css', 'flex-wrap', 'wrap')
        .should('have.css', 'gap', '16px');
    })

  });
});
