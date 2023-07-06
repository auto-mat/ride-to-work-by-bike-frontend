import VueCardEvent from 'components/VueCardEvent.vue';
import { i18n } from '../../boot/i18n';

describe('<VueCardEvent>', () => {
  const title = 'Opening Ceremony Bike to Work 2022';
  const thumbnail = 'https://picsum.photos/340/200';
  const image = 'https://picsum.photos/380/380';
  const dates = new Date('2023-10-01T12:00:00');
  const location = 'Prague';
  const content =
    'We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle! You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams. Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony. We will also announce the traditional Brno cycling employer of the year.<br />The main prize will be a City Bike HERKA from our partner Cyklospeciality.<br />We are looking forward to seeing you!';
  const links = [
    'meet.google.com/anr-pvfs-opf',
    'meet.google.com/anr-pvfs-opf',
  ];
  const icons = [
    'event',
    'location',
  ]

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

  it('has translation for all strings', () => {
    const translationStrings = ['addToCalendar'];

    const translationKeyList = translationStrings.map(
      (item) => `index.cardEvent.${item}`
    );

    translationKeyList.forEach((translationKey) => {
      const defaultEnglishString = i18n.global.t(translationKey, 'en');

      const locales = i18n.global.availableLocales;
      locales
        .filter((locale) => locale !== 'en')
        .forEach((locale) => {
          i18n.global.locale = locale;
          const translatedString = i18n.global.t(translationKey);

          cy.wrap(translatedString)
            .should('be.a', 'string')
            .and('not.equal', defaultEnglishString);
        });
    });
  });

  it('renders title with link', () => {
    cy.window().then(() => {
      cy.dataCy('card-title')
        .should('be.visible')
        .should('have.css', 'font-size', '16px')
        .should('have.css', 'font-weight', '700')
        .should('contain', title)
        .then(($title) => {
          expect($title.text()).to.equal(title);
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
        .should('have.backgroundColor', '#ffffff');
    });
  });

  it('renders date with icon', () => {
    cy.window().then(() => {
      cy.dataCy('card-dates')
        .should('be.visible')
        .should('have.css', 'font-size', '14px')
        .should('have.css', 'font-weight', '400')
        .should('contain', '1.')
        .should('contain', '2023')
        .should('contain', '12:00');

      cy.dataCy('card-dates')
        .find('i')
        .should('be.visible')
        .should('have.color', '#cfd8dc')
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
        .should('have.color', '#cfd8dc')
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
        .should('have.color', '#000000');
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
            .then(($title) => {
              expect($title.text()).to.equal(title);
            });

          cy.dataCy('dialog-meta')
          .should('be.visible')
          .should('have.css', 'font-size', '14px')
          .should('have.css', 'font-weight', '400')
          .should('have.color', '#546e7a')
          .each(($el, index, $list) => {
            if (index === 0) {
              cy.wrap($el)
                .should('contain', '1.')
                .should('contain', '2023')
                .should('contain', '12:00');

              const $icon = $el.find('i');
              if ($icon.length) {
                cy.wrap($icon)
                  .should('be.visible')
                  .should('have.color', '#b0bec5')
                  .should('have.css', 'width', '18px')
                  .should('have.css', 'height', '18px')
                  .should('contain', icons[index]);
              }
            }
            if (index === 1) {
              cy.wrap($el)
                .should('contain', location);

              const $icon = $el.find('i');
              if ($icon.length) {
                cy.wrap($icon)
                  .should('be.visible')
                  .should('have.color', '#b0bec5')
                  .should('have.css', 'width', '18px')
                  .should('have.css', 'height', '18px')
                  .should('contain', icons[index]);
              }
            }

          });
        });
    });
  });

  it('shows content with image and action button with correct layout', () => {
    cy.window().then(() => {
      cy.dataCy('card-link')
        .click()
        .then(() => {
          cy.dataCy('dialog-content')
            .should('be.visible')
            .should('contain', 'We want to reward you for your support')
            .should('have.css', 'font-size', '14px')
            .should('have.css', 'font-weight', '400');

          cy.dataCy('dialog-body')
            .scrollTo('bottom')
            .find('img')
            .should('be.visible')
            .then(($img) => {
              const naturalHeight = $img[0].naturalHeight;
              expect(naturalHeight).to.be.greaterThan(0);
              expect($img.attr('src')).to.equal(image);
            });

          cy.dataCy('dialog-body')
            .scrollTo('center')
            .find('.q-btn')
            .should('be.visible')
            .should('have.css', 'border-radius', '28px')
            .should('have.backgroundColor', '#000000')
            .should('have.color', '#ffffff')
            .should('contain', i18n.global.t('index.cardEvent.addToCalendar'));

          cy.viewport('iphone-6');

          cy.dataCy('dialog-body')
            .find('.col-12')
            .then(($element) => {
              expect(calculatePercentageWidth($element)).to.be.closeTo(
                100,
                0.5
              );
            });

          cy.viewport('macbook-13');

          cy.dataCy('dialog-body')
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
