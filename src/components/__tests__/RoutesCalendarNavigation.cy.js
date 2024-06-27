import RoutesCalendarNavigation from 'components/routes/RoutesCalendarNavigation.vue';
import { i18n } from '../../boot/i18n';

describe('<RoutesCalendarNavigation>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['today'], 'time', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RoutesCalendarNavigation, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(RoutesCalendarNavigation, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('routes-calendar-navigation').should('be.visible');
    // button today
    cy.dataCy('routes-calendar-navigation-today')
      .should('be.visible')
      .and('contain', i18n.global.t('time.today'));
    // button previous
    cy.dataCy('routes-calendar-navigation-previous')
      .should('be.visible')
      .invoke('width')
      .should('be.eq', 36);
    cy.dataCy('routes-calendar-navigation-previous')
      .should('be.visible')
      .invoke('height')
      .should('be.eq', 36);
    // button next
    cy.dataCy('routes-calendar-navigation-next')
      .should('be.visible')
      .invoke('width')
      .should('be.eq', 36);
    cy.dataCy('routes-calendar-navigation-next')
      .should('be.visible')
      .invoke('height')
      .should('be.eq', 36);
  });
}
