import ButtonNotifications from 'components/global/ButtonNotifications.vue';
import { i18n } from '../../boot/i18n';
import { colors } from 'quasar';
import { routesConf } from '../../router/routes_conf';

const { getPaletteColor } = colors;

const grey10 = getPaletteColor('grey-10');
const red = getPaletteColor('red');

// selectors
const selectorButtonNotifications = 'button-notifications';
const selectorNotificationsCountBadge = 'notifications-count-badge';
const selectorNotificationsIcon = 'notifications-icon';
const selectorNotificationsDialog = 'notifications-dialog';
const selectorNotificationsTitle = 'notifications-title';
const selectorNotificationsCountBadgeDialog =
  'notifications-count-badge-dialog';
const selectorNoUnreadNotifications = 'no-unread-notifications';
const selectorNotificationsHistoryButton = 'notifications-history-button';
const selectorMarkAllReadButton = 'mark-all-read-button';
const selectorNotificationsList = 'notifications-list';

// variables
const buttonSize = '24px';
const iconSize = '18px';
const titleFontSize = '20px';
const titleFontWeight = '500';

describe('<ButtonNotifications>', () => {
  let notifications;

  before(() => {
    cy.fixture('notifications').then((fixtureData) => {
      notifications = fixtureData;
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonMarkAllAsRead',
        'buttonNotificationHistory',
        'dialogTitle',
        'textNoUnreadNotifications',
      ],
      'notifications',
      i18n,
    );
  });

  context.skip('desktop', () => {
    beforeEach(() => {
      cy.mount(ButtonNotifications, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  function coreTests() {
    it('renders notification button', () => {
      cy.dataCy(selectorButtonNotifications)
        .should('be.visible')
        .and('have.css', 'border-radius', '50%')
        .and('have.css', 'width', buttonSize)
        .and('have.css', 'height', buttonSize);
    });

    it('renders notification icon with correct size', () => {
      cy.dataCy(selectorNotificationsIcon)
        .should('be.visible')
        .and('have.css', 'font-size', iconSize)
        .and('have.css', 'width', iconSize)
        .and('have.css', 'height', iconSize);
    });

    it('opens dialog when button is clicked', () => {
      cy.dataCy(selectorButtonNotifications).click();
      cy.dataCy(selectorNotificationsDialog).should('be.visible');
    });

    it('renders dialog title with correct styling', () => {
      cy.dataCy(selectorButtonNotifications).click();
      cy.dataCy(selectorNotificationsTitle)
        .should('be.visible')
        .and('have.css', 'font-size', titleFontSize)
        .and('have.css', 'font-weight', titleFontWeight)
        .and('have.color', grey10)
        .and('contain', i18n.global.t('notifications.dialogTitle'));
    });

    it('renders "Mark all as read" button', () => {
      cy.dataCy(selectorButtonNotifications).click();
      cy.dataCy(selectorMarkAllReadButton)
        .should('be.visible')
        .and('contain', i18n.global.t('notifications.buttonMarkAllAsRead'));
    });

    it('renders notifications list', () => {
      cy.dataCy(selectorButtonNotifications).click();
      cy.dataCy(selectorNotificationsList).should('be.visible');
    });

    it('renders count badge with correct unread count', () => {
      cy.dataCy(selectorNotificationsCountBadge)
        .should('be.visible')
        .and('have.backgroundColor', red);
    });

    it('renders count badge in dialog with correct unread count', () => {
      const unreadCount = notifications.filter((n) => n.unread).length;
      cy.dataCy(selectorButtonNotifications).click();
      cy.dataCy(selectorNotificationsCountBadgeDialog)
        .should('be.visible')
        .and('have.text', unreadCount.toString());
    });

    it('updates count badges when marking notifications as read', () => {
      const initialUnreadCount = notifications.filter((n) => n.unread).length;
      cy.dataCy(selectorButtonNotifications).click();
      // initial count
      cy.dataCy(selectorNotificationsCountBadge).should('exist');
      cy.dataCy(selectorNotificationsCountBadgeDialog).should(
        'have.text',
        initialUnreadCount.toString(),
      );
      // mark one notification as read
      cy.dataCy(
        `notification-state-icon-${notifications.find((n) => n.unread).id}`,
      ).click();
      // updated count
      const updatedUnreadCount = initialUnreadCount - 1;
      cy.dataCy(selectorNotificationsCountBadge).should('exist');
      cy.dataCy(selectorNotificationsCountBadgeDialog).should(
        'have.text',
        updatedUnreadCount.toString(),
      );
      // mark all as read
      cy.dataCy(selectorMarkAllReadButton).click();
      // badges are not visible
      cy.dataCy(selectorNotificationsCountBadge).should('not.exist');
      cy.dataCy(selectorNotificationsCountBadgeDialog).should('not.exist');
      // mark all as read button is not visible
      cy.dataCy(selectorMarkAllReadButton).should('not.exist');
      // empty state is visible
      cy.dataCy(selectorNoUnreadNotifications)
        .should('be.visible')
        .and(
          'contain',
          i18n.global.t('notifications.textNoUnreadNotifications'),
        );
    });

    it('renders notification history button with correct href', () => {
      cy.dataCy(selectorButtonNotifications).click();
      cy.dataCy(selectorNotificationsHistoryButton)
        .should('be.visible')
        .and('have.attr', 'href')
        .should(
          'contain',
          routesConf['profile_notifications'].children.fullPath,
        );
      cy.dataCy(selectorNotificationsHistoryButton).should(
        'contain',
        i18n.global.t('notifications.buttonNotificationHistory'),
      );
    });
  }
});
