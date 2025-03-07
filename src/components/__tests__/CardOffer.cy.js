import { colors } from 'quasar';

import CardOffer from '../homepage/CardOffer.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { getPaletteColor } = colors;
const black = getPaletteColor('black');
const white = getPaletteColor('white');
const primary = getPaletteColor('primary');
const grey10 = getPaletteColor('grey-10');

const { borderRadiusCard } = rideToWorkByBikeConfig;

describe('<CardOffer>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['unlimitedExpirationDate', 'titleVoucherCode', 'buttonUseVoucher'],
      'index.cardOffer',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.wrap(listCardsPrizes[0]).as('card');
        cy.mount(CardOffer, {
          props: {
            card: listCardsPrizes[0],
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();

    it('renders validation bar', () => {
      cy.window().then(() => {
        cy.get('@card').then(() => {
          cy.dataCy('card-offer').click();
          // dialog
          cy.dataCy('dialog-offer').should('be.visible');
          // validation
          cy.dataCy('offer-validation').should('be.visible');
        });
      });
    });

    it('renders modal with two columns', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 50);
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 50);
      });
    });
  });

  context('desktop without t-shirt event', () => {
    beforeEach(() => {
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.wrap(listCardsPrizes[1]).as('card');
        cy.mount(CardOffer, {
          props: {
            card: listCardsPrizes[1],
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('does not render validation bar', () => {
      cy.window().then(() => {
        cy.get('@card').then(() => {
          cy.dataCy('card-offer').click();
          // dialog
          cy.dataCy('dialog-offer').should('be.visible');
          // validation
          cy.dataCy('offer-validation').should('not.exist');
        });
      });
    });
  });

  context('desktop without voucher code and voucher link', () => {
    beforeEach(() => {
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.wrap(listCardsPrizes[1]).as('card');
        cy.mount(CardOffer, {
          props: {
            card: listCardsPrizes[1],
          },
        });
        cy.viewport('macbook-16');
      });
    });

    it('does not render voucher link', () => {
      cy.window().then(() => {
        cy.get('@card').then(() => {
          cy.dataCy('card-offer').click();
          // dialog
          cy.dataCy('dialog-offer').should('be.visible');
          // voucher
          cy.dataCy('dialog-voucher-title').should('not.exist');
          cy.dataCy('dialog-voucher-code').should('not.exist');
          // link
          cy.dataCy('dialog-offer-link').should('not.exist');
        });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('listCardsPrizes').then((listCardsPrizes) => {
        cy.wrap(listCardsPrizes[0]).as('card');
        cy.mount(CardOffer, {
          props: {
            card: listCardsPrizes[0],
          },
        });
        cy.viewport('iphone-6');
      });
    });

    it('shows modal with one column', () => {
      cy.window().then(() => {
        cy.dataCy('card-offer').click();
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-left'), 100);
        cy.testElementPercentageWidth(cy.dataCy('dialog-col-right'), 100);
      });
    });
  });
});

function coreTests() {
  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer')
        .should('be.visible')
        .and('have.css', 'border-radius', borderRadiusCard);
    });
  });

  it('has border', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer').should(
        'have.css',
        'border',
        '1px solid rgba(0, 0, 0, 0.12)',
      );
    });
  });

  it('has no shadow', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer').should('have.css', 'box-shadow', 'none');
    });
  });

  it('renders title', () => {
    cy.window().then(() => {
      cy.get('@card').then((card) => {
        cy.dataCy('card-title')
          .should('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', grey10)
          .then(($el) => {
            const textContent = $el.text();
            cy.stripHtmlTags(card.title).then((text) => {
              expect(textContent).to.contain(text);
            });
          });
      });
    });
  });

  it('renders icon', () => {
    cy.window().then(() => {
      cy.get('@card').then((card) => {
        cy.dataCy('card-icon')
          .should('be.visible')
          .and('have.class', card.icon)
          .and('have.css', 'height', '48px')
          .and('have.css', 'width', '48px')
          .and('have.color', primary);
      });
    });
  });

  it('shows modal dialog on click', () => {
    cy.window().then(() => {
      cy.get('@card').then((card) => {
        cy.dataCy('card-offer').click();
        // dialog
        cy.dataCy('dialog-offer').should('be.visible');
        // metadata
        cy.dataCy('dialog-metadata-item')
          .should('be.visible')
          .and('have.length', card.metadata.length);
        cy.dataCy('dialog-metadata-item')
          .first()
          .should('contain', card.metadata[0].text);
        // header
        cy.dataCy('dialog-header')
          .find('h3')
          .should('be.visible')
          .and('have.css', 'font-size', '20px')
          .and('have.css', 'font-weight', '500')
          .then(($el) => {
            const textContent = $el.text();
            cy.stripHtmlTags(card.title).then((text) => {
              expect(textContent).to.contain(text);
            });
          });
        // content
        cy.dataCy('dialog-body')
          .should('be.visible')
          .and('have.css', 'font-size', '14px')
          .and('have.css', 'font-weight', '400')
          .and('have.color', black)
          .and('contain', card.content);
        // voucher
        cy.dataCy('dialog-voucher-title')
          .should('be.visible')
          .and('contain', i18n.global.t('index.cardOffer.titleVoucherCode'));
        cy.dataCy('dialog-voucher-code')
          .should('be.visible')
          .and('contain', card.voucher);
        // image
        cy.dataCy('dialog-body').scrollTo('bottom', {
          ensureScrollable: false,
        });
        cy.dataCy('dialog-body')
          .find('img')
          .should('be.visible')
          .then(($img) => {
            cy.testImageHeight($img);
            expect($img.attr('src')).to.equal(card.image.src);
          });
        cy.matchImageSnapshotWithHiddenScrollbars(
          'dialog-body',
          0.5,
          'percent',
        );
      });
    });
  });

  it('has correct background color', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer')
        .should('be.visible')
        .and('have.backgroundColor', white);
    });
  });
}
