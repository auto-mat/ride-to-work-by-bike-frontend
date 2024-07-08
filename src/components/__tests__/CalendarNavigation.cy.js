import { colors } from 'quasar';
import CalendarNavigation from 'components/routes/CalendarNavigation.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const borderRadius = rideToWorkByBikeConfig.borderRadiusButtonSmall;

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
      .and('have.css', 'border-radius', borderRadius)
      .and('have.color', primary)
      .and('contain', i18n.global.t('time.today'));
    // button previous
    cy.dataCy('calendar-navigation-previous-button').should(
      'have.color',
      primary,
    );
    cy.dataCy('calendar-navigation-previous-button')
      .should('be.visible')
      .invoke('width')
      .should('be.eq', 36);
    cy.dataCy('calendar-navigation-previous-button')
      .should('be.visible')
      .invoke('height')
      .should('be.eq', 36);
    // button next
    cy.dataCy('calendar-navigation-next-button').should('have.color', primary);
    cy.dataCy('calendar-navigation-next-button')
      .should('be.visible')
      .invoke('width')
      .should('be.eq', 36);
    cy.dataCy('calendar-navigation-next-button')
      .should('be.visible')
      .invoke('height')
      .should('be.eq', 36);
  });
}
