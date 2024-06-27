import CalendarNavigation from 'components/routes/CalendarNavigation.vue';
import { i18n } from '../../boot/i18n';

describe('<CalendarNavigation>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(['today'], 'time', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(CalendarNavigation, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(CalendarNavigation, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('calendar-navigation').should('be.visible');
    // button today
    cy.dataCy('calendar-navigation-today')
      .should('be.visible')
      .and('contain', i18n.global.t('time.today'));
    // button previous
    cy.dataCy('calendar-navigation-previous')
      .should('be.visible')
      .invoke('width')
      .should('be.eq', 36);
    cy.dataCy('calendar-navigation-previous')
      .should('be.visible')
      .invoke('height')
      .should('be.eq', 36);
    // button next
    cy.dataCy('calendar-navigation-next')
      .should('be.visible')
      .invoke('width')
      .should('be.eq', 36);
    cy.dataCy('calendar-navigation-next')
      .should('be.visible')
      .invoke('height')
      .should('be.eq', 36);
  });
}
