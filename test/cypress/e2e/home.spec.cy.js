import {
  systemTimeRegistrationPhaseInactive,
  systemTimeBeforeCompetitionStart,
  failOnStatusCode,
  httpSuccessfullStatus,
  httpTooManyRequestsStatus,
  httpTooManyRequestsStatusMessage,
  userAgentHeader,
  testDesktopSidebar,
  testLanguageSwitcher,
  testMobileHeader,
} from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';
import { calculateCountdownIntervals } from '../../../src/utils';
import { isOfferValidMoreThanOneDay } from '../../../src/utils/get_offer_valid';
import { routesConf } from '../../../src/router/routes_conf';

// variables
const failTestTitle = 'allows user to scroll to top using the footer button';
const fontFamily = 'Poppins';

describe('Home page', () => {
  Cypress.on('fail', (err, runnable) => {
    if (err.name === 'AssertionError' && runnable.title === failTestTitle) {
      cy.log(err.message);
      return false;
    }
  });

  beforeEach(() => {
    // load config an i18n objects as aliases
    cy.task('getAppConfig', process).then((config) => {
      // alias config
      cy.wrap(config).as('config');
      // intercept campaign API
      cy.interceptThisCampaignGetApi(config, defLocale);
    });
    cy.viewport('macbook-16');
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      // load config an i18n objects as aliases
      cy.get('@config').then((config) => {
        cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
          cy.fixture('apiGetOffersResponseAlternative.json').then((offers) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            cy.interceptOffersGetApi(
              config,
              defLocale,
              response.results[0].city_wp_slug,
              offers,
            );
            cy.wrap(offers).as('offers');
          });
        });
      });
      cy.visit(Cypress.config('baseUrl'));
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
    });

    coreTests();
    testLanguageSwitcher();
    testDesktopSidebar();

    it.skip('allows user to display and submit contact form', () => {
      // open help modal
      cy.dataCy('button-help').last().should('be.visible').click();
      cy.dataCy('dialog-header').should('be.visible');
      // scroll to center of modal
      cy.dataCy('dialog-body').scrollTo(0, 1200);
      // switch to contact state
      cy.dataCy('button-contact').should('be.visible').click();
      // contact title
      cy.dataCy('dialog-header').find('h3').should('be.visible');
      // input subject
      cy.dataCy('contact-form-subject')
        .find('input')
        .should('be.visible')
        .type('question');
      // input message
      cy.dataCy('contact-form-message-input')
        .should('be.visible')
        .type('what is the minimum distance to ride to work?');
      // input email
      cy.dataCy('contact-form-email')
        .find('input')
        .should('be.visible')
        .type('P7LlQ@example.com');
      // submit
      cy.dataCy('contact-form-submit').should('be.visible').click();

      // TODO: test successful submission
    });

    it.skip('validates contact form if there are errors', () => {
      cy.get('@i18n').then((i18n) => {
        // open contact form
        cy.dataCy('button-help').last().should('be.visible').click();
        cy.dataCy('dialog-header').should('be.visible');
        cy.dataCy('dialog-body').scrollTo(0, 1200);
        cy.dataCy('button-contact').should('be.visible').click();
        cy.dataCy('dialog-header').find('h3').should('be.visible');
        cy.dataCy('dialog-body').scrollTo('bottom', {
          ensureScrollable: false,
        });
        // submit empty form
        cy.dataCy('contact-form-submit').should('be.visible').click();
        // check for error
        cy.dataCy('contact-form-subject')
          .find('.q-field__messages')
          .should('be.visible')
          .then(($el) => {
            cy.wrap(
              i18n.global.t('form.messageFieldRequired', {
                fieldName: i18n.global.t('index.contact.subject'),
              }),
            ).then((translation) => {
              expect($el.text()).to.equal(translation);
            });
          });
        // check for error
        cy.dataCy('contact-form-subject')
          .find('.q-field__control')
          .should('have.class', 'text-negative');
        cy.dataCy('dialog-body').scrollTo('top', { ensureScrollable: false });
        // fill in subject field
        cy.dataCy('contact-form-subject')
          .find('input')
          .should('be.visible')
          .type('question');
        cy.dataCy('contact-form-subject').find('input').blur();
        cy.dataCy('contact-form-subject')
          .find('.q-field__messages')
          .should('be.empty');
        cy.dataCy('contact-form-subject')
          .find('.q-field__control')
          .should('not.have.class', 'text-negative');
        cy.dataCy('dialog-body').scrollTo('bottom', {
          ensureScrollable: false,
        });
        // submit for with missing message
        cy.dataCy('contact-form-submit').should('be.visible').click();
        cy.dataCy('dialog-body').scrollTo('top', { ensureScrollable: false });
        // check for error
        cy.dataCy('contact-form-message')
          .find('.q-field__messages')
          .should('be.visible')
          .then(($el) => {
            cy.wrap(i18n.global.t('index.contact.messageRequired')).then(
              (translation) => {
                expect($el.text()).to.equal(translation);
              },
            );
          });
        // fill in message
        cy.dataCy('contact-form-message')
          .find('.q-field__control')
          .should('have.class', 'text-negative');
        cy.dataCy('contact-form-message-input')
          .should('be.visible')
          .type('what is the minimum distance to ride to work?');
        cy.dataCy('dialog-body').scrollTo('bottom', {
          ensureScrollable: false,
        });
        // submit for with missing email
        cy.dataCy('contact-form-submit').should('be.visible').click();
        // check for error
        cy.dataCy('contact-form-email')
          .find('.q-field__messages')
          .should('be.visible')
          .then(($el) => {
            cy.wrap(
              i18n.global.t('form.messageFieldRequired', {
                fieldName: i18n.global.t('form.labelEmail'),
              }),
            ).then((translation) => {
              expect($el.text()).to.equal(translation);
            });
          });
        cy.dataCy('contact-form-email')
          .find('.q-field__control')
          .should('have.class', 'text-negative');
      });
    });

    it.skip('allows user to see all news items', () => {
      cy.dataCy('list-post').should('be.visible');
      cy.dataCy('list-post')
        .find('.swiper-slide:nth-child(1)')
        .should('be.visible');
      cy.dataCy('list-post')
        .find('.swiper-slide:nth-child(2)')
        .should('be.visible');
      cy.dataCy('list-post')
        .find('.swiper-slide:nth-child(3)')
        .should('be.visible');
      cy.dataCy('list-post')
        .find('.swiper-slide:nth-child(4)')
        .should('be.visible');
      cy.dataCy('list-post')
        .find('.swiper-slide')
        .then(($el) => {
          $el.each(() => {
            cy.dataCy('list-post')
              .find('swiper-container')
              .shadow()
              .find('.swiper-button-next')
              .click({ force: true });
          });
          cy.dataCy('list-post')
            .find('.swiper-slide:last-child')
            .should('be.visible');
        });
    });

    it('renders newsletter labels in correct language', () => {
      cy.get('@i18n').then((i18n) => {
        Object.keys(i18n.global.messages).forEach((key) => {
          // set language to given locale
          cy.dataCy(`switcher-button-${key}`).click();
          // test newsletter labels for selected locale
          cy.dataCy('newsletter-feature-item')
            .should(
              'contain',
              i18n.global.t(
                'index.newsletterFeature.aboutChallenges',
                {},
                {
                  locale: key,
                },
              ),
            )
            .and(
              'contain',
              i18n.global.t(
                'index.newsletterFeature.aboutEvents',
                {},
                {
                  locale: key,
                },
              ),
            )
            .and(
              'contain',
              i18n.global.t(
                'index.newsletterFeature.aboutMobility',
                {},
                {
                  locale: key,
                },
              ),
            );
        });
      });
    });

    it(failTestTitle, () => {
      cy.dataCy('footer-top-button').should('be.visible').click();
      cy.window().its('scrollY').should('equal', 0);
    });
  });

  context('desktop - user team state is "undecided"', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      cy.get('@config').then((config) => {
        // intercept campaign API
        cy.interceptThisCampaignGetApi(config, defLocale);
        // intercept register challenge API
        cy.fixture('apiGetRegisterChallengeIndividualPaidCompleteStaff').then(
          (responseRegisterChallenge) => {
            cy.interceptRegisterChallengeGetApi(
              config,
              defLocale,
              responseRegisterChallenge,
            );
          },
        );
        // intercept my team API
        cy.fixture('apiGetMyTeamResponseUndecided.json').then(
          (responseMyTeam) => {
            cy.interceptMyTeamGetApi(config, defLocale, responseMyTeam);
          },
        );
      });
      cy.visit(Cypress.config('baseUrl'));
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
    });

    it('shows banner team member "undecided" state', () => {
      cy.testBannerTeamMemberUndecidedState();
    });
  });

  context('desktop - user team state is "approved"', () => {
    beforeEach(() => {
      cy.get('@config').then((config) => {
        // intercept campaign API
        cy.interceptThisCampaignGetApi(config, defLocale);
        // intercept register challenge API
        cy.fixture('apiGetRegisterChallengeIndividualPaidCompleteStaff').then(
          (responseRegisterChallenge) => {
            cy.interceptRegisterChallengeGetApi(
              config,
              defLocale,
              responseRegisterChallenge,
            );

            // intercept my team PUT API
            cy.interceptMyTeamPutApi(
              config,
              defLocale,
              responseRegisterChallenge.results[0].team_id,
            );
          },
        );
        // intercept is user organization admin API
        cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptIsUserOrganizationAdminGetApi(
              config,
              defLocale,
              response,
            );
          },
        );
        // intercept my team GET API
        cy.fixture('apiGetMyTeamResponseApproved.json').then(
          (responseMyTeam) => {
            cy.interceptMyTeamGetApi(config, defLocale, responseMyTeam);
          },
        );
      });
      cy.visit(Cypress.config('baseUrl'));
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
      cy.viewport('macbook-16');
    });

    it('shows banner team member "approved" state', () => {
      cy.testBannerTeamMemberApprovedState();
    });

    it('allows user to approve a single member', () => {
      cy.testApproveSingleTeamMember();
    });

    it('allows user to approve max number of members and reject the rest', () => {
      cy.testApproveMaxTeamMembers();
    });
  });

  context('mobile - user is not a coordinator', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.get('@config').then((config) => {
        // intercept is user organization admin API
        cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
          (response) => {
            cy.interceptIsUserOrganizationAdminGetApi(
              config,
              defLocale,
              response,
            );
          },
        );
        cy.fixture('apiGetMyTeamResponseApproved').then((responseMyTeam) => {
          cy.interceptMyTeamGetApi(config, defLocale, responseMyTeam);
        });
        cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
          cy.fixture('apiGetOffersResponse.json').then((offers) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            cy.interceptOffersGetApi(
              config,
              defLocale,
              response.results[0].city_wp_slug,
              offers,
            );
            cy.wrap(offers).as('offers');
          });
        });
      });
      // visit index page
      cy.visit(Cypress.config('baseUrl'));
      // wait for API intercepts
      cy.waitForThisCampaignApi();
      cy.fixture('apiGetIsUserOrganizationAdminResponseFalse').then(
        (response) => {
          cy.waitForIsUserOrganizationAdminApi(response);
        },
      );
    });

    coreTests();
    testLanguageSwitcher();
    testMobileHeader();

    it('allows user to show and hide bottom panel on mobile', () => {
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.get('@config').then((config) => {
          cy.checkMobileBottomPanel({
            config,
            i18n: win.i18n,
            defLocale,
            isUserOrganizationAdmin: false,
            isUserStaff: false,
          });
        });
      });
    });

    it(failTestTitle, () => {
      cy.window().its('scrollY').should('equal', 0);
    });
  });

  context('mobile - user is coordinator', () => {
    beforeEach(() => {
      cy.viewport('iphone-6');
      cy.get('@config').then((config) => {
        // intercept is user organization admin API
        cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
          (response) => {
            cy.interceptIsUserOrganizationAdminGetApi(
              config,
              defLocale,
              response,
            );
          },
        );
        cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
          cy.fixture('apiGetOffersResponse.json').then((offers) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
            cy.interceptOffersGetApi(
              config,
              defLocale,
              response.results[0].city_wp_slug,
              offers,
            );
            cy.wrap(offers).as('offers');
          });
        });
      });
      // visit index page
      cy.visit(Cypress.config('baseUrl'));
      // wait for API intercepts
      cy.waitForThisCampaignApi();
      cy.fixture('apiGetIsUserOrganizationAdminResponseTrue').then(
        (response) => {
          cy.waitForIsUserOrganizationAdminApi(response);
        },
      );
    });

    coreTests();
    testLanguageSwitcher();
    testMobileHeader();

    it('allows user to show and hide bottom panel on mobile', () => {
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.get('@config').then((config) => {
          cy.checkMobileBottomPanel({
            config,
            i18n: win.i18n,
            defLocale,
            isUserOrganizationAdmin: true,
            isUserStaff: false,
          });
        });
      });
    });

    it.skip('allows user to display and submit contact form', () => {
      // open help modal
      cy.dataCy('button-help').first().should('be.visible').click();
      cy.dataCy('dialog-header').should('be.visible');
      // scroll to center of modal
      cy.dataCy('dialog-body').scrollTo(0, 1200);
      // switch to contact state
      cy.dataCy('button-contact').should('be.visible').click();
      cy.dataCy('dialog-header').find('h3').should('be.visible');
      cy.dataCy('dialog-body').scrollTo(0, 0);
      // input subject
      cy.dataCy('contact-form-subject')
        .find('input')
        .should('be.visible')
        .type('question');
      // input message
      cy.dataCy('contact-form-message-input')
        .should('be.visible')
        .type('what is the minimum distance to ride to work?');
      // input email
      cy.dataCy('contact-form-email')
        .find('input')
        .should('be.visible')
        .type('P7LlQ@example.com');
      cy.dataCy('contact-form-submit').should('be.visible').click();
      // TODO: test successful submission
    });

    it.skip('validates contact form if there are errors', () => {
      let i18n;
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          cy.dataCy('button-help').first().should('be.visible').click();
          cy.dataCy('dialog-header').should('be.visible');
          cy.dataCy('dialog-body').scrollTo(0, 1200);
          cy.dataCy('button-contact').should('be.visible').click();
          cy.dataCy('dialog-header').find('h3').should('be.visible');
          cy.dataCy('dialog-body').scrollTo('bottom', {
            ensureScrollable: false,
          });
          cy.dataCy('contact-form-submit').should('be.visible').click();
          cy.dataCy('dialog-body').scrollTo('top', { ensureScrollable: false });
          cy.dataCy('contact-form-subject')
            .find('.q-field__messages')
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('form.messageFieldRequired', {
                fieldName: i18n.global.t('index.contact.subject'),
              }),
            );
          cy.dataCy('contact-form-subject')
            .find('.q-field__control')
            .should('have.class', 'text-negative');
          cy.dataCy('dialog-body').scrollTo('top', { ensureScrollable: false });
          cy.dataCy('contact-form-subject')
            .find('input')
            .should('be.visible')
            .type('question');
          cy.dataCy('contact-form-subject').find('input').blur();
          cy.dataCy('contact-form-subject')
            .find('.q-field__messages')
            .should('be.empty');
          cy.dataCy('contact-form-subject')
            .find('.q-field__control')
            .should('not.have.class', 'text-negative');
          cy.dataCy('dialog-body').scrollTo('bottom', {
            ensureScrollable: false,
          });
          cy.dataCy('contact-form-submit').should('be.visible').click();
          cy.dataCy('dialog-body').scrollTo('top', { ensureScrollable: false });
          cy.dataCy('contact-form-message')
            .find('.q-field__messages')
            .should('be.visible')
            .and('contain', i18n.global.t('index.contact.messageRequired'));
          cy.dataCy('contact-form-message')
            .find('.q-field__control')
            .should('have.class', 'text-negative');
          cy.dataCy('contact-form-message-input')
            .should('be.visible')
            .type('what is the minimum distance to ride to work?');
          cy.dataCy('dialog-body').scrollTo('bottom', {
            ensureScrollable: false,
          });
          cy.dataCy('contact-form-submit').should('be.visible').click();
          cy.dataCy('contact-form-email')
            .find('.q-field__messages')
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t('form.messageFieldRequired', {
                fieldName: i18n.global.t('form.labelEmail'),
              }),
            );
          cy.dataCy('contact-form-email')
            .find('.q-field__control')
            .should('have.class', 'text-negative');
        });
    });

    it(failTestTitle, () => {
      cy.window().its('scrollY').should('equal', 0);
    });
  });

  context('mobile - user is staff', () => {
    beforeEach(() => {
      cy.get('@config').then((config) => {
        // intercept register challenge API with staff user
        cy.fixture('apiGetRegisterChallengeIndividualPaidCompleteStaff').then(
          (response) => {
            cy.interceptRegisterChallengeGetApi(config, defLocale, response);
          },
        );
      });
      // visit index page
      cy.visit(Cypress.config('baseUrl'));
      // wait for API intercepts
      cy.waitForThisCampaignApi();
      cy.viewport('iphone-6');
    });

    it('allows user to show and hide bottom panel on mobile', () => {
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.get('@config').then((config) => {
          cy.checkMobileBottomPanel({
            config,
            i18n: win.i18n,
            defLocale,
            isUserOrganizationAdmin: false,
            isUserStaff: true,
          });
        });
      });
    });
  });

  context('before challenge', () => {
    beforeEach(() => {
      cy.clock(systemTimeRegistrationPhaseInactive, ['Date']).then(() => {
        // load config
        cy.get('@config').then((config) => {
          // intercept campaign API
          cy.interceptThisCampaignGetApi(config, defLocale);
        });

        cy.visit(Cypress.config('baseUrl'));
        cy.viewport('macbook-16');
        // load i18n
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    it('renders all components', () => {
      cy.waitForThisCampaignApi();
      cy.get('@i18n').then((i18n) => {
        cy.dataCy('q-main').should('be.visible');
        // title
        cy.dataCy('index-title')
          .should('be.visible')
          .then(($el) => {
            cy.wrap(i18n.global.t('index.title')).then((translation) => {
              expect($el.text()).to.equal(translation);
            });
          });
        // countdown
        cy.dataCy('countdown-event').should('be.visible');
        // NOT banner routes
        cy.dataCy('banner-routes').should('not.exist');
        // banner app
        // cy.dataCy('banner-app').should('be.visible');
        // future challenges
        // cy.dataCy('card-list-title').should('be.visible');
        // cy.dataCy('list-challenge').should('be.visible');
        // NOT progress slider
        cy.dataCy('slider-progress').should('not.exist');
        // NOT list progress
        cy.dataCy('list-progress').should('not.exist');
        // banner questionnaire
        // cy.dataCy('banner-image').should('be.visible');
        // heading with background image
        cy.dataCy('heading-background').should('be.visible');
        // list of events
        // cy.dataCy('list-event').should('be.visible');
        // cy.dataCy('card-list-item').should('be.visible');
        // list of offers
        // cy.dataCy('list-offer').should('be.visible');
        // list of posts
        // cy.dataCy('list-post').should('be.visible');
        // newsletter
        cy.dataCy('newsletter-feature').should('be.visible');
        // list of follow
        cy.dataCy('list-card-follow').should('be.visible');
      });
    });

    it('renders follow cards component', () => {
      cy.get('@config').then((config) => {
        // card list
        cy.dataCy('list-card-follow').should('be.visible');
        // first card
        cy.dataCy('card-list-follow-item-1').should('be.visible');
        // no second card
        cy.dataCy('card-list-follow-item-2').should('not.exist');
        // first card link
        cy.dataCy('card-list-follow-item-1')
          .find('a')
          .should('have.attr', 'href', config.urlFacebookRideToWorkByBike)
          .and('have.attr', 'target', '_blank');
        // check if link is accessible
        cy.request({
          url: config.urlFacebookRideToWorkByBike,
          failOnStatusCode: failOnStatusCode,
          headers: { ...userAgentHeader },
        }).then((resp) => {
          if (resp.status === httpTooManyRequestsStatus) {
            cy.log(httpTooManyRequestsStatusMessage);
            return;
          }
          expect(resp.status).to.eq(httpSuccessfullStatus);
        });
      });
    });

    it('shows correct countdown to competition start', () => {
      cy.waitForThisCampaignApi();
      cy.fixture('apiGetThisCampaign.json').then((campaign) => {
        const competitionPhase = campaign.results[0].phase_set.find(
          (phase) => phase.phase_type === 'competition',
        );
        const competitionStart = new Date(competitionPhase.date_from).getTime();
        const currentDate = new Date(
          systemTimeRegistrationPhaseInactive,
        ).getTime();
        // calculate time difference in milliseconds
        const timeDifference = competitionStart - currentDate;

        const { days, hours, minutes, seconds } =
          calculateCountdownIntervals(timeDifference);

        // check countdown values
        cy.dataCy('countdown-event').within(() => {
          cy.dataCy('countdown-days').contains(days.toString());
          cy.dataCy('countdown-hours').contains(hours.toString());
          cy.dataCy('countdown-minutes').contains(minutes.toString());
          cy.dataCy('countdown-seconds').contains(seconds.toString());
        });
      });
    });
  });

  context('Countdown Event before competition phase starts', () => {
    beforeEach(() => {
      cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
        // load config
        cy.get('@config').then((config) => {
          // intercept campaign API
          cy.interceptThisCampaignGetApi(config, defLocale, campaign);
        });
      });
      cy.viewport('macbook-16');
    });

    it('shows countdown before competition and hides it once competition starts', () => {
      cy.fixture('apiGetThisCampaignMay.json').then((campaign) => {
        cy.clock(new Date(systemTimeBeforeCompetitionStart), ['Date']);
        cy.visit(Cypress.config('baseUrl'));
        cy.waitForThisCampaignApi(campaign);
        // verify countdown is visible before competition phase
        cy.dataCy('countdown-event').should('be.visible');
        // tick clock forward to competition phase start
        cy.tick(5000);
        // verify countdown is hidden after competition phase starts
        cy.dataCy('countdown-event').should('not.exist');
      });
    });
  });

  // TODO: test links

  // TODO: test rewatching application guide

  // TODO: test adding event to calendar

  // TODO: test displaying notifications

  // TODO: test outbound links to social media
});

