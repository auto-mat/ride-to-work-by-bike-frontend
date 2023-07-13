import VueNewsletterItem from 'components/VueNewsletterItem.vue';
import { i18n } from '../../boot/i18n';

const icon = 'people';
const title = i18n.global.t('index.newsletterFeature.aboutEvents');
const url = '#';

describe('<VueNewsletterItem>', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueNewsletterItem, {
        props: {
          item: {
            title,
            icon,
            url,
            following: true,
          },
        },
      });
      cy.viewport('macbook-16');
    });

    it('has display flex', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item')
          .should('be.visible')
          .should('have.css', 'display', 'flex')
          .should('have.css', 'flex-wrap', 'wrap')
          .should('have.css', 'gap', '8px')
          .should('have.css', 'align-items', 'center');
      });
    });

    it('aligns content to the sides', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item')
          .should('have.css', 'justify-content', 'space-between');
      })
    })

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-title')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#212121')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders icon', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-icon')
          .should('be.visible')
          .should('have.css', 'width', '32px')
          .should('have.css', 'height', '32px')
          .should('have.color', '#607d8b')
          .should('contain', icon);
      });
    });

    it('renders button with icon', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-button')
          .should('be.visible')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '500')
          .should('have.css', 'text-transform', 'uppercase')
          .should('have.css', 'border-radius', '28px')
          .should('have.css', 'width', '200px')
          .should('have.color', '#212121')
          .should(
            'contain',
            i18n.global.t('index.newsletterFeature.following')
          );

        cy.dataCy('newsletter-item-button')
          .find('.q-icon')
          .should('be.visible')
          .should('have.css', 'width', '18px')
          .should('have.css', 'height', '18px')
          .should('have.color', '#212121')
          .should('contain', 'check');
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueNewsletterItem, {
        props: {
          item: {
            title,
            icon,
            url,
            following: true,
          },
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-title')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#212121')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders icon', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-icon')
          .should('be.visible')
          .should('have.css', 'width', '32px')
          .should('have.css', 'height', '32px')
          .should('have.color', '#607d8b')
          .should('contain', icon);
      });
    });

    it('renders button with icon', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-button')
          .should('be.visible')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '500')
          .should('have.css', 'text-transform', 'uppercase')
          .should('have.css', 'border-radius', '28px')
          .should('have.css', 'width', '200px')
          .should('have.color', '#212121')
          .should(
            'contain',
            i18n.global.t('index.newsletterFeature.following')
          );

        cy.dataCy('newsletter-item-button')
          .find('.q-icon')
          .should('be.visible')
          .should('have.css', 'width', '18px')
          .should('have.css', 'height', '18px')
          .should('have.color', '#212121')
          .should('contain', 'check');
      });
    });

    it('aligns content to the right', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item')
          .should('have.css', 'justify-content', 'flex-end');
      })
    })

    it('does not wrap icon and title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-content')
          .should('have.css', 'flex-wrap', 'nowrap');
      })
    })
  });

  context('not following', () => {
    beforeEach(() => {
      cy.mount(VueNewsletterItem, {
        props: {
          item: {
            title,
            icon,
            url,
            following: false,
          },
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders bold title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-title')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '700')
          .should('have.color', '#212121')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders black button', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-item-button')
          .should('be.visible')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '500')
          .should('have.css', 'text-transform', 'uppercase')
          .should('have.color', '#ffffff')
          .should('have.backgroundColor', '#212121')
          .should('contain', i18n.global.t('index.newsletterFeature.follow'));

        cy.dataCy('newsletter-item-button')
          .find('.q-icon')
          .should('not.be.visible');
      });
    });
  });
});
