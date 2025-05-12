import { colors } from 'quasar';
import RegisterChallengeSummary from 'components/register/RegisterChallengeSummary.vue';
import { i18n } from '../../boot/i18n';
import { createPinia, setActivePinia } from 'pinia';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useLoginStore } from '../../stores/login';
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

// selectors
const selectorSummary = 'register-challenge-summary';
const selectorSummaryPersonal = 'summary-personal';
const selectorSummaryPersonalEmail = 'summary-personal-email';
const selectorSummaryPersonalName = 'summary-personal-name';
const selectorSummaryPersonalGender = 'summary-personal-gender';
const selectorSummaryParticipation = 'summary-participation';
const selectorSummaryParticipationTeam = 'summary-participation-team';
const selectorSummaryParticipationOrganization =
  'summary-participation-organization';
const selectorSummaryMerch = 'summary-merch';
const selectorSummaryMerchLabel = 'summary-merch-label';
const selectorSummaryMerchDescription = 'summary-merch-description';
const selectorSummaryDelivery = 'summary-delivery';
const selectorSummaryDeliveryAddress = 'summary-delivery-address';

// section selectors for iteration
const sectionSelectors = [
  selectorSummaryPersonal,
  selectorSummaryParticipation,
  selectorSummaryMerch,
  selectorSummaryDelivery,
];
// content selectors for iteration
const contentSelectors = [
  selectorSummaryPersonalEmail,
  selectorSummaryPersonalName,
  selectorSummaryPersonalGender,
  selectorSummaryParticipationTeam,
  selectorSummaryParticipationOrganization,
  selectorSummaryMerchLabel,
  selectorSummaryMerchDescription,
  selectorSummaryDeliveryAddress,
];

describe('<RegisterChallengeSummary>', () => {
  beforeEach(() => {
    // create and activate a fresh Pinia instance
    setActivePinia(createPinia());
    // we test with merchandise unavailable to make sure the merch is always shown
    cy.fixture('apiGetMerchandiseResponseUnavailable').then((response) => {
      cy.fixture('apiGetMerchandiseResponseUnavailableNext').then(
        (responseNext) => {
          cy.interceptMerchandiseGetApi(
            rideToWorkByBikeConfig,
            i18n,
            response,
            responseNext,
          );
        },
      );
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'labelGender',
        'textGender.male',
        'textGender.female',
        'titleDeliveryAddress',
        'titleStepSummary',
      ],
      'register.challenge',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(RegisterChallengeSummary, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(RegisterChallengeSummary, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy(selectorSummary).should('be.visible');
  });

  it('has correct typography and formatting for sections', () => {
    cy.wrap(useLoginStore()).then((loginStore) => {
      cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
        cy.initiateRegisterChallengeSummaryState(
          loginStore,
          registerChallengeStore,
        );
        // test heading typography for all sections
        sectionSelectors.forEach((selector) => {
          cy.dataCy(selector).within(() => {
            // check heading typography
            cy.get('h3')
              .should('have.css', 'font-size', '16px')
              .and('have.css', 'font-weight', '700')
              .and('have.color', grey10);
          });
          // check section spacing
          cy.dataCy(selector).should('have.class', 'q-mb-lg');
        });

        // check content formatting
        contentSelectors.forEach((selector) => {
          cy.dataCy(selector)
            .should('have.css', 'margin-top', '8px')
            .and('have.css', 'font-weight', '400')
            .and('have.css', 'font-size', '14px')
            .and('have.color', grey10);
        });
      });
    });
  });

  it('displays all content correctly', () => {
    cy.wrap(useLoginStore()).then((loginStore) => {
      cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
        cy.initiateRegisterChallengeSummaryState(
          loginStore,
          registerChallengeStore,
        );
        cy.fixture('loginResponse.json').then((loginData) => {
          // check personal details - email
          cy.dataCy(selectorSummaryPersonalEmail).should(
            'contain',
            loginData.user.email,
          );
        });
        cy.fixture('formPersonalDetails.json').then((formPersonalDetails) => {
          // check personal details - name
          cy.dataCy(selectorSummaryPersonalName).should(
            'contain',
            `${formPersonalDetails.firstName} ${formPersonalDetails.lastName}`,
          );
          // check personal details - gender
          cy.dataCy(selectorSummaryPersonalGender)
            .should('be.visible')
            .and(
              'contain',
              i18n.global.t(
                `register.challenge.textGender.${formPersonalDetails.gender}`,
              ),
            );
        });
        cy.fixture('formFieldCompany.json').then((formFieldCompany) => {
          // check participation - organization
          cy.dataCy(selectorSummaryParticipationOrganization).should(
            'contain',
            formFieldCompany.results[0].name,
          );
        });
        cy.fixture('apiGetSubsidiariesResponse.json').then(
          (apiGetSubsidiariesResponse) => {
            // check delivery - address
            cy.dataCy(selectorSummaryDeliveryAddress).should(
              'contain',
              apiGetSubsidiariesResponse.results[0].address.street,
            );
          },
        );
        cy.fixture('apiGetMerchandiseResponse.json').then(
          (apiGetMerchandiseResponse) => {
            // check merchandise - label
            cy.dataCy(selectorSummaryMerchLabel).should(
              'contain',
              apiGetMerchandiseResponse.results[0].name,
            );
            // check merchandise - description
            cy.dataCy(selectorSummaryMerchDescription).should(
              'contain',
              apiGetMerchandiseResponse.results[0].description,
            );
          },
        );
      });
    });
  });

  it("test only selected 'I dont't want any merchandise.' merchandise option", () => {
    cy.wrap(useLoginStore()).then((loginStore) => {
      cy.wrap(useRegisterChallengeStore()).then((registerChallengeStore) => {
        cy.initiateRegisterChallengeSummaryState(
          loginStore,
          registerChallengeStore,
          'apiGetFilteredMerchandiseByNicCodeResponse.json',
        );
        // check merchandise - label
        cy.dataCy(selectorSummaryMerchLabel).should(
          'contain',
          i18n.global.t('form.merch.labelNoMerch'),
        );
      });
    });
  });
}
