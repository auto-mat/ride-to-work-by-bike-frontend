describe('Login page', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.visit('/#/login');
      cy.viewport('macbook-16');
    });

    it('renders logo', () => {
      cy.dataCy('logo').should('be.visible');
      cy.dataCy('logo').invoke('height').should('be.equal', 80);
    });

    it.only('renders help button', () => {
      let config;
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        config = JSON.parse(win.process.env.RIDE_TO_WORK_BY_BIKE_CONFIG);
      });
      cy.window().then(() => {
        cy.dataCy('button-help')
          .should('be.visible')
          .should('have.css', 'font-size', '13px')
          .should('have.css', 'font-weight', '500')
          .should('have.backgroundColor', `${config.colorPrimary}`)
          .should('have.css', 'border-radius', '50%'); // round
        cy.dataCy('button-help').should('contain', 'question_mark');
      });
    });

    it('renders help button with correct size', () => {
      cy.dataCy('button-help').should('be.visible');
      cy.dataCy('button-help').invoke('height').should('be.equal', 39);
      cy.dataCy('button-help').invoke('width').should('be.equal', 39);
    });

    it('allows user to display help dialog and read all FAQ items', () => {
      cy.dataCy('button-help').last().should('be.visible').click();
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
      let i18n;
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          cy.dataCy('button-help').last().should('be.visible').click();

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

    it('validates contact form if there are errors', () => {
      let i18n;
      cy.window().should('have.property', 'i18n');
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          cy.dataCy('button-help').last().should('be.visible').click();

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

    it('allows user to switch language', () => {
      let i18n;
      cy.window()
        .then((win) => {
          i18n = win.i18n;
        })
        .then(() => {
          const locales = i18n.global.availableLocales;
          const initialActiveLocale = i18n.global.locale;

          // active language has active class
          cy.dataCy('switcher-' + initialActiveLocale)
            .find('.q-btn')
            .should('have.class', 'bg-secondary');

          locales.forEach((locale) => {
            if (locale === initialActiveLocale) {
              return;
            }

            // changing the language
            cy.dataCy('switcher-' + locale)
              .should('exist')
              .should('be.visible')
              .find('.q-btn')
              .click();

            // old language becomes inactive
            cy.dataCy('switcher-' + initialActiveLocale)
              .find('.q-btn')
              .should('have.class', 'bg-white');

            // new language becomes active
            cy.dataCy('switcher-' + locale)
              .find('.q-btn')
              .should('have.class', 'bg-secondary');
          });
        });
    });
  });
});