function coreTests() {
  it('loads fonts', () => {
    // check if font is loaded
    cy.wrap(doc.fonts).invoke('check', `16px ${fontFamily}`).should('be.true');
    // check if font is used
    cy.dataCy('index-title')
      .should('be.visible')
      .and('have.css', 'font-family', fontFamily);
  });

  it.skip('allows user to display event modal', () => {
    cy.dataCy('dialog-card-event').should('not.exist');
    cy.dataCy('list-event')
      .should('be.visible')
      .find('.card-link')
      .should('be.visible')
      .click();
    cy.dataCy('dialog-card-event').should('be.visible');
  });

  it.skip('renders max number of offers', () => {
    cy.get('@config').then((config) => {
      cy.get('@offers').then((offers) => {
        // wait for offers API
        cy.waitForOffersApi(offers);
        // calculate max number of offers to render
        cy.wrap(
          Math.min(
            config.indexPageVisibleOfferCount,
            offers.filter(isOfferValidMoreThanOneDay).length,
          ),
        ).then((count) => {
          cy.dataCy('list-card-offer-item')
            .should('be.visible')
            .and('have.length', count);
        });
        // if there are more offers than config max, show "all offers" button
        if (
          offers.filter(isOfferValidMoreThanOneDay).length >
          config.indexPageVisibleOfferCount
        ) {
          cy.dataCy('list-card-offer-button').should('be.visible').click();
          // button goes to prizes page
          cy.url().should('include', routesConf['prizes'].children.fullPath);
        } else {
          cy.dataCy('list-card-offer-button').should('not.exist');
        }
      });
    });
  });

  it.skip('allows user to display offer modal', () => {
    cy.dataCy('dialog-offer').should('not.exist');
    cy.dataCy('list-card-offer-item').first().should('be.visible').click();
    cy.dataCy('dialog-offer').should('be.visible');
  });
}
