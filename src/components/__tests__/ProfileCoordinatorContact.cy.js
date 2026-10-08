import { colors } from 'quasar';
import ProfileCoordinatorContact from '@/components/profile/ProfileCoordinatorContact.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '@/boot/global_vars';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const classSelectorIcon = '.q-icon';
const selectorProfileCoordinatorContact = 'profile-coordinator-contact';
const selectorContactMessage = 'contact-message';
const selectorAvatar = 'coordinator-avatar';
const selectorName = 'coordinator-name';
const selectorPhone = 'coordinator-phone';
const selectorEmail = 'coordinator-email';

// constants
const avatarSize = '56px';
const componentPaddingLg = '24px';
const iconSize = '18px';
const nameFontSize = '14px';
const nameFontWeight = '700';
const textFontSize = '14px';
const textFontWeight = '400';

describe('<ProfileCoordinatorContact>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['textCoordinatorContact'],
      'profile',
      i18n,
    );
  });

  let coordinator;

  before(() => {
    cy.fixture('companyCoordinator').then((companyCoordinator) => {
      coordinator = companyCoordinator;
    });
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ProfileCoordinatorContact, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ProfileCoordinatorContact, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(selectorProfileCoordinatorContact).should('be.visible');
    });

    it('root element has borderRadius', () => {
      cy.dataCy(selectorProfileCoordinatorContact).should(
        'have.css',
        'border-radius',
        rideToWorkByBikeConfig.borderRadiusCard,
      );
    });

    it('renders company coordinator contact message', () => {
      cy.dataCy(selectorContactMessage)
        .should('be.visible')
        .then(($el) => {
          const content = $el.text();
          cy.stripHtmlTags(
            i18n.global.t('profile.textCoordinatorContact'),
          ).then((text) => {
            expect(content).to.equal(text);
          });
        });
    });

    it('renders avatar of a company coordinator', () => {
      cy.dataCy(selectorAvatar)
        .should('be.visible')
        .and('have.css', 'width', avatarSize)
        .and('have.css', 'height', avatarSize);
      // wait until image has no loading indicator
      cy.dataCy(selectorAvatar)
        .find('.q-img__loading')
        .should('not.exist')
        .then(() => {
          // take a snapshot
          cy.matchImageSnapshotNamed(
            selectorAvatar,
            `${Cypress.currentTest.titlePath[0]}-avatar`,
          );
        });
    });

    it('renders name of a coordinator', () => {
      cy.dataCy(selectorName)
        .should('be.visible')
        .and('have.css', 'font-size', nameFontSize)
        .and('have.css', 'font-weight', nameFontWeight)
        .and('have.color', grey10)
        .and('contain', coordinator.name);
    });

    it('renders phone number with a phone icon', () => {
      cy.dataCy(selectorPhone)
        .should('be.visible')
        .and('have.css', 'font-size', textFontSize)
        .and('have.css', 'font-weight', textFontWeight)
        .and('have.color', grey10)
        .and('contain', coordinator.phone)
        .find(classSelectorIcon)
        .should('have.css', 'width', iconSize)
        .and('have.css', 'height', iconSize);
    });

    it('renders email with an email icon', () => {
      cy.dataCy(selectorEmail)
        .should('be.visible')
        .and('have.css', 'font-size', textFontSize)
        .and('have.css', 'font-weight', textFontWeight)
        .and('have.color', grey10)
        .and('contain', coordinator.email)
        .find(classSelectorIcon)
        .should('have.css', 'width', iconSize)
        .and('have.css', 'height', iconSize);
    });

    it('renders component padding', () => {
      cy.dataCy(selectorProfileCoordinatorContact).should(
        'have.css',
        'padding',
        componentPaddingLg,
      );
    });
  }
});
