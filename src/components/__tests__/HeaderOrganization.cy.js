import HeaderOrganization from 'components/coordinator/HeaderOrganization.vue';
import { i18n } from '../../boot/i18n';

describe('<HeaderOrganization>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('headerOrganization').then((organization) => {
        cy.wrap(organization).as('organization');
        cy.mount(HeaderOrganization, {
          props: {
            organization,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('headerOrganization').then((organization) => {
        cy.wrap(organization).as('organization');
        cy.mount(HeaderOrganization, {
          props: {
            organization,
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
    cy.get('@organization').then((organization) => {
      // component
      cy.dataCy('header-organization').should('be.visible');
      // image
      cy.dataCy('header-organization-image').should('be.visible');
      cy.testImageSrcAlt(
        'header-organization-image',
        organization.image.src,
        organization.image.alt,
      );
      // title
      cy.dataCy('header-organization-title')
        .should('be.visible')
        .and('contain', organization.title);
      // branch count
      cy.dataCy('header-organization-branch-count')
        .should('be.visible')
        .and('contain', organization.branches.length)
        .and(
          'contain',
          i18n.global.tc(
            'coordinator.labelBranches',
            organization.branches.length,
          ),
        );
      // member count
      cy.dataCy('header-organization-member-count')
        .should('be.visible')
        .and('contain', organization.members.length)
        .and(
          'contain',
          i18n.global.tc(
            'coordinator.labelMembers',
            organization.members.length,
          ),
        );
      // button export
      cy.dataCy('header-organization-button-export')
        .should('be.visible')
        .and('contain', i18n.global.t('coordinator.buttonExportMembers'));
      cy.dataCy('header-organization-button-export')
        .find('i')
        .should('have.class', 'mdi-download');
    });
  });
}
