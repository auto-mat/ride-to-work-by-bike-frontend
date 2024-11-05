import {
  systemTimeChallengeInactive,
  testDesktopSidebar,
  testLanguageSwitcher,
  testMobileHeader,
} from '../support/commonTests';

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
  context('desktop', () => {
    beforeEach(() => {
      cy.visit(Cypress.config('baseUrl'));
      cy.viewport('macbook-16');

      // load config an i18n objects as aliases
      cy.task('getAppConfig', process).then((config) => {
        // alias config
        cy.wrap(config).as('config');
        cy.window().should('have.property', 'i18n');
        cy.window().then((win) => {
          // alias i18n
          cy.wrap(win.i18n).as('i18n');
        });
      });
    });

    coreTests();
    testLanguageSwitcher();
    testDesktopSidebar();

    it('allows user to display and submit contact form', () => {
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

    it('validates contact form if there are errors', () => {
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

    it('allows user to see all news items', () => {
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

    it(failTestTitle, () => {
      cy.dataCy('footer-top-button').should('be.visible').click();
      cy.window().its('scrollY').should('equal', 0);
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit(Cypress.config('baseUrl'));
      cy.viewport('iphone-6');
    });

    coreTests();
    testLanguageSwitcher();
    testMobileHeader();

    it('allows user to show and hide bottom panel on mobile', () => {
      cy.dataCy('footer-panel-menu').should('be.visible');
      cy.dataCy('footer-panel-menu')
        .should('be.visible')
        .find('.q-item')
        .should('have.length', 5);
      cy.dataCy('footer-panel-menu-hamburger').click();
      cy.dataCy('footer-panel-menu-dialog').should('be.visible');
      cy.dataCy('footer-panel-menu-dialog')
        .should('be.visible')
        .find('.q-item')
        .should('have.length', 5);
    });

    it('allows user to display and submit contact form', () => {
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

    it('validates contact form if there are errors', () => {
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

    it('allows user to access menu in bottom panel', () => {
      cy.dataCy('footer-panel').should('be.visible');
      cy.dataCy('footer-panel-menu').should('be.visible');
      cy.dataCy('footer-panel-menu-hamburger').should('be.visible').click();
      cy.dataCy('footer-panel-menu-dialog')
        .should('be.visible')
        .find('.q-item')
        .should('have.length', 5);
    });
  });

  context('before challenge', () => {
    beforeEach(() => {
      cy.clock(systemTimeChallengeInactive).then(() => {
        cy.visit(Cypress.config('baseUrl'));
        cy.viewport('macbook-16');

        // load config an i18n objects as aliases
        cy.task('getAppConfig', process).then((config) => {
          // alias config
          cy.wrap(config).as('config');
          cy.window().should('have.property', 'i18n');
          cy.window().then((win) => {
            // alias i18n
            cy.wrap(win.i18n).as('i18n');
          });
        });
      });
    });

    it('renders all components', () => {
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
        cy.dataCy('banner-app').should('be.visible');
        // future challenges
        cy.dataCy('card-list-title').should('be.visible');
        cy.dataCy('list-challenge').should('be.visible');
        // NOT progress slider
        cy.dataCy('slider-progress').should('not.exist');
        // NOT list progress
        cy.dataCy('list-progress').should('not.exist');
        // banner questionnaire
        cy.dataCy('banner-image').should('be.visible');
        // heading with background image
        cy.dataCy('heading-background').should('be.visible');
        // list of events
        cy.dataCy('list-event').should('be.visible');
        cy.dataCy('card-list-item').should('be.visible');
        // list of offers
        cy.dataCy('list-offer').should('be.visible');
        // list of posts
        cy.dataCy('list-post').should('be.visible');
        // newsletter
        cy.dataCy('newsletter-feature').should('be.visible');
        // list of follow
        cy.dataCy('list-card-follow').should('be.visible');
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

  it('allows user to display event modal', () => {
    cy.dataCy('dialog-card-event').should('not.exist');
    cy.dataCy('list-event')
      .should('be.visible')
      .find('.card-link')
      .should('be.visible')
      .click();
    cy.dataCy('dialog-card-event').should('be.visible');
  });

  it('allows user to display offer modal', () => {
    cy.dataCy('dialog-offer').should('not.exist');
    cy.dataCy('list-card-offer-item').first().should('be.visible').click();
    cy.dataCy('dialog-offer').should('be.visible');
  });
}
