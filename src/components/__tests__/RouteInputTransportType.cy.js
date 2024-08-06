import { colors } from 'quasar';
import FormFieldTestWrapper from 'components/global/FormFieldTestWrapper.vue';
import RouteInputTransportType from '../routes/RouteInputTransportType.vue';
import { i18n } from '../../boot/i18n';

// composables
const { getPaletteColor } = colors;

// colors
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const selectorAvatarTransport = 'avatar-transport';
const selectorButtonToggleTransport = 'button-toggle-transport';
const selectorButtonToggleWrapper = 'button-toggle-wrapper';
const selectorDescriptionTransport = 'description-transport';
const selectorIconTransport = 'icon-transport';
const selectorLabelTransport = 'label-transport';
const selectorRouteInputTransportType = 'route-input-transport-type';

// variables
const avatarTransportSize = 32;
const buttonToggleWrapperHeight = 40;
const iconTransportSize = 18;

describe('<RouteInputTransportType>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'RouteInputTransportType',
          default: 'bike',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    interactionTests();
  });

  context('desktop - horizontal', () => {
    beforeEach(() => {
      cy.mount(RouteInputTransportType, {
        props: {
          horizontal: true,
          modelValue: 'bike',
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    // no wrapper = interaction tests will not work
    it('displays description next to buttons', () => {
      // description
      cy.dataCy(selectorDescriptionTransport).should(
        'have.css',
        'margin-top',
        '0px',
      );
      // description not full width (is flexed)
      cy.dataCy(selectorDescriptionTransport)
        .invoke('width')
        .should('be.lessThan', 300);
      // description and buttons are on the same line
      cy.testElementsSideBySide(
        selectorDescriptionTransport,
        'select-transport',
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormFieldTestWrapper, {
        props: {
          component: 'RouteInputTransportType',
          default: 'bike',
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    interactionTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorRouteInputTransportType).should('be.visible');
    cy.dataCy(selectorButtonToggleWrapper)
      .should('be.visible')
      .then((element) => {
        const offsetHeight = element[0].offsetHeight;
        expect(offsetHeight).to.be.eq(buttonToggleWrapperHeight);
      });
    // label transport
    cy.dataCy(selectorLabelTransport)
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('routes.labelTransportType'));
    // avatar
    cy.dataCy(selectorAvatarTransport).should('be.visible');
    cy.dataCy(selectorAvatarTransport)
      .invoke('height')
      .should('be.eq', avatarTransportSize);
    cy.dataCy(selectorAvatarTransport)
      .invoke('width')
      .should('be.eq', avatarTransportSize);
    // icon
    cy.dataCy(selectorIconTransport)
      .should('be.visible')
      .and('have.color', primary);
    cy.dataCy(selectorIconTransport)
      .invoke('height')
      .should('be.eq', iconTransportSize);
    cy.dataCy(selectorIconTransport)
      .invoke('width')
      .should('be.eq', iconTransportSize);
    // description transport
    cy.dataCy(selectorDescriptionTransport)
      .should('be.visible')
      .and('have.css', 'font-size', '14px')
      .and('have.css', 'font-weight', '400')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('routes.transport.bike'));
  });

  it('renders icons correctly', () => {
    // icons transport
    cy.dataCy(selectorIconTransport).each((element, index) => {
      cy.wrap(element)
        .should('be.visible')
        .matchImageSnapshot(
          `${Cypress.currentTest.titlePath}-transport-${index}`,
          {
            failureThreshold: 0.1,
            failureThresholdType: 'percent',
            timeout: 4000,
            customDiffConfig: { threshold: 0.4 },
            retries: 2,
          },
        );
    });
  });
}

function interactionTests() {
  it('allows to change transport type', () => {
    // make sure transport type is bike
    cy.dataCy(selectorButtonToggleTransport).eq(0).click();
    // description transport
    cy.dataCy(selectorDescriptionTransport).should(
      'contain',
      i18n.global.t('routes.transport.bike'),
    );
    // change transport type
    cy.dataCy(selectorButtonToggleTransport).eq(1).click();
    // transport on foot
    cy.dataCy(selectorDescriptionTransport).should(
      'contain',
      i18n.global.t('routes.transport.walk'),
    );
    // change transport type
    cy.dataCy(selectorButtonToggleTransport).eq(2).click();
    // transport by public transport
    cy.dataCy(selectorDescriptionTransport).should(
      'contain',
      i18n.global.t('routes.transport.bus'),
    );
    // change transport type
    cy.dataCy(selectorButtonToggleTransport).eq(3).click();
    // transport by car
    cy.dataCy(selectorDescriptionTransport).should(
      'contain',
      i18n.global.t('routes.transport.car'),
    );
    // change transport type
    cy.dataCy(selectorButtonToggleTransport).eq(4).click();
    // transport none
    cy.dataCy(selectorDescriptionTransport).should(
      'contain',
      i18n.global.t('routes.transport.none'),
    );
  });
}
