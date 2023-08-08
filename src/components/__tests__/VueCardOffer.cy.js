import VueCardOffer from 'components/VueCardOffer.vue';
import { i18n } from '../../boot/i18n';

describe('<VueCardOffer>', () => {
  const title = '100 CZK voucher do e-shopu Automatu';
  const expirationDate = 'Platí po dobu výzvy (1. říj.–31. říj. 2022)';
  const issuer = 'Automat';
  const image = 'https://picsum.photos/id/200/380/380';
  const code = '65972834';
  const link = {
    title: 'Navštívit e-shop',
    url: '#',
    target: '_blank',
  };
  const icon = 'pedal_bike';
  const content =
    'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu, včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.';

  beforeEach(() => {
    cy.mount(VueCardOffer, {
      props: {
        card: {
          title,
          expirationDate,
          issuer,
          image,
          code,
          link,
          icon,
          content,
        },
      },
    });
    cy.viewport('iphone-6');
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['unlimitedExpirationDate', 'offerCode'],
      'index.cardOffer',
      i18n
    );
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer')
        .should('be.visible')
        .should('have.css', 'border-radius', '20px');
    });
  });

  it('has border', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer').should(
        'have.css',
        'border',
        '1px solid rgba(0, 0, 0, 0.12)'
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
      cy.dataCy('card-title')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('have.color', '#212121')
        .should('contain', title)
        .then(($title) => {
          expect($title.text()).to.equal(title);
        });
    });
  });

  it('renders icon', () => {
    cy.window().then(() => {
      cy.dataCy('card-icon')
        .should('be.visible')
        .should('contain', icon)
        .should('have.css', 'height', '48px')
        .should('have.css', 'width', '48px')
        .should('have.color', 'rgb(176, 190, 197)');
    });
  });

  it('has correct background color', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer')
        .should('be.visible')
        .should('have.backgroundColor', '#ffffff');
    });
  });

  it('shows modal dialog on click', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer')
        .click()
        .then(() => {
          cy.dataCy('card-dialog').should('be.visible');
        });
    });
  });

  it('shows modal with title', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer')
        .click()
        .then(() => {
          cy.dataCy('dialog-header')
            .find('h3')
            .should('be.visible')
            .should('have.css', 'font-size', '20px')
            .should('have.css', 'font-weight', '500')
            .should('contain', title)
            .then(($title) => {
              expect($title.text()).to.equal(title);
            });
        });
    });
  });

  it('shows modal content', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer')
        .click()
        .then(() => {
          cy.dataCy('dialog-body')
            .should('be.visible')
            .should('have.css', 'font-size', '14px')
            .should('have.css', 'font-weight', '400')
            .should('have.color', '#000000')
            .should('contain', content);
        });
    });
  });

  it('shows modal image', () => {
    cy.window().then(() => {
      cy.dataCy('card-offer')
        .click()
        .then(() => {
          cy.dataCy('dialog-body')
            .scrollTo('bottom')
            .find('img')
            .should('be.visible')
            .then(($img) => {
              const naturalHeight = $img[0].naturalHeight;
              expect(naturalHeight).to.be.greaterThan(0);
              expect($img.attr('src')).to.equal(image);
            });

          cy.dataCy('dialog-body').find('img').matchImageSnapshot({
            failureThreshold: 0.5,
            failureThresholdType: 'percent',
          });
        });
    });
  });
});
