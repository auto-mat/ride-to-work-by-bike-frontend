import { ref } from 'vue';
import { colors } from 'quasar';
import FormFieldSelectTable from 'components/form/FormFieldSelectTable.vue';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { i18n } from '../../boot/i18n';
import { useApiGetOrganizations } from 'src/composables/useApiGetOrganizations';
import { createPinia, setActivePinia } from 'pinia';
import {
  OrganizationLevel,
  OrganizationType,
} from 'src/components/types/Organization';
import { interceptOrganizationsApi } from '../../../test/cypress/support/commonTests';
import { vModelAdapter } from 'app/test/cypress/utils';
import { useChallengeStore } from 'src/stores/challenge';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';
import { useApiGetTeams } from 'src/composables/useApiGetTeams';

// variables
const { contactEmail } = rideToWorkByBikeConfig;
const model = ref(null);
const setModelValue = (value) => {
  model.value = value;
};

// colors
const { getPaletteColor } = colors;
const secondary = getPaletteColor('secondary');
const grey2 = getPaletteColor('grey-2');

const formAddSubsidiaryZipMask = '___ __';

describe('<FormFieldSelectTable>', () => {
  let options;
  let organizationId;
  let optionsTeams;
  let subsidiaryId;

  before(() => {
    setActivePinia(createPinia());
    // set value for prop `options` (fetched from API in wrapper component)
    cy.fixture('formFieldCompany').then((formFieldCompanyResponse) => {
      cy.fixture('formFieldCompanyNext').then(
        (formFieldCompanyNextResponse) => {
          // get array of organizations
          const organizations = [
            ...formFieldCompanyResponse.results,
            ...formFieldCompanyNextResponse.results,
          ];
          // map organizations to options
          const { mapOrganizationToOption } = useApiGetOrganizations();
          options = organizations.map(mapOrganizationToOption);
        },
      );
    });
    // set common organizationId from fixture
    cy.fixture('formFieldCompanyCreate').then(
      (formFieldCompanyCreateResponse) => {
        organizationId = formFieldCompanyCreateResponse.id;
      },
    );
    cy.fixture('apiGetTeamsResponse').then((apiGetTeamsResponse) => {
      cy.fixture('apiGetTeamsResponseNext').then((apiGetTeamsResponseNext) => {
        cy.fixture('apiGetThisCampaign').then((apiGetThisCampaign) => {
          console.log(apiGetThisCampaign);
          const challengeStore = useChallengeStore();
          challengeStore.maxTeamMembers =
            apiGetThisCampaign['results'][0]['max_team_members'];
          const teams = [
            ...apiGetTeamsResponse.results,
            ...apiGetTeamsResponseNext.results,
          ];
          // map teams to options
          const { mapTeamToOption } = useApiGetTeams();
          optionsTeams = teams.map(mapTeamToOption);
        });
      });
    });
    // set common organizationId from fixture
    cy.fixture('formFieldCompanyCreate').then(
      (formFieldCompanyCreateResponse) => {
        organizationId = formFieldCompanyCreateResponse.id;
      },
    );
    // set common subsidiaryId from fixture
    cy.fixture('formOrganizationOptions').then((formOrganizationOptions) => {
      subsidiaryId = formOrganizationOptions[0].subsidiaries[0].id;
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonAddCompany',
        'buttonAddFamily',
        'buttonAddSchool',
        'hintCityChallenge',
        'hintDepartment',
        'labelCityChallenge',
        'labelCompany',
        'labelDepartment',
        'labelFamily',
        'labelSchool',
        'textCompanyPermission',
        'textCoordinator',
        'textSubsidiaryAddress',
        'textUserExperience',
        'titleAddCompany',
        'titleAddFamily',
        'titleAddSchool',
        'titleSubsidiaryAddress',
      ],
      'form.company',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'buttonAddTeam',
        'labelTeam',
        'labelTeamName',
        'titleAddTeam',
        'textTeam',
      ],
      'form.team',
      i18n,
    );
    cy.testLanguageStringsInContext(
      ['buttonAddSubsidiary', 'labelSubsidiary', 'titleAddSubsidiary'],
      'form.subsidiary',
      i18n,
    );
    cy.testLanguageStringsInContext(
      [
        'labelCity',
        'labelHouseNumber',
        'labelStreet',
        'labelZip',
        'labelSpinnerProgressBar',
      ],
      'form',
      i18n,
    );
  });

  context('organization company', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      // intercept both POST and GET requests for organizations
      interceptOrganizationsApi(
        rideToWorkByBikeConfig,
        i18n,
        OrganizationType.company,
      );
      cy.interceptSubsidiaryPostApi(
        rideToWorkByBikeConfig,
        i18n,
        organizationId,
      );
      cy.mount(FormFieldSelectTable, {
        props: {
          ...vModelAdapter(model),
          options: options,
          organizationLevel: OrganizationLevel.organization,
          organizationType: OrganizationType.company,
        },
      });
      cy.viewport('macbook-16');
      cy.wrap(setModelValue(null));
    });

    it('renders necessary elements', () => {
      // input label
      cy.dataCy('form-select-table-query')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.labelCompany'));
      // input
      cy.dataCy('form-select-table-search').find('input').should('be.visible');
      cy.dataCy('form-select-table-search')
        .find('i')
        .invoke('height')
        .should('eq', 24);
      cy.dataCy('form-select-table-search')
        .find('i')
        .invoke('width')
        .should('eq', 24);
      // options
      cy.dataCy('form-select-table-option').should('be.visible');
      // add new button
      cy.dataCy('form-select-table-button').should('be.visible');
      cy.dataCy('button-add-option').should('be.visible');
      cy.dataCy('button-add-option')
        .find('i')
        .invoke('height')
        .should('be.gt', 23);
      cy.dataCy('button-add-option')
        .find('i')
        .invoke('width')
        .should('be.gt', 23);
      // note under the select table
      cy.dataCy('form-select-table-user-note')
        .should('be.visible')
        .and('have.css', 'font-size', '12px')
        .and('have.css', 'font-weight', '400')
        .then(($el) => {
          const textContent = $el.text();
          cy.stripHtmlTags(
            i18n.global.t('form.company.textUserExperience', {
              email: contactEmail,
            }),
          ).then((text) => {
            expect(textContent).to.contain(text);
          });
        });
      // email contact to Auto*Mat in the note
      cy.dataCy('form-select-table-user-note')
        .find('a')
        .should('have.attr', 'href', 'mailto:' + contactEmail);
    });

    it('allows to search through options', () => {
      // search for option
      cy.dataCy('form-select-table-search').find('input').focus();
      cy.dataCy('form-select-table-search')
        .find('input')
        .type(options[0].label.substring(0, 3));
      // show only one option
      cy.dataCy('form-select-table-options')
        .find('.q-radio__label')
        .should('have.length', 1);
      cy.dataCy('form-select-table-search').find('input').clear();
      cy.dataCy('form-select-table-search').find('input').blur();
      cy.dataCy('spinner-progress-bar').should('not.exist');
      cy.dataCy('form-select-table-options')
        .find('.q-radio__label')
        .should('have.length', options.length);
    });

    it('validates company field correctly', () => {
      cy.dataCy('form-select-table-search').find('input').focus();
      cy.dataCy('form-select-table-search').find('input').blur();
      cy.dataCy('form-select-table-field')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageOptionRequired'));
    });

    it('renders dialog when for adding a new company', () => {
      cy.dataCy('button-add-option').click();
      cy.dataCy('dialog-add-option').should('be.visible');
      cy.dataCy('dialog-add-option')
        .find('h3')
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('contain', i18n.global.t('form.company.titleAddCompany'));
      // scroll to bottom
      cy.dataCy('dialog-body').scrollTo('bottom', { ensureScrollable: false });
      // action buttons are visible
      cy.dataCy('dialog-button-cancel')
        .should('be.visible')
        .and('have.text', i18n.global.t('navigation.discard'));
      cy.dataCy('dialog-button-submit')
        .should('be.visible')
        .and('have.text', i18n.global.t('form.company.buttonAddCompany'));
      // submit empty
      cy.dataCy('dialog-button-submit').click();
      cy.dataCy('dialog-add-option').should('be.visible');
      // scroll to top
      cy.dataCy('dialog-body').scrollTo('top', { ensureScrollable: false });
      // fill in form
      cy.fixture('formFieldCompanyCreateRequest.json').then(
        (formFieldCompanyCreateRequest) => {
          // company details
          cy.dataCy('form-add-company-name')
            .find('input')
            .type(formFieldCompanyCreateRequest.name);
          cy.dataCy('form-add-company-vat-id')
            .find('input')
            .type(formFieldCompanyCreateRequest.ico);
          cy.dataCy('form-orgAddress-street')
            .find('input')
            .type(formFieldCompanyCreateRequest.address.street);
          cy.dataCy('form-orgAddress-house-number')
            .find('input')
            .type(formFieldCompanyCreateRequest.address.houseNumber);
          cy.dataCy('form-orgAddress-city')
            .find('input')
            .type(formFieldCompanyCreateRequest.address.city);
          cy.dataCy('form-orgAddress-zip')
            .find('input')
            .type(formFieldCompanyCreateRequest.address.zip);
          // subsidiary details
          cy.dataCy('form-add-subsidiary-street').find('input').type('Slezská');
          cy.dataCy('form-add-subsidiary-house-number')
            .find('input')
            .type('2033/11');
          cy.dataCy('form-add-subsidiary-city').find('input').type('Praha');
          cy.dataCy('form-add-subsidiary-zip').find('input').type('120 00');
          cy.dataCy('form-add-subsidiary-city-challenge').click();
          cy.get('.q-menu')
            .should('be.visible')
            .find('.q-item')
            .first()
            .click();
          // submit
          cy.dataCy('dialog-button-submit').click();
          cy.dataCy('dialog-add-option').should('not.exist');
        },
      );
    });

    it('allows to add a new organization', () => {
      cy.fixture('apiPostSubsidiaryRequest').then(
        (apiPostSubsidiaryRequest) => {
          cy.fixture('formFieldCompanyCreateRequest').then(
            (formFieldCompanyCreateRequest) => {
              // open add company dialog
              cy.dataCy('button-add-option').click();
              // verify that dialog is visible
              cy.dataCy('dialog-add-option').should('be.visible');
              cy.dataCy('dialog-add-option')
                .find('h3')
                .should('be.visible')
                .and('contain', i18n.global.t('form.company.titleAddCompany'));
              // fill in the form
              cy.fillOrganizationSubsidiaryForm(
                formFieldCompanyCreateRequest,
                apiPostSubsidiaryRequest,
              );
              // submit the form
              cy.dataCy('dialog-button-submit').click();
              // wait for API call
              cy.waitForOrganizationPostApi();
              // verify that dialog is closed
              cy.dataCy('dialog-add-option').should('not.exist');
              // test emitted events
              cy.fixture('formFieldCompanyCreate').then(
                (formFieldCompanyCreateResponse) => {
                  // test that create:option event was emitted
                  cy.wrap(Cypress.vueWrapper.emitted('create:option')).should(
                    'have.length',
                    1,
                  );
                  // test that event payload is correct
                  cy.wrap(
                    Cypress.vueWrapper.emitted('create:option')[0][0],
                  ).should('deep.equal', formFieldCompanyCreateResponse);
                  // test that model value was updated
                  cy.wrap(model)
                    .its('value')
                    .should('eq', formFieldCompanyCreateResponse.id);
                },
              );
              // open dialog again
              cy.dataCy('button-add-option').click();
              cy.dataCy('dialog-add-option').should('be.visible');
              // verify that dialog form was reset
              cy.dataCy('form-add-company-name')
                .find('input')
                .should('have.value', '');
              cy.dataCy('form-add-company-vat-id')
                .find('input')
                .should('have.value', '');
              cy.dataCy('form-add-subsidiary-street')
                .find('input')
                .should('have.value', '');
              cy.dataCy('form-add-subsidiary-house-number')
                .find('input')
                .should('have.value', '');
              cy.dataCy('form-add-subsidiary-city')
                .find('input')
                .should('have.value', '');
              cy.dataCy('form-add-subsidiary-zip')
                .find('input')
                .should('have.value', formAddSubsidiaryZipMask);
            },
          );
        },
      );
    });
  });

  context('organization company selected', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormFieldSelectTable, {
        props: {
          options: options,
          organizationLevel: OrganizationLevel.organization,
          organizationType: OrganizationType.company,
          modelValue: options[0].value,
        },
      });
      cy.viewport('macbook-16');
    });

    it('shows selected option', () => {
      cy.dataCy('form-select-table-options')
        .find('.q-radio__inner')
        .first()
        .should('have.class', 'text-primary');
    });
  });

  context('organization school', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormFieldSelectTable, {
        props: {
          options: options,
          organizationLevel: OrganizationLevel.organization,
          organizationType: OrganizationType.school,
        },
      });
      cy.viewport('macbook-16');
    });

    it('shows correct labels', () => {
      // label
      cy.dataCy('form-select-table-query')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.labelSchool'));
      // button add new
      cy.dataCy('form-select-table-button')
        .should('be.visible')
        .and('contain', i18n.global.t('register.challenge.buttonAddCompany'));
      cy.dataCy('form-select-table-button').click();
      // title dialog
      cy.dataCy('dialog-add-option')
        .find('h3')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.titleAddSchool'));
      // scroll to bottom
      cy.dataCy('dialog-body').scrollTo('bottom', { ensureScrollable: false });
      // button dialog
      cy.dataCy('dialog-button-submit')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.buttonAddSchool'));
    });
  });

  context('organization family', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormFieldSelectTable, {
        props: {
          options: options,
          organizationLevel: OrganizationLevel.organization,
          organizationType: OrganizationType.family,
        },
      });
      cy.viewport('macbook-16');
    });

    it('shows correct labels', () => {
      // label
      cy.dataCy('form-select-table-query')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.labelFamily'));
      // button add new
      cy.dataCy('form-select-table-button')
        .should('be.visible')
        .and('contain', i18n.global.t('register.challenge.buttonAddCompany'));
      cy.dataCy('form-select-table-button').click();
      // title dialog
      cy.dataCy('dialog-add-option')
        .find('h3')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.titleAddFamily'));
      // scroll to bottom
      cy.dataCy('dialog-body').scrollTo('bottom', { ensureScrollable: false });
      // button dialog
      cy.dataCy('dialog-button-submit')
        .should('be.visible')
        .and('contain', i18n.global.t('form.company.buttonAddFamily'));
    });
  });

  context('team', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      cy.interceptTeamPostApi(rideToWorkByBikeConfig, i18n, subsidiaryId);
      cy.mount(FormFieldSelectTable, {
        props: {
          ...vModelAdapter(model),
          options: optionsTeams,
          organizationLevel: OrganizationLevel.team,
        },
      });
      cy.wrap(setModelValue(null));
    });

    it('renders team members count', () => {
      cy.dataCy('form-select-table-option')
        // team view has correct number of options
        .find('.q-radio__label')
        .should('have.length', optionsTeams.length)
        .each((el, index) => {
          // team view shows correct number of members
          cy.wrap(el)
            .dataCy('member-count')
            .should('contain', optionsTeams[index].members.length);
          // team view shows correct max number of members
          cy.wrap(el)
            .dataCy('member-max')
            .should('contain', optionsTeams[index].maxMembers);
          // team view shows icons
          cy.wrap(el)
            .dataCy('member-icons')
            .within(() => {
              // number of member icons = max number of members
              cy.dataCy('member-icon')
                .should('have.length', optionsTeams[index].maxMembers)
                .each((icon, iconIndex) => {
                  // icons indicate number of members
                  if (iconIndex < optionsTeams[index].members.length) {
                    cy.wrap(icon).should('have.color', secondary);
                  } else {
                    cy.wrap(icon).should('have.color', grey2);
                  }
                });
            });
        });
    });

    it('renders HTML elements', () => {
      // input label
      cy.dataCy('form-select-table-query')
        .should('be.visible')
        .and('contain', i18n.global.t('form.team.labelTeam'));
      // input
      cy.dataCy('form-select-table-search').find('input').should('be.visible');
      cy.dataCy('form-select-table-search')
        .find('i')
        .invoke('height')
        .should('eq', 24);
      cy.dataCy('form-select-table-search')
        .find('i')
        .invoke('width')
        .should('eq', 24);
      // options
      cy.dataCy('form-select-table-option').should('be.visible');
      // add new button
      cy.dataCy('form-select-table-button').should('be.visible');
      cy.dataCy('button-add-option').should('be.visible');
      cy.dataCy('button-add-option')
        .find('i')
        .invoke('height')
        .should('be.gt', 23);
      cy.dataCy('button-add-option')
        .find('i')
        .invoke('width')
        .should('be.gt', 23);
    });

    it('allows to search through options', () => {
      // search for option
      cy.dataCy('form-select-table-search').find('input').focus();
      cy.dataCy('form-select-table-search')
        .find('input')
        .type(optionsTeams[0].label.substring(0, 3));
      // show only one option
      cy.dataCy('form-select-table-option')
        .find('.q-radio__label')
        .should('have.length', 1);
      cy.dataCy('form-select-table-search').find('input').clear();
      cy.dataCy('form-select-table-search').find('input').blur();
      cy.dataCy('spinner-progress-bar').should('not.exist');
      cy.dataCy('form-select-table-options')
        .find('.q-radio__label')
        .should('have.length', optionsTeams.length);
    });

    it('validates company field correctly', () => {
      cy.dataCy('form-select-table-search').find('input').focus();
      cy.dataCy('form-select-table-search').find('input').blur();
      cy.dataCy('form-select-table-field')
        .find('.q-field__messages')
        .should('be.visible')
        .and('contain', i18n.global.t('form.messageOptionRequired'));
    });

    it('renders dialog when for adding a new team', () => {
      cy.fixture('apiPostTeamRequest').then((teamRequest) => {
        cy.wrap(useRegisterChallengeStore()).then((store) => {
          store.setSubsidiaryId(subsidiaryId);

          cy.dataCy('button-add-option').click();
          cy.dataCy('dialog-add-option').should('be.visible');
          cy.dataCy('dialog-add-option')
            .find('h3')
            .should('be.visible')
            .and('have.css', 'font-size', '20px')
            .and('have.css', 'font-weight', '500')
            .and('contain', i18n.global.t('form.team.titleAddTeam'));
          // scroll to bottom
          cy.dataCy('dialog-body').scrollTo('bottom', {
            ensureScrollable: false,
          });
          // action buttons are visible
          cy.dataCy('dialog-button-cancel')
            .should('be.visible')
            .and('have.text', i18n.global.t('navigation.discard'));
          cy.dataCy('dialog-button-submit')
            .should('be.visible')
            .and('have.text', i18n.global.t('form.team.buttonAddTeam'));
          // submit empty
          cy.dataCy('dialog-button-submit').click();
          cy.dataCy('dialog-add-option').should('be.visible');
          // scroll to top
          cy.dataCy('dialog-body').scrollTo('top', {
            ensureScrollable: false,
          });
          // fill in form
          cy.dataCy('form-add-team-name').find('input').type(teamRequest.name);
          // submit
          cy.dataCy('dialog-button-submit').click();
          // wait for POST API call
          cy.waitForTeamPostApi();
          // check if dialog is closed
          cy.dataCy('dialog-add-option').should('not.exist');
          // check if event is emitted
          cy.fixture('apiPostTeamResponse').then((teamResponse) => {
            // test emitted event
            cy.wrap(Cypress.vueWrapper.emitted('create:option')).should(
              'have.length',
              1,
            );
            // test emitted payload
            cy.wrap(Cypress.vueWrapper.emitted('create:option')[0][0]).should(
              'deep.equal',
              teamResponse,
            );
          });
        });
      });
    });

    it('renders team members count', () => {
      cy.dataCy('form-select-table-option')
        // team view has correct number of options
        .find('.q-radio__label')
        .should('have.length', optionsTeams.length)
        .each((el, index) => {
          // team view shows correct number of members
          cy.wrap(el)
            .dataCy('member-count')
            .should('contain', optionsTeams[index].members.length);
          // team view shows correct max number of members
          cy.wrap(el)
            .dataCy('member-max')
            .should('contain', optionsTeams[index].maxMembers);
          // team view shows icons
          cy.wrap(el)
            .dataCy('member-icons')
            .within(() => {
              // number of member icons = max number of members
              cy.dataCy('member-icon')
                .should('have.length', optionsTeams[index].maxMembers)
                .each((icon, iconIndex) => {
                  // icons indicate number of members
                  if (iconIndex < optionsTeams[index].members.length) {
                    cy.wrap(icon).should('have.color', secondary);
                  } else {
                    cy.wrap(icon).should('have.color', grey2);
                  }
                });
            });
        });
    });
  });

  context('subsidiary', () => {
    beforeEach(() => {
      cy.mount(FormFieldSelectTable, {
        props: {
          options: options,
          organizationLevel: OrganizationLevel.subsidiary,
        },
      });
      cy.viewport('macbook-16');
    });

    it('renders HTML elements', () => {
      // input label
      cy.dataCy('form-select-table-query')
        .should('be.visible')
        .and('contain', i18n.global.t('form.subsidiary.labelSubsidiary'));
      // add new button
      cy.dataCy('button-add-option')
        .should('be.visible')
        .and('contain', i18n.global.t('form.subsidiary.buttonAddSubsidiary'));
      // open dialog
      cy.dataCy('button-add-option').click();
      cy.dataCy('dialog-add-option').should('be.visible');
      cy.dataCy('dialog-add-option')
        .find('h3')
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('have.css', 'font-weight', '500')
        .and('contain', i18n.global.t('form.subsidiary.titleAddSubsidiary'));
    });
  });
});
