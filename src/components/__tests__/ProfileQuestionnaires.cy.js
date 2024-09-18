import { colors } from 'quasar';
import ProfileQuestionnaires from 'components/profile/ProfileQuestionnaires.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');

// selectors
const selectorProfileQuestionnaire = 'profile-questionnaires';
const selectorQuestionnaireItem = 'questionnaire-item';
const selectorQuestionnaireTitle = 'questionnaire-title';
const selectorQuestionnaireButton = 'questionnaire-button';
const selectorQuestionnaireButtonIcon = 'questionnaire-button-icon';

// variables
const iconSize = 18;

describe('<ProfileQuestionnaires>', () => {
  let questionnaires;

  before(() => {
    cy.fixture('listQuestionnaires').then((fixtureData) => {
      questionnaires = fixtureData;
    });
  });

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['buttonFillQuestionnaire'],
      'profile',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ProfileQuestionnaires, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ProfileQuestionnaires, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(selectorProfileQuestionnaire).should('be.visible');
    });

    it('renders correct number of questionnaire items', () => {
      cy.dataCy(selectorQuestionnaireItem).should(
        'have.length',
        questionnaires.length,
      );
    });

    it('displays correct title and button URL for each questionnaire item', () => {
      questionnaires.forEach((questionnaire, index) => {
        cy.dataCy(selectorQuestionnaireItem)
          .eq(index)
          .within(() => {
            cy.dataCy(selectorQuestionnaireTitle).should(
              'contain',
              questionnaire.title,
            );

            cy.dataCy(selectorQuestionnaireButton)
              .should('have.attr', 'href', questionnaire.link.url)
              .and('have.attr', 'target', questionnaire.link.target);

            if (questionnaire.link.target === '_blank') {
              cy.dataCy(selectorQuestionnaireButtonIcon)
                .should('be.visible')
                .and('have.color', primary);
              cy.dataCy(selectorQuestionnaireButtonIcon)
                .invoke('height')
                .should('be.eq', iconSize);
              cy.dataCy(selectorQuestionnaireButtonIcon)
                .invoke('width')
                .should('be.eq', iconSize);
            } else {
              cy.dataCy(selectorQuestionnaireButtonIcon).should('not.exist');
            }
          });
      });
    });

    it('renders button link with correct text for each item', () => {
      cy.dataCy(selectorQuestionnaireButton).each(($button) => {
        cy.wrap($button).should(
          'contain',
          i18n.global.t('profile.buttonFillQuestionnaire'),
        );
      });
    });
  }
});
