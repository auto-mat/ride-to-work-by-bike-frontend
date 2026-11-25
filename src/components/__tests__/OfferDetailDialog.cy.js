import { colors } from 'quasar';

import OfferDetailDialog from '../offer/OfferDetailDialog.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');

describe('<OfferDetailDialog>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['titleVoucherCode', 'buttonUseVoucher'],
      'index.cardOffer',
      i18n,
    );
  });

  context('desktop with full content', () => {
    beforeEach(() => {
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.wrap(listCardsPrizes[0]).as('card');
        cy.mount(OfferDetailDialog, {
          props: {
            card: listCardsPrizes[0],
            modelValue: true,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('renders title and metadata', () => {
      cy.get('@card').then((card) => {
        cy.dataCy('dialog-offer').should('be.visible');
        cy.dataCy('dialog-header')
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .then(($el) => {
            cy.stripHtmlTags(card.title).then((text) => {
              expect($el.text()).to.contain(text);
            });
          });
        cy.dataCy('dialog-metadata-item')
          .should('be.visible')
          .and('have.length', card.metadata.length)
          .first()
          .should('contain', card.metadata[0].text);
      });
    });

    it('renders content and description', () => {
      cy.get('@card').then((card) => {
        cy.dataCy('dialog-content')
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', black)
          .then(($el) => {
            cy.stripHtmlTags(card.content).then((text) => {
              expect($el.text()).to.contain(text);
            });
          });
        cy.dataCy('dialog-description').then(($el) => {
          cy.stripHtmlTags(card.description).then((text) => {
            cy.decodeHtmlEntities(text).then((decoded) => {
              expect($el.text()).to.contain(decoded);
            });
          });
        });
      });
    });

    it('renders voucher code and link', () => {
      cy.get('@card').then((card) => {
        cy.dataCy('dialog-voucher-title')
          .should('be.visible')
          .and('contain', i18n.global.t('index.cardOffer.titleVoucherCode'));
        cy.dataCy('dialog-voucher-code')
          .should('be.visible')
          .and('contain', card.voucher);
        cy.dataCy('dialog-offer-link')
          .should('be.visible')
          .and('have.attr', 'href', card.voucherUrl)
          .and('contain', i18n.global.t('index.cardOffer.buttonUseVoucher'));
      });
    });

    it('renders image', () => {
      cy.get('@card').then((card) => {
        cy.dataCy('dialog-body').scrollTo('bottom', {
          ensureScrollable: false,
        });
        cy.dataCy('dialog-image')
          .find('img')
          .should('be.visible')
          .and('have.attr', 'src', card.image.src);
      });
    });

    it('renders validation for t-shirt event', () => {
      cy.dataCy('offer-validation').should('exist');
    });

    it('renders two columns', () => {
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 50);
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 50);
    });
  });

  context('desktop without voucher and t-shirt event', () => {
    beforeEach(() => {
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.mount(OfferDetailDialog, {
          props: {
            card: listCardsPrizes[1],
            modelValue: true,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('does not render voucher and validation', () => {
      cy.dataCy('dialog-offer').should('be.visible');
      cy.dataCy('dialog-voucher-title').should('not.exist');
      cy.dataCy('dialog-voucher-code').should('not.exist');
      cy.dataCy('dialog-offer-link').should('not.exist');
      cy.dataCy('offer-validation').should('not.exist');
    });
  });

  context('closed', () => {
    beforeEach(() => {
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.mount(OfferDetailDialog, {
          props: {
            card: listCardsPrizes[0],
            modelValue: false,
          },
        });
      });
    });

    it('does not render dialog', () => {
      cy.dataCy('dialog-offer').should('not.exist');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.mount(OfferDetailDialog, {
          props: {
            card: listCardsPrizes[0],
            modelValue: true,
          },
        });
        cy.viewport('iphone-6');
      });
    });

    it('renders one column', () => {
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 100);
      cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 100);
    });
  });
});
