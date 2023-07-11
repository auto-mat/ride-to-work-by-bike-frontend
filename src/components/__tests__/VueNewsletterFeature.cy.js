import VueNewsletterFeature from 'components/VueNewsletterFeature.vue';

describe('<VueNewsletterFeature>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(["title","subtitle","aboutChallenges","aboutEvents","aboutMobility","following","follow"], 'index.newsletterFeature');
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(VueNewsletterFeature, {
        props: {},
      });
      cy.viewport('macbook-16');
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
