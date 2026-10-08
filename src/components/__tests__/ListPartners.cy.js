import ListPartners from '@/components/global/ListPartners.vue';
import { i18n } from '../../boot/i18n';

describe('<ListPartners>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'titlePartners',
        'titleLocal',
        'titleGeneral',
        'titleNational',
        'titleMedia',
        'titleOrganizers',
      ],
      'listPartners',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('listPartners').then((listPartners) => {
        cy.wrap(listPartners).as('partners');
        cy.mount(ListPartners, {
          props: {},
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();

    it('renders correct grid', () => {
      cy.testElementPercentageWidth(cy.dataCy('partners-local-item'), 8.3);
      cy.testElementPercentageWidth(cy.dataCy('partners-general-item'), 16.7);
      cy.testElementPercentageWidth(cy.dataCy('partners-national-item'), 16.7);
      cy.testElementPercentageWidth(cy.dataCy('partners-media-item'), 8.3);
      cy.testElementPercentageWidth(
        cy.dataCy('partners-organizers-item'),
        16.7,
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('listPartners').then((listPartners) => {
        cy.wrap(listPartners).as('partners');
        cy.mount(ListPartners, {
          props: {},
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();

    it('renders correct grid', () => {
      cy.testElementPercentageWidth(cy.dataCy('partners-local-item'), 25);
      cy.testElementPercentageWidth(cy.dataCy('partners-general-item'), 50);
      cy.testElementPercentageWidth(cy.dataCy('partners-national-item'), 50);
      cy.testElementPercentageWidth(cy.dataCy('partners-media-item'), 25);
      cy.testElementPercentageWidth(cy.dataCy('partners-organizers-item'), 50);
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.get('@partners').then((partners) => {
      cy.dataCy('list-partners').should('be.visible');
      // title
      cy.dataCy('list-partners-title')
        .should('be.visible')
        .and('contain', i18n.global.t('listPartners.titlePartners'));
      // local partners
      cy.dataCy('partners-local').should('be.visible');
      cy.dataCy('partners-local-item')
        .should('be.visible')
        .each(($el, index) => {
          cy.wrap($el)
            .find('a')
            .should('have.attr', 'href', partners.local[index].url)
            .and('have.attr', 'target', '_blank');
        });
      // general partners
      cy.dataCy('partners-general').should('be.visible');
      cy.dataCy('partners-general-item')
        .should('be.visible')
        .each(($el, index) => {
          cy.wrap($el)
            .find('a')
            .should('have.attr', 'href', partners.general[index].url)
            .and('have.attr', 'target', '_blank');
        });
      // national partners
      cy.dataCy('partners-national').should('be.visible');
      cy.dataCy('partners-national-item')
        .should('be.visible')
        .each(($el, index) => {
          cy.wrap($el)
            .find('a')
            .should('have.attr', 'href', partners.national[index].url)
            .and('have.attr', 'target', '_blank');
        });
      // media partners
      cy.dataCy('partners-media').should('be.visible');
      cy.dataCy('partners-media-item')
        .should('be.visible')
        .each(($el, index) => {
          cy.wrap($el)
            .find('a')
            .should('have.attr', 'href', partners.media[index].url)
            .and('have.attr', 'target', '_blank');
        });
      // organizers
      cy.dataCy('partners-organizers').should('be.visible');
      cy.dataCy('partners-organizers-item')
        .should('be.visible')
        .each(($el, index) => {
          cy.wrap($el)
            .find('a')
            .should('have.attr', 'href', partners.organizers[index].url)
            .and('have.attr', 'target', '_blank');
        });
    });
  });
}
