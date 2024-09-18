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

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(QuestionnaireItem, {
        props: {
          questionnaire: questionnaires[0],
        },
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(QuestionnaireItem, {
        props: {
          questionnaire: questionnaires[0],
        },
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });

  function coreTests() {
    it('renders component', () => {
      cy.dataCy(questionnaireItem).should('be.visible');
    });

    it('displays the questionnaire title', () => {
      cy.dataCy(questionnaireTitle)
        .should('have.css', 'font-size', '16px')
        .and('have.css', 'font-weight', '400')
        .and('contain', questionnaires[0].title);
    });

    it('renders the questionnaire image', () => {
      cy.dataCy(questionnaireAvatar)
        .should('be.visible')
        .invoke('height')
        .should('be.eq', avatarSize);
      cy.dataCy(questionnaireAvatar)
        .invoke('width')
        .should('be.eq', avatarSize);
      cy.dataCy(questionnaireImage)
        .find('img')
        .should('have.attr', 'src', questionnaires[0].image.src)
        .and('have.attr', 'alt', questionnaires[0].image.alt);
    });

    it('renders a button with correct attributes and text', () => {
      cy.dataCy(questionnaireButton)
        .should('be.visible')
        .and('have.attr', 'href', questionnaires[0].link.url)
        .and('have.attr', 'target', questionnaires[0].link.target)
        .and('contain', i18n.global.t('profile.buttonFillQuestionnaire'));
    });

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

    it('applies correct styles to the component', () => {
      cy.dataCy(questionnaireItem)
        .should('have.css', 'padding', '16px')
        .and('have.backgroundColor', white);
    });
  }
});
