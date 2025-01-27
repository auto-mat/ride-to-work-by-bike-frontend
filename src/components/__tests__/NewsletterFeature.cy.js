import { createPinia, setActivePinia } from 'pinia';
import { colors } from 'quasar';
import NewsletterFeature from '../homepage/NewsletterFeature.vue';
import { i18n } from '../../boot/i18n';
import { defLocale } from '../../i18n/def_locale';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');
const primary = getPaletteColor('primary');

// selectors
const selectorSectionHeadingTitle = 'section-heading-title';
const selectorSectionHeadingPerex = 'section-heading-perex';
const selectorNewsletterFeatureImage = 'newsletter-feature-image';
const selectorNewsletterFeatureItem = 'newsletter-feature-item';
const selectorNewsletterFeatureSeparator = 'newsletter-feature-separator';
const selectorNewsletterColImage = 'newsletter-col-image';
const selectorNewsletterColContent = 'newsletter-col-content';

// variables
const fontSizeTitle = '24px';
const fontWeightBold = '700';
const fontSizePerex = '14px';
const fontWeightRegular = '400';
const marginMd = '16px';
const props = {
  title: 'Custom title',
  description: 'Custom description',
};

describe('<NewsletterFeature>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'aboutChallenges',
        'aboutEvents',
        'aboutMobility',
        'description',
        'following',
        'follow',
        'hint',
        'title',
      ],
      'index.newsletterFeature',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseGetRegisterChallenge) => {
          cy.fixture(
            'apiGetRegisterChallengeProfileUpdatedNewsletter.json',
          ).then((responsePostRegisterChallenge) => {
            // intercept GET API call register-challenge
            cy.interceptRegisterChallengeGetApi(
              rideToWorkByBikeConfig,
              defLocale,
              responseGetRegisterChallenge,
            );
            // intercept POST API call register-challenge
            cy.interceptRegisterChallengePutApi(
              rideToWorkByBikeConfig,
              defLocale,
              responseGetRegisterChallenge.results[0].personal_details.id,
              responsePostRegisterChallenge,
            );
          });
        },
      );
      cy.mount(NewsletterFeature, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('renders image', () => {
      cy.window().then(() => {
        cy.dataCy(selectorNewsletterFeatureImage)
          .should('be.visible')
          .find('img')
          .should('be.visible');
        cy.dataCy(selectorNewsletterFeatureImage).matchImageSnapshot({
          failureThreshold: 0.5,
          failureThresholdType: 'percent',
        });
      });
    });

    it('renders correct number of items', () => {
      cy.window().then(() => {
        cy.dataCy(selectorNewsletterFeatureItem)
          .should('have.length', 3)
          .each(($item) => {
            cy.wrap($item).should('be.visible');
          });
      });
    });

    it('renders divider between items', () => {
      cy.window().then(() => {
        cy.dataCy(selectorNewsletterFeatureSeparator)
          .should('be.visible')
          .and('have.length', 2)
          .and('have.css', 'margin-top', marginMd)
          .and('have.css', 'margin-bottom', marginMd);
      });
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(
          cy.dataCy(selectorNewsletterColImage),
          25,
        );
        cy.testElementPercentageWidth(
          cy.dataCy(selectorNewsletterColContent),
          75,
        );
      });
    });
  });

  context('desktop override props', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseGetRegisterChallenge) => {
          cy.fixture(
            'apiGetRegisterChallengeProfileUpdatedNewsletter.json',
          ).then((responsePostRegisterChallenge) => {
            // intercept GET API call register-challenge
            cy.interceptRegisterChallengeGetApi(
              rideToWorkByBikeConfig,
              defLocale,
              responseGetRegisterChallenge,
            );
            // intercept POST API call register-challenge
            cy.interceptRegisterChallengePutApi(
              rideToWorkByBikeConfig,
              defLocale,
              responseGetRegisterChallenge.results[0].personal_details.id,
              responsePostRegisterChallenge,
            );
          });
        },
      );
      cy.mount(NewsletterFeature, {
        props,
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.dataCy(selectorSectionHeadingTitle).should('contain', props.title);
    });

    it('renders description', () => {
      cy.dataCy(selectorSectionHeadingPerex).should(
        'contain',
        props.description,
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseGetRegisterChallenge) => {
          cy.fixture(
            'apiGetRegisterChallengeProfileUpdatedNewsletter.json',
          ).then((responsePostRegisterChallenge) => {
            // intercept GET API call register-challenge
            cy.interceptRegisterChallengeGetApi(
              rideToWorkByBikeConfig,
              defLocale,
              responseGetRegisterChallenge,
            );
            // intercept POST API call register-challenge
            cy.interceptRegisterChallengePutApi(
              rideToWorkByBikeConfig,
              defLocale,
              responseGetRegisterChallenge.results[0].personal_details.id,
              responsePostRegisterChallenge,
            );
          });
        },
      );
      cy.mount(NewsletterFeature, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();

    it('does not render image', () => {
      cy.window().then(() => {
        cy.dataCy(selectorNewsletterFeatureImage).should('not.be.visible');
      });
    });

    it('renders grid', () => {
      cy.window().then(() => {
        cy.testElementPercentageWidth(
          cy.dataCy(selectorNewsletterColContent),
          100,
        );
      });
    });
  });
});

