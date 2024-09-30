import { colors } from 'quasar';
import ProfileDetails from 'components/profile/ProfileDetails.vue';
import { i18n } from '../../boot/i18n';
import { PaymentState } from '../../../src/components/types/Profile';

// colors
const { getPaletteColor } = colors;
const green = getPaletteColor('green');
const red = getPaletteColor('red');

// selectors
const selectorAddressDivision = 'profile-details-address-division';
const selectorDeliveryAddress = 'profile-details-delivery-address';
const selectorDownloadInvoice = 'profile-details-download-invoice';
const selectorEmail = 'profile-details-email';
const selectorFormEmail = 'profile-details-form-email';
const selectorFormGender = 'profile-details-form-gender';
const selectorFormNickname = 'profile-details-form-nickname';
const selectorGender = 'profile-details-gender';
const selectorLanguage = 'profile-details-language';
const selectorLanguageSwitcher = 'profile-details-language-switcher';
const selectorNickname = 'profile-details-nickname';
const selectorOrganizationType = 'profile-details-organization-type';
const selectorOrganization = 'profile-details-organization';
const selectorPackage = 'profile-details-package';
const selectorPackageLink = 'profile-details-package-link';
const selectorPaymentState = 'profile-details-payment-state';
const selectorPersonalDetails = 'profile-details';
const selectorPhone = 'profile-details-phone';
const selectorProfileCoordinatorContact = 'profile-coordinator-contact';
const selectorSize = 'profile-details-size';
const selectorState = 'profile-details-state';
const selectorTeam = 'profile-details-team';
const selectorAllowContactPhone = 'profile-allow-contact-phone';
const selectorTrackingNumber = 'profile-details-tracking-number';
const selectorTitleChallengeDetails = 'profile-title-challenge-details';
const selectorTitlePersonalDetails = 'profile-title-personal-details';
const selectorTitleRegistrationDetails = 'profile-title-registration-details';
const selectorTitleStarterPackage = 'profile-title-starter-package';
const dataSelectorAddressDisplay = '[data-cy="address-display"]';
const dataSelectorButtonCancel = '[data-cy="form-button-cancel"]';
const dataSelectorButtonSave = '[data-cy="form-button-save"]';
const dataSelectorEdit = '[data-cy="details-item-edit"]';
const dataSelectorEmpty = '[data-cy="details-item-empty"]';
const dataSelectorInput = '[data-cy="form-input"]';
const dataSelectorInputEmail = '[data-cy="form-email"]';
const dataSelectorInputPassword = '[data-cy="form-password"]';
const dataSelectorIconPaymentState =
  '[data-cy="profile-details-payment-state-icon"]';
const dataSelectorLabel = '[data-cy="details-item-label"]';
const dataSelectorValue = '[data-cy="details-item-value"]';

// variables
const newNickname = 'Cyklobaron';
const genderFemale = 'female';
const genderFemaleKey = 'global.woman';
const genderMale = 'male';
const genderMaleKey = 'global.man';
const newEmail = 'ride@dopracenakole.cz';
const password = 'password';

