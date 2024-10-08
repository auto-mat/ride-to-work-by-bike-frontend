import DrawerToggleButtons from 'components/global/DrawerToggleButtons.vue';
import { i18n } from '../../boot/i18n';

// selectors
const selectorDrawerToggleButtons = 'drawer-toggle-buttons';

describe('<DrawerToggleButtons>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonCityAdministration', 'buttonParticipation'],
      'drawerMenu',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(DrawerToggleButtons, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorDrawerToggleButtons)
      .should('be.visible')
      .and('contain', i18n.global.t('drawerMenu.buttonCityAdministration'))
      .and('contain', i18n.global.t('drawerMenu.buttonParticipation'));
  });
}
