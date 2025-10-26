import BannerInfo from 'components/global/BannerInfo.vue';
import { i18n } from '../../boot/i18n';

// variables
const iconSize = 96;

describe('<BannerInfo>', () => {
  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BannerInfo, {});
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(BannerInfo, {});
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('banner-info').should('be.visible');
    // icon
    cy.dataCy('banner-info-icon').should('be.visible');
    cy.dataCy('banner-info-icon').invoke('height').should('be.equal', iconSize);
    cy.dataCy('banner-info-icon').invoke('width').should('be.equal', iconSize);
    // title
    cy.dataCy('banner-info-title')
      .should('be.visible')
      .and('have.css', 'font-size', '20px')
      .and('contain', i18n.global.t('bannerInfo.title'));
    // content
    cy.dataCy('banner-info-content')
      .should('be.visible')
      .then(($el) => {
        const content = $el.text();
        cy.stripHtmlTags(i18n.global.t('bannerInfo.text')).then((text) => {
          expect(content).to.equal(text);
        });
      });
  });
}
