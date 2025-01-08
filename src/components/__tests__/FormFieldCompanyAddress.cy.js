import { ref } from 'vue';
import { colors } from 'quasar';
import FormFieldCompanyAddress from 'components/form/FormFieldCompanyAddress.vue';
import { i18n } from '../../boot/i18n';
import { vModelAdapter } from 'app/test/cypress/utils';
import { createPinia, setActivePinia } from 'pinia';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { OrganizationType } from 'src/components/types/Organization';
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
        'labelAddressSchool',
        'labelAddressFamily',
        'labelCityChallenge',
        'labelCityChallengeFamily',
        'textSubsidiaryAddress',
        'titleAddAddress',
        'titleAddAddressFamily',
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
      cy.interceptSubsidiaryPostApi(
        rideToWorkByBikeConfig,
        i18n,
        organizationId,
      );
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
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
      // test label when organization type changes to school
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        store.setOrganizationType(OrganizationType.school);
        cy.dataCy('form-company-address-label')
          .should('be.visible')
          .and('have.text', i18n.global.t('form.company.labelAddressSchool'));
      });
      // test label when organization type changes to family
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        store.setOrganizationType(OrganizationType.family);
        cy.dataCy('form-company-address-label')
          .should('be.visible')
          .and('have.text', i18n.global.t('form.company.labelAddressFamily'));
      });
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
              /**
               * Manually load subsidiaries.
               * In the live application, this is handled by `onMounted` hook,
               * or calling `loadSubsidiariesToStore` method in another
               * component.
               */
              store.loadSubsidiariesToStore(null);
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

    it('renders dialog for adding a new address (company)', () => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        // set organization ID in store
        cy.wrap(store.setOrganizationId(organizationId));
        cy.wrap(store.getOrganizationId).should('eq', organizationId);
        cy.wrap(store.setOrganizationType(OrganizationType.company));
        cy.wrap(store.getOrganizationType).should(
          'eq',
          OrganizationType.company,
        );
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

    it('renders dialog for adding a new address (school)', () => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        // set organization ID in store
        cy.wrap(store.setOrganizationId(organizationId));
        cy.wrap(store.getOrganizationId).should('eq', organizationId);
        cy.wrap(store.setOrganizationType(OrganizationType.school));
        cy.wrap(store.getOrganizationType).should(
          'eq',
          OrganizationType.school,
        );
        cy.dataCy('button-add-address').click();
        cy.dataCy('dialog-add-address').should('be.visible');
        // title
        cy.dataCy('dialog-add-address')
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('contain', i18n.global.t('form.company.titleAddAddress'));
      });
    });

    it('renders dialog for adding a new address (family)', () => {
      cy.wrap(useRegisterChallengeStore()).then((store) => {
        // set organization ID in store
        cy.wrap(store.setOrganizationId(organizationId));
        cy.wrap(store.getOrganizationId).should('eq', organizationId);
        cy.wrap(store.setOrganizationType(OrganizationType.family));
        cy.wrap(store.getOrganizationType).should(
          'eq',
          OrganizationType.family,
        );
        cy.dataCy('button-add-address').click();
        cy.dataCy('dialog-add-address').should('be.visible');
        // title
        cy.dataCy('dialog-add-address')
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .and('contain', i18n.global.t('form.company.titleAddAddressFamily'));
      });
    });

    it('allows user to create a new subsidiary', () => {
      cy.fixture('apiPostSubsidiaryRequest').then((subsidiaryRequest) => {
        cy.fixture('apiPostSubsidiaryResponse').then((subsidiaryResponse) => {
          cy.wrap(useRegisterChallengeStore()).then((store) => {
            // set organization ID in store
            store.setOrganizationId(organizationId);
            cy.wrap(store.getOrganizationId).should('eq', organizationId);
            // open dialog
            cy.dataCy('button-add-address').click();
            cy.dataCy('dialog-add-address').should('be.visible');
            // fill the form
            cy.dataCy('form-add-subsidiary').within(() => {
              cy.dataCy('form-add-subsidiary-street').type(
                subsidiaryRequest.address.street,
              );
              cy.dataCy('form-add-subsidiary-house-number').type(
                subsidiaryRequest.address.street_number,
              );
              cy.dataCy('form-add-subsidiary-city').type(
                subsidiaryRequest.address.city,
              );
              cy.dataCy('form-add-subsidiary-zip').type(
                subsidiaryRequest.address.psc,
              );
              cy.dataCy('form-add-subsidiary-department').type(
                subsidiaryRequest.address.recipient,
              );
              // open city challenge dropdown
              cy.dataCy('form-add-subsidiary-city-challenge').click();
            });
            // select city challenge (outside the form)
            cy.fixture('apiGetCitiesResponse').then((citiesResponse) => {
              cy.get('.q-menu').within(() => {
                cy.contains(citiesResponse.results[0].name)
                  .should('be.visible')
                  .click();
              });
            });
            // submit form
            cy.dataCy('dialog-button-submit').click();
            // wait for API response
            cy.waitForSubsidiaryPostApi(subsidiaryResponse);
            // verify model was updated
            cy.wrap(model).its('value').should('eq', subsidiaryResponse.id);
            // verify dialog was closed
            cy.dataCy('dialog-add-address').should('not.exist');
          });
        });
      });
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
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
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
