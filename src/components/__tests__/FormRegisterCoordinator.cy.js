import { colors } from 'quasar';
import FormRegisterCoordinator from 'components/FormRegisterCoordinator.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormRegisterCoordinator>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'title',
        'labelFirstName',
        'labelLastName',
        'labelJobTitle',
        'labelJobTitleShort',
        'labelEmail',
        'labelPhone',
        'labelPassword',
        'labelPasswordConfirm',
        'labelResponsibility',
        'labelTerms',
        'linkTerms',
        'buttonSubmit',
        'messageFieldRequired',
        'messageEmailInvalid',
        'messagePhoneInvalid',
        'messagePasswordStrong',
        'messagePasswordConfirmNotMatch',
        'hintPassword',
      ],
      'register.coordinator.form',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(FormRegisterCoordinator, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    it('renders title', () => {
      cy.window().then(() => {
        cy.dataCy('register-coordinator-form-title')
          .should('have.css', 'font-size', '16px')
          .and('have.css', 'font-weight', '700')
          .and('have.color', grey10)
          .and('contain', i18n.global.t('register.coordinator.form.title'))
          .then(($title) => {
            expect($title.text()).to.equal(
              i18n.global.t('register.coordinator.form.title'),
            );
          });
      });
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(FormRegisterCoordinator, {
        props: {},
      });
      cy.viewport('iphone-6');
    });
  });
});
