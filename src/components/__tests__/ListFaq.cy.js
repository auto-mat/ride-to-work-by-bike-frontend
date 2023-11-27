import ListFaq from '../global/ListFaq.vue';
import { i18n } from '../../boot/i18n';

describe('<ListFaq>', () => {
  context('participant', () => {
    const title = i18n.global.t('index.help.titleParticipants');

    beforeEach(() => {
      cy.mount(ListFaq, {
        props: {
          title,
          variant: 'participant',
        },
      });
    });

    it('renders title with correct styling', () => {
      cy.dataCy('list-faq-title')
        .should('be.visible')
        .and('contain', title)
        .and('have.css', 'font-size', '24px')
        .and('have.css', 'font-weight', '700');
    });

    it('renders participant FAQ with working accordion', () => {
      cy.dataCy('list-faq-list')
        .find('.q-item__label')
        .first()
        .should('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400');
      cy.dataCy('list-faq-list')
        .find('.q-card')
        .first()
        .should('not.be.visible');
      cy.dataCy('list-faq-list')
        .find('.q-item')
        .first()
        .should('be.visible')
        .click();
      cy.dataCy('list-faq-list')
        .find('.q-card')
        .first()
        .should('be.visible')
        .then(($element) => {
          expect($element.height()).to.be.greaterThan(0);
        });
    });
  });

  context('coordinator', () => {
    const title = i18n.global.t('index.help.titleCoordinators');
    beforeEach(() => {
      cy.mount(ListFaq, {
        props: {
          title,
          variant: 'coordinator',
        },
      });
    });

    it('renders coordinator FAQ section with working accordion', () => {
      cy.dataCy('list-faq-list')
        .find('.q-item__label')
        .first()
        .should('have.css', 'font-size', '14px')
        .and('have.css', 'font-weight', '400');
      cy.dataCy('list-faq-list')
        .find('.q-card')
        .first()
        .should('not.be.visible');
      cy.dataCy('list-faq-list')
        .find('.q-item')
        .first()
        .should('be.visible')
        .click();
      cy.dataCy('list-faq-list')
        .find('.q-card')
        .first()
        .should('be.visible')
        .then(($element) => {
          expect($element.height()).to.be.greaterThan(0);
        });
    });
  });
});
