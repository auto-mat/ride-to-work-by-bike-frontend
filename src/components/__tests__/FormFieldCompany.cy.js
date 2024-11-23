import { ref } from 'vue';
import FormFieldCompany from 'components/global/FormFieldCompany.vue';
import { vModelAdapter } from '../../../test/cypress/utils';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import {
  httpSuccessfullStatus,
  interceptOrganizationsApi,
  waitForOrganizationsApi,
} from '../../../test/cypress/support/commonTests';
import { OrganizationType } from '../types/Organization';

const model = ref('');

describe('<FormFieldCompany>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelCompany',
        'labelCompanyShort',
        'messageFieldRequired',
        'messageNoCompany',
      ],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['buttonAddCompany', 'titleAddCompany'],
      'form.company',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['buttonAddCompany'],
      'register.challenge',
      i18n,
    );
    cy.testLanguageStringsInContext(['discard'], 'navigation', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      // intercept api
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.company,
      );
      // reset model value
      model.value = '';
      // mount component
      cy.mount(FormFieldCompany, {
        props: {
          ...vModelAdapter(model),
          organizationType: OrganizationType.company,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders input with label', () => {
      // input wrapper
      cy.dataCy('form-company')
        .find('.q-field__control')
        .should('be.visible')
        .and('have.css', 'border-radius', '8px');
      // input label
      cy.dataCy('form-company')
        .find('label')
        .should('be.visible')
        .and('contain', i18n.global.t('form.labelCompany'));
      // input
      cy.dataCy('form-company').find('input').should('be.visible');
    });

    it('allows user to select option', () => {
      cy.fixture('formFieldCompany').then((formFieldCompany) => {
        cy.fixture('formFieldCompanyNext').then((formFieldCompanyNext) => {
          waitForOrganizationsApi(formFieldCompany, formFieldCompanyNext);
          cy.dataCy('form-company').find('.q-field__append').click();
          // select option
          cy.get('.q-item__label')
            .should('be.visible')
            .and((opts) => {
              expect(
                opts.length,
                formFieldCompany.results.length +
                  formFieldCompanyNext.results.length,
              );
            })
            .first()
            .click();
          cy.get('.q-menu').should('not.exist');
          cy.wrap(model)
            .its('value')
            .should('eq', formFieldCompany.results[0].id);
        });
      });
    });

    it('allows to search through options', () => {
      // search for option
      cy.fixture('formFieldCompany').then((formFieldCompany) => {
        cy.fixture('formFieldCompanyNext').then((formFieldCompanyNext) => {
          waitForOrganizationsApi(formFieldCompany, formFieldCompanyNext);
          cy.dataCy('form-company')
            .find('.q-field__append')
            .type(formFieldCompany.results[1].name);
          // select first option from filtered results
          cy.get('.q-item__label').should('have.length', 1).first().click();
          cy.get('.q-menu').should('not.exist');
          cy.wrap(model)
            .its('value')
            .should('eq', formFieldCompany.results[1].id);
        });
      });
    });

    it('validates company field correctly', () => {
      cy.fixture('formFieldCompany').then((formFieldCompany) => {
        cy.fixture('formFieldCompanyNext').then((formFieldCompanyNext) => {
          waitForOrganizationsApi(formFieldCompany, formFieldCompanyNext);
          cy.dataCy('form-company').find('input').focus();
          cy.focused().blur();
          cy.contains(
            i18n.global.t('form.messageFieldRequired', {
              fieldName: i18n.global.t('form.labelCompanyShort'),
            }),
          ).should('be.visible');
          cy.dataCy('form-company').find('input').click();
          // select option
          cy.get('.q-item__label').first().click();
          cy.focused().blur();
          cy.contains(
            i18n.global.t('form.messageFieldRequired', {
              fieldName: i18n.global.t('form.labelCompanyShort'),
            }),
          ).should('not.exist');
        });
      });
    });

    it('renders input and button in a column layout', () => {
      cy.testElementsSideBySide('col-input', 'col-button');
    });

    it('allows to add a new company', () => {
      cy.fixture('formFieldCompanyCreateRequest').then(
        (formFieldCompanyCreateRequest) => {
          cy.fixture('formFieldCompanyCreate').then(
            (formFieldCompanyCreateResponse) => {
              cy.dataCy('button-add-company').click();
              // dialog
              cy.dataCy('dialog-add-company').should('be.visible');
              cy.dataCy('dialog-add-company')
                .find('h3')
                .should('be.visible')
                .and('have.css', 'font-size', '20px')
                .and('have.css', 'font-weight', '500')
                .and('contain', i18n.global.t('form.company.titleAddCompany'));
              cy.dataCy('dialog-button-cancel')
                .should('be.visible')
                .and('have.text', i18n.global.t('navigation.discard'));
              cy.dataCy('dialog-button-submit')
                .should('be.visible')
                .and(
                  'have.text',
                  i18n.global.t('form.company.buttonAddCompany'),
                );
              // fill form
              cy.dataCy('form-add-company-name')
                .find('input')
                .type(formFieldCompanyCreateRequest.name);
              cy.dataCy('form-add-company-vat-id')
                .find('input')
                .type(formFieldCompanyCreateRequest.vatId);
              // submit form
              cy.dataCy('dialog-button-submit').click();
              // test response
              cy.wait('@createOrganization').then((interception) => {
                expect(interception.request.headers.authorization).to.include(
                  'Bearer',
                );
                expect(interception.response.statusCode).to.equal(
                  httpSuccessfullStatus,
                );
                expect(interception.request.body).to.deep.equal({
                  name: formFieldCompanyCreateRequest.name,
                  vatId: formFieldCompanyCreateRequest.vatId,
                  organization_type:
                    formFieldCompanyCreateRequest.organization_type,
                });
                expect(interception.response.body).to.deep.equal(
                  formFieldCompanyCreateResponse,
                );
              });
              // test selected option
              cy.dataCy('form-company')
                .find('input')
                .invoke('val')
                .should('eq', formFieldCompanyCreateResponse.name);
            },
          );
        },
      );
    });
  });
});

context('mobile', () => {
  beforeEach(() => {
    interceptOrganizationsApi(
      rideToWorkByBikeConfig,
      i18n,
      OrganizationType.company,
    );
    // reset model value
    model.value = '';
    // mount component
    cy.mount(FormFieldCompany, {
      props: {
        ...vModelAdapter(model),
        organizationType: OrganizationType.company,
      },
    });
    cy.viewport('iphone-6');
  });

  it('renders input and button in a stacked layout', () => {
    cy.testElementPercentageWidth(cy.dataCy('col-input'), 100);
    cy.testElementPercentageWidth(cy.dataCy('col-button'), 100);
  });
});
