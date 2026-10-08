import { colors, date } from 'quasar';
import TableNotifications from '@/components/profile/TableNotifications.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const classSelectorQBtn = '.q-btn';
const dataSelectorNotificationTitle = '[data-cy="notification-title"]';
const dataSelectorNotificationTimestamp = '[data-cy="notification-timestamp"]';
const dataSelectorNotificationState = '[data-cy="notification-state"]';
const dataSelectorNotificationAction = '[data-cy="notification-action"]';
const dataSelectorNotificationIcon = '[data-cy="notification-icon"]';
const dataSelectorNotificationVerbal = '[data-cy="notification-verbal"]';
const selectorTableNotifications = 'table-notifications';
const classSelectorNotificationRow = '.q-tr';
const selectorButtonMarkAllAsRead = 'button-mark-all-as-read';

// variables
const defaultTablePostsPerPage = 5;
const fontWeightBold = '700';
const fontWeightRegular = '400';

describe('<TableNotifications>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelAction',
        'labelDate',
        'labelRead',
        'labelState',
        'labelTitle',
        'labelUnread',
      ],
      'notifications',
      i18n,
    );
  });

  let notifications;

  before(() => {
    cy.fixture('notifications').then((data) => {
      notifications = data;
    });
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(TableNotifications, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(selectorTableNotifications).should('be.visible');
    });

    it('renders notifications', () => {
      cy.get(classSelectorNotificationRow)
        .should('be.visible')
        .should('have.length', defaultTablePostsPerPage);
      cy.get(classSelectorNotificationRow).each((row, index) => {
        const notification = notifications[index];
        cy.wrap(row)
          .find(dataSelectorNotificationTitle)
          .should('be.visible')
          .should('contain', notification.verb);
        cy.wrap(row).find(dataSelectorNotificationIcon).should('be.visible');
        cy.wrap(row).find(dataSelectorNotificationVerbal).should('be.visible');
        if (notification.data.url) {
          cy.wrap(row)
            .find(dataSelectorNotificationVerbal)
            .and('have.prop', 'tagName', 'A')
            .and('have.attr', 'href', notification.data.url)
            .and('have.attr', 'target', '_blank');
        } else {
          cy.wrap(row)
            .find(dataSelectorNotificationVerbal)
            .should('have.prop', 'tagName', 'SPAN')
            .and('have.color', grey10);
        }
        if (notification.unread) {
          cy.wrap(row)
            .find(dataSelectorNotificationVerbal)
            .should('have.css', 'font-weight', fontWeightBold);
        } else {
          cy.wrap(row)
            .find(dataSelectorNotificationVerbal)
            .should('have.css', 'font-weight', fontWeightRegular);
        }
        cy.wrap(row)
          .find(dataSelectorNotificationTimestamp)
          .should('be.visible')
          .and(
            'contain',
            date.formatDate(
              new Date(String(notification.timestamp)),
              'D. MMM. YYYY',
            ),
          );
        cy.wrap(row)
          .find(dataSelectorNotificationState)
          .should('be.visible')
          .and(
            'contain',
            notification.unread
              ? i18n.global.t('notifications.labelUnread')
              : i18n.global.t('notifications.labelRead'),
          );
        cy.wrap(row).find(dataSelectorNotificationAction).should('be.visible');
      });
    });

    it('allows to mark notification as read', () => {
      cy.get(classSelectorNotificationRow)
        .first()
        .find(dataSelectorNotificationState)
        .should('contain', i18n.global.t('notifications.labelUnread'));
      cy.get(classSelectorNotificationRow)
        .first()
        .find(dataSelectorNotificationAction)
        .find(classSelectorQBtn)
        .click();
      cy.get(classSelectorNotificationRow)
        .first()
        .find(dataSelectorNotificationState)
        .should('not.contain', i18n.global.t('notifications.labelUnread'))
        .and('contain', i18n.global.t('notifications.labelRead'));
    });

    it('marks notification as read when row is clicked', () => {
      cy.get(classSelectorNotificationRow).last().click();
      cy.get(classSelectorNotificationRow)
        .last()
        .find(dataSelectorNotificationState)
        .should('not.contain', i18n.global.t('notifications.labelUnread'))
        .and('contain', i18n.global.t('notifications.labelRead'));
    });

    it('allows to mark all notifications as read', () => {
      cy.dataCy(selectorButtonMarkAllAsRead)
        .should('be.visible')
        .and('not.be.disabled')
        .click();
      cy.get(classSelectorNotificationRow).each((row) => {
        cy.wrap(row)
          .find(dataSelectorNotificationState)
          .should('contain', i18n.global.t('notifications.labelRead'));
      });
      cy.dataCy(selectorButtonMarkAllAsRead)
        .should('be.visible')
        .and('be.disabled');
    });
  }
});