describe('<ProfileDetails>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonDownloadInvoice',
        'descriptionNickname',
        'labelAddressDivision',
        'labelAllowContactPhone',
        'labelDeliveryAddress',
        'labelEmail',
        'labelEmailEmpty',
        'labelGender',
        'labelGenderEmpty',
        'labelLanguage',
        'labelLanguageEmpty',
        'labelNickname',
        'labelNicknameEmpty',
        'labelNoValue',
        'labelOrganization',
        'labelOrganizationType',
        'labelPackage',
        'labelPaymentState',
        'labelPaymentStateNotPaid',
        'labelPaymentStatePaid',
        'labelPaymentStatePaidByCompany',
        'labelSize',
        'labelState',
        'labelTeam',
        'labelTrackingNumber',
        'titleChallengeDetails',
        'titlePersonalDetails',
        'titleUpdateEmail',
        'titleUpdateGender',
        'titleUpdateNickname',
        'titleRegistrationDetails',
      ],
      'profile',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.mount(ProfileDetails, {
        props: {},
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.mount(ProfileDetails, {
        props: {},
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    cy.fixture('formPersonalDetails').then((formPersonalDetails) => {
      // component
      cy.dataCy(selectorPersonalDetails).should('be.visible');
      // page title
      cy.dataCy(selectorTitlePersonalDetails)
        .should('be.visible')
        .within(() => {
          cy.dataCy('section-heading-title')
            .should('be.visible')
            .and('contain', i18n.global.t('profile.titlePersonalDetails'));
        });
      // row nickname
      cy.dataCy(selectorNickname).should('be.visible');
      // row email
      cy.dataCy(selectorEmail).should('be.visible');
      // row gender
      cy.dataCy(selectorGender).should('be.visible');
      // row language
      cy.dataCy(selectorLanguage).should('be.visible');
      cy.dataCy(selectorLanguageSwitcher).should('be.visible');

      // title challenge details
      cy.dataCy(selectorTitleChallengeDetails)
        .should('be.visible')
        .within(() => {
          cy.dataCy('section-heading-title')
            .should('be.visible')
            .and('contain', i18n.global.t('profile.titleChallengeDetails'));
        });
      // row organizationType
      cy.dataCy(selectorOrganizationType)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelOrganizationType'));
      cy.dataCy(selectorOrganizationType)
        .should('be.visible')
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.organizationType);
      // row organization
      cy.dataCy(selectorOrganization)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelOrganization'));
      cy.dataCy(selectorOrganization)
        .should('be.visible')
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.organization);
      // row address/division
      cy.dataCy(selectorAddressDivision)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelAddressDivision'));
      cy.dataCy(selectorAddressDivision)
        .find(dataSelectorAddressDisplay)
        .should('be.visible')
        .and('contain', formPersonalDetails.division.address.street)
        .and('contain', formPersonalDetails.division.address.houseNumber)
        .and('contain', formPersonalDetails.division.address.zip)
        .and('contain', formPersonalDetails.division.address.city)
        .and('contain', formPersonalDetails.division.address.cityChallenge);
      // row address/division
      cy.dataCy(selectorTeam)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelTeam'));
      cy.dataCy(selectorTeam)
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.team);

      // title challenge details
      cy.dataCy(selectorTitleStarterPackage)
        .should('be.visible')
        .within(() => {
          cy.dataCy('section-heading-title')
            .should('be.visible')
            .and('contain', i18n.global.t('profile.titleStarterPackage'));
        });
      // row package
      cy.dataCy(selectorPackage)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelPackage'));
      cy.dataCy(selectorPackage)
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.package.title);
      cy.dataCy(selectorPackageLink)
        .invoke('attr', 'href')
        .should('eq', formPersonalDetails.package.url);
      // row package
      cy.dataCy(selectorSize)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelSize'));
      cy.dataCy(selectorSize)
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.package.size);
      // row package
      cy.dataCy(selectorState)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelState'));
      cy.dataCy(selectorState)
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.package.state);
      // row tracking number
      cy.dataCy(selectorTrackingNumber)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelTrackingNumber'));
      cy.dataCy(selectorTrackingNumber)
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.package.trackingNumber);
      // delivery address
      cy.dataCy(selectorDeliveryAddress)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelDeliveryAddress'));
      cy.dataCy(selectorDeliveryAddress)
        .find(dataSelectorAddressDisplay)
        .should('be.visible')
        .and('contain', formPersonalDetails.deliveryAddress.department)
        .and('contain', formPersonalDetails.deliveryAddress.street)
        .and('contain', formPersonalDetails.deliveryAddress.houseNumber)
        .and('contain', formPersonalDetails.deliveryAddress.zip)
        .and('contain', formPersonalDetails.deliveryAddress.city)
        .and('contain', formPersonalDetails.deliveryAddress.cityChallenge);
      // phone
      cy.dataCy(selectorPhone)
        .find(dataSelectorLabel)
        .should('contain', i18n.global.t('profile.labelPhone'));
      cy.dataCy(selectorPhone)
        .find(dataSelectorValue)
        .should('contain', formPersonalDetails.phone);
      // contact participation
      cy.dataCy(selectorAllowContactPhone)
        .should('be.visible')
        .and('contain', i18n.global.t('profile.labelAllowContactPhone'));
      // coordinator contact
      cy.dataCy(selectorProfileCoordinatorContact).should('be.visible');
    });
  });

  it('allows to edit nickname', () => {
    cy.fixture('formPersonalDetails').then((personalDetails) => {
      // nickname value
      cy.dataCy(selectorNickname)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.nickname);
      // nickname edit button
      cy.dataCy(selectorNickname)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // nickname edit form
      cy.dataCy(selectorFormNickname).should('be.visible');
      // change nickname
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname).find(dataSelectorInput).type(newNickname);
      // cancel
      cy.dataCy(selectorFormNickname).find(dataSelectorButtonCancel).click();
      // nickname is the same
      cy.dataCy(selectorNickname)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.nickname);
      // change nickname
      cy.dataCy(selectorNickname)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname).find(dataSelectorInput).type(newNickname);
      // save
      cy.dataCy(selectorFormNickname).find(dataSelectorButtonSave).click();
      // nickname is different
      cy.dataCy(selectorNickname)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', newNickname);
      // delete nickname
      cy.dataCy(selectorNickname)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname).find(dataSelectorButtonSave).click();
      // nickname is empty
      cy.dataCy(selectorNickname).find(dataSelectorValue).should('not.exist');
      cy.dataCy(selectorPersonalDetails)
        .find(dataSelectorEmpty)
        .should('be.visible')
        .and('have.text', i18n.global.t('profile.labelNicknameEmpty'));
      // reset nickname
      cy.dataCy(selectorNickname)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormNickname)
        .find(dataSelectorInput)
        .type(personalDetails.nickname);
      // save (enter)
      cy.dataCy(selectorFormNickname).find(dataSelectorInput).type('{enter}');
      // nickname is original value
      cy.dataCy(selectorNickname).find(dataSelectorEmpty).should('not.exist');
      cy.dataCy(selectorNickname)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.nickname);
    });
  });

  it('allows to edit email', () => {
    cy.fixture('formPersonalDetails').then((personalDetails) => {
      // email value
      cy.dataCy(selectorEmail)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.email);
      // email edit button
      cy.dataCy(selectorEmail)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // email edit form
      cy.dataCy(selectorFormEmail).should('be.visible');
      // change email
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputEmail)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormEmail).find(dataSelectorInputEmail).type(newEmail);
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputPassword)
        .type(password);
      // cancel
      cy.dataCy(selectorFormEmail).find(dataSelectorButtonCancel).click();
      // email is the same
      cy.dataCy(selectorEmail)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.email);
      // change email
      cy.dataCy(selectorEmail)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputEmail)
        .should('be.visible')
        .clear();
      cy.dataCy(selectorFormEmail).find(dataSelectorInputEmail).type(newEmail);
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputPassword)
        .type(password);
      // save
      cy.dataCy(selectorFormEmail).find(dataSelectorButtonSave).click();
      // email is different
      cy.dataCy(selectorEmail)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', newEmail);
      // deleting email is not possible
      cy.dataCy(selectorEmail)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      cy.dataCy(selectorFormEmail)
        .should('be.visible')
        .find(dataSelectorInputEmail)
        .clear();
      cy.dataCy(selectorFormEmail).find(dataSelectorButtonSave).click();
      cy.dataCy(selectorFormEmail).should('be.visible');
      // fill in original email
      cy.dataCy(selectorFormEmail)
        .should('be.visible')
        .find(dataSelectorInputEmail)
        .type(personalDetails.email);
      // cannot save without password
      cy.dataCy(selectorFormEmail).find(dataSelectorButtonSave).click();
      cy.dataCy(selectorFormEmail).should('be.visible');
      // fill in password
      cy.dataCy(selectorFormEmail)
        .find(dataSelectorInputPassword)
        .type(password);
      // save (enter)
      cy.dataCy(selectorFormEmail).find(dataSelectorInputEmail).type('{enter}');
      cy.dataCy(selectorEmail)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.email);
    });
  });

  it('allows to edit gender', () => {
    cy.fixture('formPersonalDetails').then((personalDetails) => {
      // gender value
      cy.dataCy(selectorGender)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.gender);
      // gender edit button
      cy.dataCy(selectorGender)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // gender edit form
      cy.dataCy(selectorFormGender).should('be.visible');
      // change gender to woman
      cy.dataCy(selectorFormGender)
        .find('.q-radio__label')
        .contains(i18n.global.t(genderFemaleKey))
        .click();
      // cancel
      cy.dataCy(selectorFormGender).find(dataSelectorButtonCancel).click();
      // gender stays the same (male)
      cy.dataCy(selectorGender)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', personalDetails.gender);
      // gender edit button
      cy.dataCy(selectorGender)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // gender edit form
      cy.dataCy(selectorFormGender).should('be.visible');
      // change gender
      cy.dataCy(selectorFormGender)
        .find('.q-radio__label')
        .contains(i18n.global.t(genderFemaleKey))
        .click();
      // save
      cy.dataCy(selectorFormGender).find(dataSelectorButtonSave).click();
      // gender is different
      cy.dataCy(selectorGender)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', genderFemale);
      // reset gender
      cy.dataCy(selectorGender)
        .find(dataSelectorEdit)
        .should('be.visible')
        .click();
      // gender edit form
      cy.dataCy(selectorFormGender).should('be.visible');
      // change gender
      cy.dataCy(selectorFormGender)
        .find('.q-radio__label')
        .contains(i18n.global.t(genderMaleKey))
        .click();
      // save
      cy.dataCy(selectorFormGender).find(dataSelectorButtonSave).click();
      // gender is male
      cy.dataCy(selectorGender)
        .find(dataSelectorValue)
        .should('be.visible')
        .and('have.text', genderMale);
    });
  });

  it('renders registration details section', () => {
    cy.fixture('formPersonalDetails').then((formPersonalDetails) => {
      // title
      cy.dataCy(selectorTitleRegistrationDetails)
        .should('be.visible')
        .within(() => {
          cy.dataCy('section-heading-title')
            .should('be.visible')
            .and('contain', i18n.global.t('profile.titleRegistrationDetails'));
        });
      // payment state
      cy.dataCy(selectorPaymentState)
        .find(dataSelectorLabel)
        .should('be.visible');
      if (formPersonalDetails.paymentState === PaymentState.paid) {
        cy.dataCy(selectorPaymentState)
          .find(dataSelectorValue)
          .should('contain', i18n.global.t('profile.labelPaymentStatePaid'));
        cy.dataCy(selectorPaymentState)
          .find(dataSelectorIconPaymentState)
          .should('be.visible')
          .and('have.color', green);
      } else if (
        formPersonalDetails.paymentState === PaymentState.paidByCompany
      ) {
        cy.dataCy(selectorPaymentState)
          .find(dataSelectorValue)
          .should(
            'contain',
            i18n.global.t('profile.labelPaymentStatePaidByCompany'),
          );
        cy.dataCy(selectorPaymentState)
          .find(dataSelectorIconPaymentState)
          .should('be.visible')
          .and('have.color', green);
      } else {
        cy.dataCy(selectorPaymentState)
          .find(dataSelectorValue)
          .should('contain', i18n.global.t('profile.labelPaymentStateNotPaid'));
        cy.dataCy(selectorPaymentState)
          .find(dataSelectorIconPaymentState)
          .should('be.visible')
          .and('have.color', red);
      }
      // download invoice button
      cy.dataCy(selectorDownloadInvoice)
        .should('be.visible')
        .and('contain', i18n.global.t('profile.buttonDownloadInvoice'));
    });
  });
}
