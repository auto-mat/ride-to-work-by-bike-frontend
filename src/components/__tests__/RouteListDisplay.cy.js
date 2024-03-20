import RouteListDisplay from 'components/routes/RouteListDisplay.vue';
import { i18n } from '../../boot/i18n';

describe('<RouteListDisplay>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], index.component, i18n);
  });

  context(desktop, () => {
    beforeEach(() => {
      cy.mount(RouteListDisplay, {
        props: {},
      });
      cy.viewport('macbook-16');
    });
  });

  context(mobile, () => {
    beforeEach(() => {
      cy.mount(RouteListDisplay, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
