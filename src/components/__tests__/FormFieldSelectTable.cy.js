import FormFieldSelectTable from 'components/form/FormFieldSelectTable.vue';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { i18n } from '../../boot/i18n';

const { contactEmail } = rideToWorkByBikeConfig;

describe('<FormFieldSelectTable>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonAddCompany',
        'hintCityChallenge',
        'hintDepartment',
        'labelCityChallenge',
        'labelCompany',
        'labelDepartment',
        'textCompanyPermission',
        'textCoordinator',
        'textSubdivisionAddress',
        'textUserExperience',
        'titleAddCompany',
        'titleSubdivisionAddress',
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
      ['labelCity', 'labelHouseNumber', 'labelStreet', 'labelZip'],
      'form',
      i18n,
    );
  });

  context('company desktop', () => {
    beforeEach(() => {
      cy.fixture('companyOptions').then((options) => {
        cy.mount(FormFieldSelectTable, {
          props: {
            options: options,
            variant: 'company',
            label: i18n.global.t('form.company.labelCompany'),
            labelButton: i18n.global.t('register.challenge.buttonAddCompany'),
            labelButtonDialog: i18n.global.t('form.company.buttonAddCompany'),
            titleDialog: i18n.global.t('form.company.titleAddCompany'),
          },
        });
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
      cy.dataCy('form-select-table-search').find('input').type('2');
      // show only one option
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .should('have.length', 1);
      cy.dataCy('form-select-table-search').find('input').clear();
      cy.dataCy('form-select-table-search').find('input').blur();
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .should('have.length', 7);
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
      cy.dataCy('form-add-company-street').find('input').type('Slezská');
      cy.dataCy('form-add-company-house-number').find('input').type('2033/11');
      cy.dataCy('form-add-company-city').find('input').type('Praha');
      cy.dataCy('form-add-company-zip').find('input').type('120 00');
      cy.dataCy('form-add-company-city-challenge').click();
      cy.get('.q-menu').should('be.visible').find('.q-item').first().click();
      // submit
      cy.dataCy('dialog-button-submit').click();
      cy.dataCy('dialog-add-option').should('not.exist');
    });
  });

  context('company selected', () => {
    beforeEach(() => {
      cy.fixture('companyOptions').then((options) => {
        cy.mount(FormFieldSelectTable, {
          props: {
            options: options,
            variant: 'company',
            modelValue: options[0].value,
            label: i18n.global.t('form.company.labelCompany'),
            labelButton: i18n.global.t('register.challenge.buttonAddCompany'),
            labelButtonDialog: i18n.global.t('form.company.buttonAddCompany'),
            titleDialog: i18n.global.t('form.company.titleAddCompany'),
          },
        });
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

  context('team desktop', () => {
    beforeEach(() => {
      cy.fixture('teamOptions').then((options) => {
        cy.mount(FormFieldSelectTable, {
          props: {
            options: options,
            variant: 'team',
            label: i18n.global.t('form.team.labelTeam'),
            labelButton: i18n.global.t('form.team.buttonAddTeam'),
            labelButtonDialog: i18n.global.t('form.team.buttonAddTeam'),
            titleDialog: i18n.global.t('form.team.titleAddTeam'),
          },
        });
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
      cy.dataCy('form-select-table-search').find('input').type('z');
      // show only one option
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .should('have.length', 1);
      cy.dataCy('form-select-table-search').find('input').clear();
      cy.dataCy('form-select-table-search').find('input').blur();
      cy.dataCy('form-select-table-option-group')
        .find('.q-radio__label')
        .should('have.length', 2);
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
});
