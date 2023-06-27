describe('Home page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit(Cypress.config('baseUrl'));
      cy.viewport('macbook-13');
    });

    it('renders all components', () => {
      let i18n;
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          cy.dataCy('q-main').should('be.visible');

          cy.dataCy('index-title')
            .should('be.visible')
            .should('have.css', 'font-size', '24px')
            .should('have.css', 'font-weight', '700')
            .should('contain', i18n.global.t('index.title'));

          cy.dataCy('event-countdown').should('be.visible');

          cy.dataCy('list-challenge').should('be.visible');

          cy.dataCy('banner-image').should('be.visible');

          cy.dataCy('heading-background').should('be.visible');

          cy.dataCy('list-event').should('be.visible');
        });
    });

    it('renders left drawer', () => {
      cy.dataCy('q-drawer').should('be.visible');
    });

    it('allows user to change profile to "User 3" and back to "User 1"', () => {
      cy.dataCy('user-select').should('be.visible').click();

      cy.get('.q-item__label')
        .should('be.visible')
        .should('have.length', 3)
        .should('contain.text', 'User')
        .last()
        .click();

      cy.dataCy('user-select-input').should('contain', 'User 3');

      cy.dataCy('user-select-input').click();

      cy.get('.q-item__label')
        .should('be.visible')
        .should('have.length', 3)
        .should('contain.text', 'User')
        .first()
        .click();

      cy.dataCy('user-select-input').should('contain', 'User 1');
    });

    it('allows user to display help dialog and read all FAQ items', () => {
      cy.viewport('macbook-13');

      cy.dataCy('link-help').last().should('be.visible').click();

      cy.dataCy('dialog-header').should('be.visible');

      cy.dataCy('list-faq-list')
        .find('.q-card')
        .each(($element) => {
          cy.wrap($element).should('not.be.visible');
        });

      cy.dataCy('list-faq-list')
        .find('.q-expansion-item')
        .each(($element) => {
          cy.wrap($element).should('be.visible');

          cy.wrap($element).click();

          cy.wrap($element)
            .find('.q-card__section')
            .should('be.visible')
            .should('not.be.empty');
        });
    });

    it('allows user to display and submit contact form', () => {
      cy.viewport('macbook-13');

      let i18n;
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          cy.dataCy('link-help').last().should('be.visible').click();

          cy.dataCy('dialog-header').should('be.visible');

          cy.dataCy('dialog-content').scrollTo(0, 1200);

          cy.dataCy('button-contact').should('be.visible').click();

          cy.dataCy('dialog-header').find('h3').should('be.visible');

          cy.dataCy('contact-form-subject-input')
            .should('be.visible')
            .type('question');

          cy.dataCy('contact-form-message-input')
            .should('be.visible')
            .type('what is the minimum distance to ride to work?');

          cy.dataCy('contact-form-email-input')
            .should('be.visible')
            .type('P7LlQ@example.com');

          cy.dataCy('contact-form-submit').should('be.visible').click();

          // TODO: test successful submission
        });
    });

    it('allows validates contact form if there are errors', () => {
      cy.viewport('macbook-13');

      let i18n;
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          cy.dataCy('link-help').last().should('be.visible').click();

          cy.dataCy('dialog-header').should('be.visible');

          cy.dataCy('dialog-content').scrollTo(0, 1200);

          cy.dataCy('button-contact').should('be.visible').click();

          cy.dataCy('dialog-header').find('h3').should('be.visible');

          cy.dataCy('dialog-content').scrollTo('bottom');

          cy.dataCy('contact-form-submit').should('be.visible').click();

          cy.dataCy('contact-form-subject')
            .find('.q-field__messages')
            .should('be.visible')
            .should('contain', i18n.global.t('index.contact.subjectRequired'));

          cy.dataCy('contact-form-subject')
            .find('.q-field__control')
            .should('have.class', 'text-negative');

          cy.dataCy('dialog-content').scrollTo('top');

          cy.dataCy('contact-form-subject-input')
            .should('be.visible')
            .type('question');

          cy.dataCy('contact-form-subject')
            .find('.q-field__messages')
            .should('not.be.visible');

          cy.dataCy('contact-form-subject')
            .find('.q-field__control')
            .should('not.have.class', 'text-negative');

          cy.dataCy('dialog-content').scrollTo('bottom');

          cy.dataCy('contact-form-submit').should('be.visible').click();

          cy.dataCy('dialog-content').scrollTo('top');

          cy.dataCy('contact-form-message')
            .find('.q-field__messages')
            .should('be.visible')
            .should('contain', i18n.global.t('index.contact.messageRequired'));

          cy.dataCy('contact-form-message')
            .find('.q-field__control')
            .should('have.class', 'text-negative');

          cy.dataCy('contact-form-message-input')
            .should('be.visible')
            .type('what is the minimum distance to ride to work?');

          cy.dataCy('dialog-content').scrollTo('bottom');

          cy.dataCy('contact-form-submit').should('be.visible').click();

          cy.dataCy('contact-form-email')
            .find('.q-field__messages')
            .should('be.visible')
            .should('contain', i18n.global.t('index.contact.emailRequired'));

          cy.dataCy('contact-form-email')
            .find('.q-field__control')
            .should('have.class', 'text-negative');
        });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.visit(Cypress.config('baseUrl'));
      cy.viewport('iphone-6');
    });

    it('renders all components', () => {
      let i18n;
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          cy.dataCy('q-main').should('be.visible');

          cy.dataCy('index-title')
            .should('be.visible')
            .should('have.css', 'font-size', '24px')
            .should('have.css', 'font-weight', '700')
            .should('contain', i18n.global.t('index.title'));

          cy.dataCy('event-countdown').should('be.visible');

          cy.dataCy('list-challenge').should('be.visible');

          cy.dataCy('banner-image').should('be.visible');

          cy.dataCy('heading-background').should('be.visible');

          cy.dataCy('list-event').should('be.visible');
        });
    });

    it('allows user to show and hide left panel on mobile', () => {
      cy.viewport('iphone-6');

      cy.dataCy('q-drawer').should('not.be.visible');

      cy.dataCy('drawer-open-button').click();

      cy.dataCy('q-drawer')
        .should('be.visible')
        .and('have.css', 'width', '320px');

      // TODO: test closing the drawer; test opening the drawer with a swipe
      // cy.get('body')
      //   .trigger('pointerdown', { button: 0, clientX: 325, clientY: 100, force: true })
      //   .trigger('pointerup', { button: 0, clientX: 325, clientY: 100, force: true });

      // cy.dataCy('q-drawer')
      //   .should('not.be.visible');
    });
  });

  // TODO: test contacting through help

  // TODO: test rewatching application guide

  // TODO: test adding event to calendar

  // TODO: test displaying notifications

  // TODO: test redirecting to other pages through menu

  // TODO: test outbound links to social media
});
