import { routesConf } from '../../../src/router/routes_conf';
import { defLocale } from '../../../src/i18n/def_locale';
import offersResponse from '../fixtures/apiGetOffersResponseRoutesEvents.json';

const dateWithLoggedRoute = new Date(2025, 4, 26);
const citySlug = 'praha';
const [eventCalendar, eventLoggingWindow, eventPast, offerMultiDay] =
  offersResponse.map((post) => ({
    title: post.title,
    date: post.start_date.slice(0, 10),
  }));

describe('Routes page city events', () => {
  beforeEach(() => {
    cy.clock(new Date(dateWithLoggedRoute), ['Date']);
    cy.task('getAppConfig').then((config) => {
      cy.wrap(config).as('config');
      cy.interceptMyTeamGetApi(config, defLocale);
      cy.fixture('apiGetRegisterChallengeIndividualPaidCompleteStaff').then(
        (responseRegisterChallenge) => {
          responseRegisterChallenge.results[0].city_wp_slug = citySlug;
          cy.interceptRegisterChallengeGetApi(
            config,
            defLocale,
            responseRegisterChallenge,
          );
        },
      );
      cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
        (response) => {
          cy.interceptIsUserOrganizationAdminGetApi(
            config,
            defLocale,
            response,
          );
        },
      );
      cy.interceptOffersGetApi(config, defLocale, citySlug, offersResponse);
      cy.interceptPrizesGetApi(config, defLocale, citySlug);
      cy.interceptCommuteModeGetApi(config, defLocale);
      cy.interceptTripsGetApi(config, defLocale);
      // home page does not load feed, it loads campaign and team data
      cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
        cy.interceptThisCampaignGetApi(config, defLocale, campaign);
        cy.visit('#' + routesConf['home']['path']);
        cy.dataCy('index-title').should('be.visible');
        cy.waitForThisCampaignApi(campaign);
      });
    });
  });

  context('desktop calendar', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.visit('#' + routesConf['routes_calendar']['children']['fullPath']);
      cy.dataCy('routes-page-title').should('be.visible');
      cy.waitForOffersApi(offersResponse);
    });

    it('shows single-day city events in day cells', () => {
      cy.get(`[data-date="${eventCalendar.date}"]`)
        .find('[data-cy="event-link"]')
        .should('contain', eventCalendar.title);
      cy.get(`[data-date="${eventLoggingWindow.date}"]`)
        .find('[data-cy="event-link"]')
        .should('contain', eventLoggingWindow.title);
      cy.dataCy('routes-calendar').should('not.contain', offerMultiDay.title);
    });

    it('opens event detail without opening route panel', () => {
      cy.get(`[data-date="${eventLoggingWindow.date}"]`)
        .find('[data-cy="event-link"]')
        .click();
      cy.dataCy('dialog-offer')
        .should('be.visible')
        .and('contain', eventLoggingWindow.title);
      cy.dataCy('route-calendar-panel').should('not.exist');
    });
  });

  context('mobile list', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.visit('#' + routesConf['routes_list']['children']['fullPath']);
      cy.dataCy('routes-page-title').should('be.visible');
      cy.waitForOffersApi(offersResponse);
    });

    it('shows city events below trips of the day', () => {
      cy.dataCy('route-list-edit')
        .find(`[data-date="${eventLoggingWindow.date}"]`)
        .find('[data-cy="event-link"]')
        .should('contain', eventLoggingWindow.title);
      cy.dataCy('route-list-display')
        .find('[data-cy="event-link"]')
        .should('contain', eventPast.title);
      cy.dataCy('route-list-edit').should('not.contain', offerMultiDay.title);
    });

    it('opens event detail without modifying routes', () => {
      cy.dataCy('route-list-edit')
        .find(`[data-date="${eventLoggingWindow.date}"]`)
        .find('[data-cy="event-link"]')
        .click();
      cy.dataCy('dialog-offer')
        .should('be.visible')
        .and('contain', eventLoggingWindow.title);
      cy.dataCy('dialog-close').click();
      cy.dataCy('button-save-sticky').should('be.disabled');
    });
  });
});
