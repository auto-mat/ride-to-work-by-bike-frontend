import FormPersonalDetails from 'components/form/FormPersonalDetails.vue';
import { i18n } from '../../boot/i18n';

describe('<FormPersonalDetails>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelNewsletterAll',
        'labelNewsletterChallenges',
        'labelNewsletterEvents',
        'labelNewsletterMobility',
        'titleGender',
        'titleNewsletter',
      ],
      'form.personalDetails',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormPersonalDetails, {
        props: {
          formValues: {
            firstName: 'John',
            lastName: 'Doe',
            nickname: 'John Doe',
            gender: 'male',
            newsletter: ['all'],
            terms: true,
          },
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders form field first name', () => {
      cy.dataCy('form-personal-details-first-name').should('be.visible');
    });

    it('renders form field last name', () => {
      cy.dataCy('form-personal-details-last-name').should('be.visible');
    });

    it('renders form field nickname', () => {
      cy.dataCy('form-personal-details-nickname').should('be.visible');
    });

    it('renders radio select gender', () => {
      cy.dataCy('form-personal-details-gender').should('be.visible');
    });

    it('renders checkbox select newsletter', () => {
      cy.dataCy('form-personal-details-newsletter').should('be.visible');
    });

    it('renders checkbox terms', () => {
      cy.dataCy('form-personal-details-terms').should('be.visible');
    });
  });
});
