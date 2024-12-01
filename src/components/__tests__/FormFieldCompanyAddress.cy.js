import { ref } from 'vue';
import { colors } from 'quasar';
import FormFieldCompanyAddress from 'components/form/FormFieldCompanyAddress.vue';
import { i18n } from '../../boot/i18n';
import { vModelAdapter } from 'app/test/cypress/utils';
import { createPinia, setActivePinia } from 'pinia';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// variables
const model = ref(null);
const organizationId = 580;

describe('<FormFieldCompanyAddress>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['messageNoResult', 'labelAddress'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'buttonAddAddress',
        'buttonAddSubsidiary',
        'hintAddress',
        'labelAddress',
        'textSubsidiaryAddress',
        'titleAddAddress',
      ],
      'form.company',
      i18n,
    );
    cy.testLanguageStringsInContext(['discard'], 'navigation', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.interceptSubsidiariesGetApi(
        rideToWorkByBikeConfig,
        i18n,
        organizationId,
      );
      model.value = null;
      cy.mount(FormFieldCompanyAddress, {
        props: {
          ...vModelAdapter(model),
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders component', () => {
      cy.dataCy('form-company-address').should('be.visible');
      // label
      cy.dataCy('form-company-address-label')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '700')
        .and('have.color', grey10)
        .and('have.text', i18n.global.t('form.company.labelAddress'));
      // input
      cy.dataCy('form-company-address').find('.q-select').should('be.visible');
      // hint
      cy.dataCy('form-company-address')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.hintAddress'));
      cy.dataCy('button-add-address').should('be.visible');
    });

    it('validates address field correctly', () => {
      cy.dataCy('form-company-address').find('input').focus();
      cy.dataCy('form-company-address').find('input').blur();
      cy.contains(
        i18n.global.t('form.messageFieldRequired', {
          fieldName: i18n.global.t('form.labelAddress'),
        }),
      ).should('be.visible');
    });

    it('allows user to select option', () => {
      cy.fixture('apiGetSubsidiariesResponse').then((subsidiariesResponse) => {
        cy.fixture('apiGetSubsidiariesResponseNext').then(
          (subsidiariesResponseNext) => {
            cy.wrap(useRegisterChallengeStore()).then((store) => {
              // set organization ID in store
              store.setOrganizationId(organizationId);
              cy.wrap(store.getOrganizationId).should('eq', organizationId);
              // wait for subsidiaries API
              cy.waitForSubsidiariesApi(
                subsidiariesResponse,
                subsidiariesResponseNext,
              );
              cy.dataCy('form-company-address').find('.q-select').click();
              // select option
              cy.get('.q-menu')
                .should('be.visible')
                .within(() => {
                  cy.get('.q-item').should(
                    'have.length',
                    subsidiariesResponse.results.length +
                      subsidiariesResponseNext.results.length,
                  );
                  cy.get('.q-item').first().click();
                });
              cy.wrap(model)
                .its('value')
                .should('eq', subsidiariesResponse.results[0].id);
            });
          },
        );
      });
    });

    it('renders dialog for adding a new address', () => {
      cy.dataCy('button-add-address').click();
      cy.dataCy('dialog-add-address').should('be.visible');
      // title
      cy.dataCy('dialog-add-address')
        .find('h3')
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('contain', i18n.global.t('form.company.titleAddAddress'));
      // message
      cy.dataCy('add-subsidiary-text')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.textSubsidiaryAddress'));
      // form
      cy.dataCy('form-add-subsidiary').should('be.visible');
      // buttons
      cy.dataCy('dialog-button-cancel')
        .should('be.visible')
        .and('have.text', i18n.global.t('navigation.discard'));
      cy.dataCy('dialog-button-submit')
        .should('be.visible')
        .and('have.text', i18n.global.t('form.company.buttonAddSubsidiary'));
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.interceptSubsidiariesGetApi(
        rideToWorkByBikeConfig,
        i18n,
        organizationId,
      );
      model.value = null;
      cy.mount(FormFieldCompanyAddress, {
        props: {
          ...vModelAdapter(model),
        },
      });
      cy.viewport('iphone-6');
    });

    it('renders input and button in a stacked layout', () => {
      cy.testElementPercentageWidth(cy.dataCy('col-input'), 100);
      cy.testElementPercentageWidth(cy.dataCy('col-button'), 100);
    });
  });
});
