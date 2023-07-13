import VueNewsletterFeature from 'components/VueNewsletterFeature.vue';

const title = '';
const description = '';

describe('<VueNewsletterFeature>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'title',
        'description',
        'aboutChallenges',
        'aboutEvents',
        'aboutMobility',
        'following',
        'follow',
      ],
      'index.newsletterFeature'
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueNewsletterFeature, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-title')
          .should('have.css', 'font-size', '20px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', title)
          .then(($title) => {
            expect($title.text()).to.equal(title);
          });
      });
    });

    it('renders description', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-description')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', description)
          .then(($title) => {
            expect($title.text()).to.equal(description);
          });
      });
    });

    it('renders description', () => {
      cy.window().then(() => {
        cy.dataCy('newsletter-feature-description')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '500')
          .should('have.color', '#000000')
          .should('contain', description)
          .then(($title) => {
            expect($title.text()).to.equal(description);
          });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(VueNewsletterFeature, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
