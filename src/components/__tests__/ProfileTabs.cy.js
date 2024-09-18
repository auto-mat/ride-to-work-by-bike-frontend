import ProfileTabs from 'components/profile/ProfileTabs.vue';
import { i18n } from '../../boot/i18n';
import { routesConf } from 'src/router/routes_conf';

// selectors
const selectorProfileTabs = 'profile-tabs';
const selectorButtonDetails = 'profile-tabs-button-details';
const selectorButtonQuestionnaires = 'profile-tabs-button-questionnaires';
const selectorButtonNewsletter = 'profile-tabs-button-newsletter';
const selectorButtonNotifications = 'profile-tabs-button-notifications';
const selectorPanelDetails = 'profile-tabs-panel-details';
const selectorPanelQuestionnaires = 'profile-tabs-panel-questionnaires';
const selectorPanelNewsletter = 'profile-tabs-panel-newsletter';
const selectorPanelNotifications = 'profile-tabs-panel-notifications';
const selectorProfileQuestionnaires = 'profile-questionnaires';

describe('<ProfileTabs>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ProfileTabs, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ProfileTabs, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorProfileTabs).should('be.visible');
    cy.dataCy(selectorButtonDetails).and(
      'contain',
      i18n.global.t('profile.tabDetails'),
    );
    cy.dataCy(selectorButtonQuestionnaires).and(
      'contain',
      i18n.global.t('profile.tabForms'),
    );
    cy.dataCy(selectorButtonNewsletter).and(
      'contain',
      i18n.global.t('profile.tabNewsletter'),
    );
    cy.dataCy(selectorButtonNotifications).and(
      'contain',
      i18n.global.t('profile.tabNotifications'),
    );

    cy.dataCy(selectorButtonDetails).click();
    cy.dataCy(selectorPanelDetails).should('be.visible');
    cy.dataCy(selectorPanelQuestionnaires).should('not.exist');
    cy.dataCy(selectorPanelNewsletter).should('not.exist');
    cy.dataCy(selectorPanelNotifications).should('not.exist');
  });

  it('allows to switch tabs', () => {
    cy.dataCy(selectorButtonQuestionnaires).click();
    cy.dataCy(selectorPanelQuestionnaires).should('be.visible');
    cy.dataCy(selectorButtonNewsletter).click();
    cy.dataCy(selectorPanelNewsletter).should('be.visible');
    cy.dataCy(selectorButtonNotifications).click();
    cy.dataCy(selectorPanelNotifications).should('be.visible');
    cy.dataCy(selectorButtonDetails).click();
    cy.dataCy(selectorPanelDetails).should('be.visible');
  });

  it('syncs tab navigation with URL', () => {
    // initial state
    cy.url().should('include', routesConf['profile_details'].path);
    // switch to details tab
    cy.dataCy(selectorButtonQuestionnaires).click();
    cy.url().should('not.include', routesConf['profile_details'].path);
    cy.url().should('include', routesConf['profile_forms'].path);
    // switch to forms tab
    cy.dataCy(selectorButtonNewsletter).click();
    cy.url().should('not.include', routesConf['profile_forms'].path);
    cy.url().should('include', routesConf['profile_newsletter'].path);
    // switch to newsletter tab
    cy.dataCy(selectorButtonNotifications).click();
    cy.url().should('not.include', routesConf['profile_newsletter'].path);
    cy.url().should('include', routesConf['profile_notifications'].path);
    // popstate
    cy.go('back');
    cy.url().should('include', routesConf['profile_newsletter'].path);
    cy.dataCy(selectorPanelNewsletter).should('be.visible');
  });

  it('renders questionnaires tab', () => {
    cy.dataCy(selectorButtonQuestionnaires).click();
    cy.dataCy(selectorPanelQuestionnaires).should('be.visible');
    cy.dataCy(selectorProfileQuestionnaires).should('be.visible');
  });
}
