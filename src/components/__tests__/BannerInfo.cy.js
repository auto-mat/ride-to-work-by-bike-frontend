import BannerInfo from 'components/global/BannerInfo.vue';

describe('<BannerInfo>', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('bannerInfo').then((bannerInfo) => {
        cy.wrap(bannerInfo).as('bannerInfo');
        cy.mount(BannerInfo, {
          props: {
            title: bannerInfo.title,
            icon: bannerInfo.icon,
          },
          slots: {
            default: bannerInfo.content,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('bannerInfo').then((bannerInfo) => {
        cy.wrap(bannerInfo).as('bannerInfo');
        cy.mount(BannerInfo, {
          props: {
            title: bannerInfo.title,
            icon: bannerInfo.icon,
          },
          slots: {
            default: bannerInfo.content,
          },
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.get('@bannerInfo').then((bannerInfo) => {
      // component
      cy.dataCy('banner-info').should('be.visible');
      // icon
      cy.dataCy('banner-info-icon')
        .should('be.visible')
        .and(($icon) => {
          expect($icon[0].naturalWidth).to.be.greaterThan(0);
          expect($icon[0].naturalHeight).to.be.greaterThan(0);
        });
      // title
      cy.dataCy('banner-info-title')
        .should('be.visible')
        .and('have.css', 'font-size', '20px')
        .and('contain', bannerInfo.title);
      // content
      cy.dataCy('banner-info-content')
        .should('be.visible')
        .then(($el) => {
          const content = $el.text();
          cy.stripHtmlTags(bannerInfo.content).then((text) => {
            expect(content).to.equal(text);
          });
        });
    });
  });
}
