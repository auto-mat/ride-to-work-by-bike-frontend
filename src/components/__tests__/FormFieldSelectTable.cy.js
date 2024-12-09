import FormFieldSelectTable from 'components/form/FormFieldSelectTable.vue';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { i18n } from '../../boot/i18n';
import { useSelectedOrganization } from 'src/composables/useSelectedOrganization';
import { createPinia, setActivePinia } from 'pinia';
import {
  OrganizationLevel,
  OrganizationType,
} from 'src/components/types/Organization';
// import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

const { contactEmail } = rideToWorkByBikeConfig;

describe('<FormFieldSelectTable>', () => {
  let options;

  before(() => {
    setActivePinia(createPinia());

    cy.fixture('formOrganizationOptions').then((formOrganizationOptions) => {
      const { organizationOptions } = useSelectedOrganization(
        formOrganizationOptions,
      );
      options = organizationOptions;
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
      ['labelCity', 'labelHouseNumber', 'labelStreet', 'labelZip'],
      'form',
      i18n,
    );
  });

  context('organization company', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormFieldSelectTable, {
        props: {
          options: options.value,
          organizationLevel: OrganizationLevel.organization,
          organizationType: OrganizationType.company,
        },
      });
      cy.viewport('macbook-16');
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
      cy.dataCy('form-select-table-option-group').should('be.visible');
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
        .type(options.value[0].label.substring(0, 3));
      // show only one option
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .should('have.length', 1);
      cy.dataCy('form-select-table-search').find('input').clear();
      cy.dataCy('form-select-table-search').find('input').blur();
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .should('have.length', options.value.length);
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
      cy.dataCy('form-add-company-name').find('input').type('AutoMat');
      cy.dataCy('form-add-company-vat-id').find('input').type('87654321');
      cy.dataCy('form-add-subsidiary-street').find('input').type('Slezská');
      cy.dataCy('form-add-subsidiary-house-number')
        .find('input')
        .type('2033/11');
      cy.dataCy('form-add-subsidiary-city').find('input').type('Praha');
      cy.dataCy('form-add-subsidiary-zip').find('input').type('120 00');
      cy.dataCy('form-add-subsidiary-city-challenge').click();
      cy.get('.q-menu').should('be.visible').find('.q-item').first().click();
      // submit
      cy.dataCy('dialog-button-submit').click();
      cy.dataCy('dialog-add-option').should('not.exist');
    });
  });

  context('organization company selected', () => {
    beforeEach(() => {
      cy.interceptCitiesGetApi(rideToWorkByBikeConfig, i18n);
      cy.mount(FormFieldSelectTable, {
        props: {
          options: options.value,
          organizationLevel: OrganizationLevel.organization,
          organizationType: OrganizationType.company,
          modelValue: options.value[0].value,
        },
      });
      cy.viewport('macbook-16');
    });

    it('shows selected option', () => {
      cy.dataCy('form-select-table-option-group')
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
          options: options.value,
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
          options: options.value,
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
      cy.mount(FormFieldSelectTable, {
        props: {
          options: options.value,
          organizationLevel: OrganizationLevel.team,
        },
      });
      cy.viewport('macbook-16');
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
      cy.dataCy('form-select-table-option-group').should('be.visible');
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
        .type(options.value[0].label.substring(0, 3));
      // show only one option
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .should('have.length', 1);
      cy.dataCy('form-select-table-search').find('input').clear();
      cy.dataCy('form-select-table-search').find('input').blur();
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .should('have.length', options.value.length);
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
      cy.dataCy('form-add-team-name').find('input').type('Team AutoMat');
      // submit
      cy.dataCy('dialog-button-submit').click();
      cy.dataCy('dialog-add-option').should('not.exist');
    });
  });

  context('subsidiary', () => {
    beforeEach(() => {
      cy.mount(FormFieldSelectTable, {
        props: {
          options: options.value,
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
