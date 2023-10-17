import UserSelect from '../UserSelect.vue';
import { user } from 'src/mocks/layout';
import { i18n } from '../../boot/i18n';

describe('<UserSelect>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(UserSelect, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders select with default value', () => {
      cy.dataCy('user-select-input')
        .should('be.visible')
        .should('have.css', 'height', '56px')
        .should('contain', user.label);
    });

    it('renders rounded avatar', () => {
      cy.dataCy('avatar')
        .should('be.visible')
        .should('have.css', 'border-radius', '50%')
        .find('img')
        .should('be.visible')
        .then(($img) => {
          cy.testImageHeight($img);
          expect($img.attr('src')).to.equal(user.image.src);
        });

      cy.dataCy('avatar')
        .find('.q-img')
        .should('be.visible')
        .then(($img) => {
          expect($img.attr('aria-label')).to.equal(user.image.alt);
        });
    });

    it('shows dropdown on click', () => {
      cy.dataCy('user-select-input').click();

      cy.get('.q-item__label').should('be.visible').should('have.length', 6);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(UserSelect, {
        props: {
          variant: 'mobile',
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders select with default value', () => {
      cy.dataCy('user-select-input')
        .should('be.visible')
        .should('have.css', 'width', '32px');
    });

    it('renders rounded avatar with alt text', () => {
      cy.dataCy('avatar')
        .should('be.visible')
        .should('have.css', 'border-radius', '50%')
        .find('img')
        .should('be.visible')
        .then(($img) => {
          cy.testImageHeight($img);
          expect($img.attr('src')).to.equal(user.image.src);
        });

      cy.dataCy('avatar')
        .find('.q-img')
        .should('be.visible')
        .then(($img) => {
          expect($img.attr('aria-label')).to.equal(user.image.alt);
        });
    });

    it('shows dropdown on click', () => {
      cy.dataCy('user-select-input').click();

      cy.get('.q-item__label').should('be.visible').should('have.length', 6);
    });
  });
});
