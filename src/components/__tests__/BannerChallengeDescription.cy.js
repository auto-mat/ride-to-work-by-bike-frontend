import BannerChallengeDescription from 'components/results/BannerChallengeDescription.vue';
import { i18n } from '../../boot/i18n';
import { useRoutes } from 'src/composables/useRoutes';

const { getRouteIcon } = useRoutes();

describe('<BannerChallengeDescription>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['period', 'transportType'],
      'bannerChallengeDescription',
      i18n,
    );
    cy.testLanguageStringsInContext(['from', 'to'], 'global', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(BannerChallengeDescription, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(BannerChallengeDescription, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('bannerChallengeDescription').then(
      (bannerChallengeDescription) => {
        cy.dataCy('banner-challenge-description').should('be.visible');
        cy.dataCy('challenge-period')
          .should('be.visible')
          .and('contain', i18n.global.t('bannerChallengeDescription.period'))
          .and('contain', '1.')
          .and('contain', '31.')
          .and('contain', '2024');
        cy.dataCy('challenge-transport')
          .should('be.visible')
          .and(
            'contain',
            i18n.global.t('bannerChallengeDescription.transportType'),
          )
          .and('contain', getRouteIcon('bike'))
          .and('contain', getRouteIcon('walk'));
        cy.dataCy('challenge-description')
          .should('be.visible')
          // test v-html content
          .then(($el) => {
            const htmlContent = $el.html();
            expect(htmlContent).to.equal(
              bannerChallengeDescription.description,
            );
          });
        cy.dataCy('challenge-link')
          .should('be.visible')
          .and('contain', bannerChallengeDescription.link.title);
        cy.dataCy('challenge-link')
          .find('a')
          .should('have.attr', 'href', bannerChallengeDescription.link.url);
      },
    );
  });
}
