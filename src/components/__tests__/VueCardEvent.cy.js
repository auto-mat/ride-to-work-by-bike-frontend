import { hexToRgb } from 'app/test/cypress/utils';
import VueCardEvent from 'components/VueCardEvent.vue';

describe('<VueCardEvent>', () => {
  const title = 'Opening Ceremony Bike to Work 2022';
  const thumbnail = 'https://picsum.photos/340/200';
  const image = 'https://picsum.photos/380/380';
  const dates = new Date('Sun Oct 01 2023 12:00:00 GMT+0200');
  const location = 'Prague';
  const content =
    'We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle! You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams. Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony. We will also announce the traditional Brno cycling employer of the year.<br />The main prize will be a City Bike HERKA from our partner Cyklospeciality.<br />We are looking forward to seeing you!';
  const links = [
    'meet.google.com/anr-pvfs-opf',
    'meet.google.com/anr-pvfs-opf',
  ];

  beforeEach(() => {
    cy.mount(VueCardEvent, {
      props: {
        card: {
          title,
          thumbnail,
          image,
          dates,
          location,
          content,
          links,
        },
      },
    });
  });

  it('renders title with link', () => {
    cy.window().then(() => {
      cy.dataCy('card-title')
        .should('be.visible')
        .should('have.css', 'font-size', '16px')
        .should('have.css', 'font-weight', '700')
        .should('contain', title)
        .then((titleNode) => {
          expect(titleNode.text()).to.equal(title);
        });

      cy.dataCy('card-link')
        .should('be.visible')
        .should('have.attr', 'href', '#');
    });
  });

  it('renders image', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .find('img')
        .should('be.visible')
        .then(($img) => {
          const naturalHeight = $img[0].naturalHeight;
          expect(naturalHeight).to.be.greaterThan(0);
          expect($img.attr('src')).to.equal(thumbnail);
        });
    });
  });

  it('has correct background color', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .should('be.visible')
        .should('have.css', 'background-color', hexToRgb('#ffffff'));
    });
  });

  it('renders date with icon', () => {
    cy.window().then(() => {
      cy.dataCy('card-dates')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('contain', 'Sun 1. Oct. 2023, 12:00');

      cy.dataCy('card-dates')
        .find('i')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb('#cfd8dc'))
        .should('contain', 'event');
    });
  });

  it('renders location with icon', () => {
    cy.window().then(() => {
      cy.dataCy('card-location')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('contain', location);

      cy.dataCy('card-location')
        .find('i')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb('#cfd8dc'))
        .should('contain', 'place');
    });
  });

  it('renders calendar button with an icon', () => {
    cy.window().then(() => {
      cy.dataCy('calendar-button')
        .should('be.visible')
        .should('have.css', 'height', '42px')
        .should('have.css', 'width', '42px');

      cy.dataCy('calendar-button')
        .find('i')
        .should('be.visible')
        .should('have.css', 'color', hexToRgb('#000000'));
    });
  });

  it('has rounded corners', () => {
    cy.window().then(() => {
      cy.dataCy('card')
        .should('be.visible')
        .should('have.css', 'border-radius', '20px');
    });
  });

  it('renders responsive content', () => {
    let parentWidth;

    cy.viewport('iphone-6');

    cy.dataCy('card-section')
      .should('be.visible')
      .then(($parentElement) => {
        parentWidth = $parentElement[0].clientWidth;

        cy.dataCy('card-image').then(($element) => {
          expect(calculatePercentageWidth($element, parentWidth)).to.be.closeTo(
            100,
            0.5
          );
        });

        cy.dataCy('card-content').then(($element) => {
          expect(calculatePercentageWidth($element, parentWidth)).to.be.closeTo(
            100,
            0.5
          );
        });
      });

    cy.viewport('macbook-13');

    cy.dataCy('card-section')
      .should('be.visible')
      .then(($parentElement) => {
        parentWidth = $parentElement[0].clientWidth;

        cy.dataCy('card-image').then(($element) => {
          expect(calculatePercentageWidth($element, parentWidth)).to.be.closeTo(
            100,
            0.5
          );
        });

        cy.dataCy('card-content').then(($element) => {
          expect(calculatePercentageWidth($element, parentWidth)).to.be.closeTo(
            100,
            0.5
          );
        });
      });
  });

  it('shows modal dialog on click', () => {
    cy.window().then(() => {
      cy.dataCy('card-link')
        .click()
        .then(() => {
          cy.dataCy('card-dialog').should('be.visible');
        });
    });
  });

  it('shows modal title, location and date', () => {
    cy.window().then(() => {
      cy.dataCy('card-link')
        .click()
        .then(() => {
          cy.dataCy('dialog-header')
            .find('h3')
            .should('be.visible')
            .should('have.css', 'font-size', '20px')
            .should('have.css', 'font-weight', '500')
            .should('contain', title)
            .then((titleNode) => {
              expect(titleNode.text()).to.equal(title);
            });

          cy.dataCy('dialog-header')
            .find('h3')
            .should('be.visible')
            .should('have.css', 'font-size', '20px')
            .should('have.css', 'font-weight', '500')
            .should('contain', title)
            .then((titleNode) => {
              expect(titleNode.text()).to.equal(title);
            });

          cy.dataCy('dialog-dates')
            .should('be.visible')
            .should('have.css', 'font-size', '14px')
            .should('have.css', 'font-weight', '400')
            .should('contain', 'Sun 1. Oct. 2023, 12:00');

          cy.dataCy('dialog-dates')
            .find('i')
            .should('be.visible')
            .should('have.css', 'color', hexToRgb('#cfd8dc'))
            .should('contain', 'event');

          cy.dataCy('dialog-location')
            .should('be.visible')
            .should('have.css', 'font-size', '14px')
            .should('have.css', 'font-weight', '400')
            .should('contain', location);

          cy.dataCy('dialog-location')
            .find('i')
            .should('be.visible')
            .should('have.css', 'color', hexToRgb('#cfd8dc'))
            .should('contain', 'place');
        });
    });
  });

  it('shows content with image and action button with correct layout', () => {
    cy.window().then(() => {
      cy.dataCy('card-link')
        .click()
        .then(() => {
          cy.dataCy('dialog-text')
            .should('be.visible')
            .should('contain', 'We want to reward you for your support')
            .should('have.css', 'font-size', '14px')
            .should('have.css', 'font-weight', '400');

          cy.dataCy('dialog-content')
            .scrollTo('bottom')
            .find('img')
            .should('be.visible')
            .then(($img) => {
              const naturalHeight = $img[0].naturalHeight;
              expect(naturalHeight).to.be.greaterThan(0);
              expect($img.attr('src')).to.equal(image);
            });

          cy.dataCy('dialog-content')
            .scrollTo('center')
            .find('.q-btn')
            .should('be.visible')
            .should('have.css', 'border-radius', '28px')
            .should('have.css', 'background-color', hexToRgb('#000000'))
            .should('have.css', 'color', hexToRgb('#ffffff'))
            .should('contain', 'Add to calendar');

          cy.viewport('iphone-6');

          cy.dataCy('dialog-content')
            .find('.col-12')
            .then(($element) => {
              expect(calculatePercentageWidth($element)).to.be.closeTo(
                100,
                0.5
              );
            });

          cy.viewport('macbook-13');

          cy.dataCy('dialog-content')
            .find('.col-12')
            .first()
            .then(($element) => {
              expect(calculatePercentageWidth($element)).to.be.closeTo(50, 0.5);
            });
        });
    });
  });

  function calculatePercentageWidth($element, width) {
    const elementWidth = $element[0].clientWidth;
    const parentWidth = width ? width : $element[0].parentNode.clientWidth;
    return (elementWidth / parentWidth) * 100;
  }
});