function coreTests() {
  it('renders title', () => {
    cy.window().then(() => {
      cy.dataCy(selectorSectionHeadingTitle)
        .should('have.css', 'font-size', fontSizeTitle)
        .and('have.css', 'font-weight', fontWeightBold)
        .and('have.color', primary)
        .and('contain', i18n.global.t('index.newsletterFeature.title'))
        .then(($title) => {
          expect($title.text()).to.contain(
            i18n.global.t('index.newsletterFeature.title'),
          );
        });
    });
  });

  it('renders description', () => {
    cy.window().then(() => {
      cy.dataCy(selectorSectionHeadingPerex)
        .should('have.css', 'font-size', fontSizePerex)
        .and('have.css', 'font-weight', fontWeightRegular)
        .and('have.color', grey10)
        .and('contain', i18n.global.t('index.newsletterFeature.description'))
        .then(($title) => {
          expect($title.text()).to.contain(
            i18n.global.t('index.newsletterFeature.description'),
          );
        });
    });
  });

  it('loads newsletter settings from API', () => {
    cy.fixture('apiGetRegisterChallengeProfile.json').then(
      (responseRegisterChallenge) => {
        cy.fixture('apiGetRegisterChallengeProfileUpdatedNewsletter.json').then(
          (responseUpdated) => {
            cy.fixture(
              'apiGetRegisterChallengeProfileUpdatedNewsletterAll.json',
            ).then((responseUpdatedAll) => {
              // wait for register-challenge GET request
              cy.waitForRegisterChallengeGetApi(responseRegisterChallenge);
              // newsletter challenge is enabled
              cy.dataCy('newsletter-feature-item').each(($item) => {
                const dataId = $item.attr('data-id');
                if (dataId === 'challenge') {
                  cy.wrap($item)
                    .find('.q-toggle__inner')
                    .should('have.class', 'q-toggle__inner--truthy');
                } else {
                  cy.wrap($item)
                    .find('.q-toggle__inner')
                    .should('have.class', 'q-toggle__inner--falsy');
                }
              });
              // follow newsletter mobility
              cy.dataCy('newsletter-feature-item')
                .filter('[data-id="mobility"]')
                .find('.q-toggle__inner')
                .click();
              // override GET request for updated state
              cy.interceptRegisterChallengeGetApi(
                rideToWorkByBikeConfig,
                defLocale,
                responseUpdated,
              );
              // wait for PUT request
              cy.fixture(
                'apiPostRegisterChallengeNewsletterChallengeMobilityRequest.json',
              ).then((request) => {
                cy.waitForRegisterChallengePutApi(request);
              });
              // wait for GET request
              cy.waitForRegisterChallengeGetApi(responseUpdated);
              // verify button state changed
              cy.dataCy('newsletter-feature-item')
                .filter('[data-id="mobility"]')
                .find('.q-toggle__inner')
                .should('have.class', 'q-toggle__inner--truthy');
              // follow newsletter events
              cy.dataCy('newsletter-feature-item')
                .filter('[data-id="events"]')
                .find('.q-toggle__inner')
                .click();
              // override GET request for updated state
              cy.interceptRegisterChallengeGetApi(
                rideToWorkByBikeConfig,
                defLocale,
                responseUpdatedAll,
              );
              // wait for PUT request
              cy.fixture(
                'apiPostRegisterChallengeNewsletterAllRequest.json',
              ).then((request) => {
                cy.waitForRegisterChallengePutApi(request);
              });
              // wait for GET request
              cy.waitForRegisterChallengeGetApi(responseUpdatedAll);
              // verify button state changed
              cy.dataCy('newsletter-feature-item')
                .filter('[data-id="events"]')
                .find('.q-toggle__inner')
                .should('have.class', 'q-toggle__inner--truthy');
            });
          },
        );
      },
    );
  });
}
