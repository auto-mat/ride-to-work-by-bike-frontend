import TabCoordinatorAttendance from 'components/coordinator/TabCoordinatorAttendance.vue';
import { i18n } from '../../boot/i18n';

describe('<TabCoordinatorAttendance>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'coordinator', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(TabCoordinatorAttendance, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(TabCoordinatorAttendance, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('header-organization').should('be.visible');
  });
}
