import { colors } from 'quasar';
import QuestionnaireItem from 'components/profile/QuestionnaireItem.vue';
import { i18n } from '../../boot/i18n';

// colors
const { getPaletteColor } = colors;
const primary = getPaletteColor('primary');
const white = getPaletteColor('white');

// selectors
const questionnaireItem = 'questionnaire-item';
const questionnaireTitle = 'questionnaire-title';
const questionnaireButton = 'questionnaire-button';
const questionnaireButtonIcon = 'questionnaire-button-icon';
const questionnaireAvatar = 'questionnaire-avatar';
const questionnaireImage = 'questionnaire-image';

// variables
const avatarSize = 48;
const iconSize = 18;

describe('<QuestionnaireItem>', () => {
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

  context('desktop - target _blank', () => {
    beforeEach(() => {
      cy.wrap(questionnaires[0]).as('questionnaire');
      cy.get('@questionnaire').then((questionnaire) => {
        cy.mount(QuestionnaireItem, {
          props: {
            questionnaire: questionnaire,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();
    iconTests();
  });

  context('desktop - target _self', () => {
    beforeEach(() => {
      cy.wrap(questionnaires[1]).as('questionnaire');
      cy.get('@questionnaire').then((questionnaire) => {
        cy.mount(QuestionnaireItem, {
          props: {
            questionnaire: questionnaire,
          },
        });
      });
      cy.viewport('macbook-16');
    });

    coreTests();

    it('does not render an external link icon in the button', () => {
      cy.dataCy(questionnaireButtonIcon).should('not.exist');
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.wrap(questionnaires[0]).as('questionnaire');
      cy.get('@questionnaire').then((questionnaire) => {
        cy.mount(QuestionnaireItem, {
          props: {
            questionnaire: questionnaire,
          },
        });
      });
      cy.viewport('iphone-6');
    });

    coreTests();
    iconTests();
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(questionnaireItem).should('be.visible');
    });

    it('displays the questionnaire title', () => {
      cy.get('@questionnaire').then((questionnaire) => {
        cy.dataCy(questionnaireTitle)
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '400')
          .and('contain', questionnaire.title);
      });
    });

    it('renders the questionnaire image', () => {
      cy.get('@questionnaire').then((questionnaire) => {
        cy.dataCy(questionnaireAvatar)
          .should('be.visible')
          .invoke('height')
          .should('be.eq', avatarSize);
        cy.dataCy(questionnaireAvatar)
          .invoke('width')
          .should('be.eq', avatarSize);
        cy.dataCy(questionnaireImage)
          .find('img')
          .should('have.attr', 'src', questionnaire.image.src)
          .and('have.attr', 'alt', questionnaire.image.alt);
      });
    });

    it('renders a button with correct attributes and text', () => {
      cy.get('@questionnaire').then((questionnaire) => {
        cy.dataCy(questionnaireButton)
          .should('be.visible')
          .and('have.attr', 'href', questionnaire.link.url)
          .and('have.attr', 'target', questionnaire.link.target)
          .and('contain', i18n.global.t('profile.buttonFillQuestionnaire'));
      });
    });

    it('applies correct styles to the component', () => {
      cy.dataCy(questionnaireItem)
        .should('have.css', 'padding', '16px')
        .and('have.backgroundColor', white);
    });
  }

  function iconTests() {
    it('renders an external link icon in the button', () => {
      cy.dataCy(questionnaireButtonIcon)
        .should('be.visible')
        .and('have.color', primary);
      cy.dataCy(questionnaireButtonIcon)
        .invoke('height')
        .should('be.eq', iconSize);
      cy.dataCy(questionnaireButtonIcon)
        .invoke('width')
        .should('be.eq', iconSize);
    });
  }
});
