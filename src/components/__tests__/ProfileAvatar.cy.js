import { createPinia, setActivePinia } from 'pinia';
import ProfileAvatar from 'components/profile/ProfileAvatar.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useAvatarStore } from '../../stores/avatar';
import {
  httpCreatedSuccessfullStatus,
  httpNoContentSuccessfullStatus,
} from '../../../test/cypress/support/commonTests';

const avatarDetailUrl = 'https://example.com/avatar-detail/';
const avatarUrl = 'https://example.com/new-avatar-raw.jpg';
const exampleDomainUrl = 'https://example.com/*';

describe('<ProfileAvatar>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      [
        'buttonUploadPhoto',
        'buttonRemovePhoto',
        'titleUpdatePhoto',
        'titleDialogRemovePhoto',
        'labelRemovePhotoDescription',
        'messagePhotoInvalidFormat',
        'messagePhotoTooLarge',
      ],
      'profile',
      i18n,
    );
  });

  context('avatar already exists', () => {
    const avatarId = 22;
    const avatarUrl =
      'https://dpnk-test.s3.amazonaws.com/avatars/33669/resized/80/80/profile_2024_crop.png';

    beforeEach(() => {
      cy.viewport('macbook-16');
      setActivePinia(createPinia());
      // stub avatar image
      cy.intercept('GET', 'https://dpnk-test.s3.amazonaws.com/**', {
        fixture: 'route.jpg',
      });
      // stub new avatar image served after upload/replace
      cy.intercept('GET', exampleDomainUrl, {
        fixture: 'route.jpg',
      });
      cy.mount(ProfileAvatar, { props: {} });
      // set avatar in store
      cy.setAvatarStoreState(useAvatarStore, avatarId, avatarUrl);
    });

    it('renders the avatar image', () => {
      cy.dataCy('profile-avatar-img')
        .find('img')
        .invoke('attr', 'src')
        .should('eq', avatarUrl);
    });

    it('shows edit and remove buttons', () => {
      cy.dataCy('profile-avatar-edit-button').should('be.visible');
      cy.dataCy('profile-avatar-remove-button').should('be.visible');
    });

    it('opens edit dialog for file upload', () => {
      cy.dataCy('profile-avatar-edit-button').click();
      cy.dataCy('profile-avatar-dialog').should('be.visible');
      cy.dataCy('profile-avatar-dialog-save').should('be.disabled');
    });

    it('sends put request after file upload', () => {
      // intercept avatar replace
      cy.interceptAvatarApi({
        config: rideToWorkByBikeConfig,
        i18n: i18n,
        requestType: 'PUT',
        interceptAlias: 'putAvatar',
        avatarId: avatarId,
        body: {
          message: 'Successfully uploaded a new avatar.',
          data: {
            id: avatarId,
            avatar_url: avatarDetailUrl,
            avatar: avatarUrl,
            primary: true,
          },
        },
      });
      // intercept refetch after replace
      cy.fixture('apiGetAvatarList.json').then((avatarList) => {
        cy.interceptAvatarApi({
          config: rideToWorkByBikeConfig,
          i18n: i18n,
          requestType: 'GET',
          interceptAlias: 'getAvatarAfterReplace',
          body: avatarList,
        });
      });
      cy.interceptAvatarApi({
        config: rideToWorkByBikeConfig,
        i18n: i18n,
        requestType: 'GET',
        interceptUrlType: 'renderPrimary',
        interceptAlias: 'getAvatarRenderAfterReplace',
        body: { image_url: avatarUrl },
      });

      cy.dataCy('profile-avatar-edit-button').click();
      cy.dataCy('profile-avatar-input-file').selectFile(
        'test/cypress/fixtures/route.jpg',
        { force: true },
      );
      // file is not uploaded yet
      cy.get('@putAvatar.all').should('have.length', 0);
      cy.dataCy('profile-avatar-dialog-save').should('not.be.disabled');
      cy.dataCy('profile-avatar-dialog-save').click();
      cy.wait('@putAvatar');
      cy.wait('@getAvatarAfterReplace');
      cy.wait('@getAvatarRenderAfterReplace');
      cy.dataCy('profile-avatar-dialog').should('not.exist');
      cy.dataCy('profile-avatar-img')
        .find('img')
        .invoke('attr', 'src')
        .should('eq', avatarUrl);
    });

    it('does not send uploaded files if user cancels dialog', () => {
      cy.interceptAvatarApi({
        config: rideToWorkByBikeConfig,
        i18n: i18n,
        requestType: 'PUT',
        interceptAlias: 'putAvatar',
        avatarId: avatarId,
        body: {},
      });
      cy.dataCy('profile-avatar-edit-button').click();
      cy.dataCy('profile-avatar-input-file').selectFile(
        'test/cypress/fixtures/route.jpg',
        { force: true },
      );
      cy.dataCy('profile-avatar-dialog-cancel').click();
      cy.dataCy('profile-avatar-dialog').should('not.exist');
      cy.get('@putAvatar.all').should('have.length', 0);
      // on dialog reopen, file picker should be empty
      cy.dataCy('profile-avatar-edit-button').click();
      cy.dataCy('profile-avatar-dialog-save').should('be.disabled');
    });

    it('shows confirm dialog and removes avatar on confirm', () => {
      // intercept avatar delete
      cy.interceptAvatarApi({
        config: rideToWorkByBikeConfig,
        i18n: i18n,
        requestType: 'DELETE',
        interceptAlias: 'deleteAvatar',
        avatarId: avatarId,
        body: {},
        statusCode: httpNoContentSuccessfullStatus,
      });
      // intercept refetch after delete
      cy.fixture('apiGetAvatarDefault.json').then((defaultAvatar) => {
        cy.interceptAvatarApi({
          config: rideToWorkByBikeConfig,
          i18n: i18n,
          requestType: 'GET',
          interceptAlias: 'getAvatarAfterDelete',
          body: defaultAvatar,
        });
      });
      // click remove button and confirm
      cy.dataCy('profile-avatar-remove-button').click();
      cy.dataCy('profile-avatar-dialog-remove').should('be.visible');
      cy.dataCy('profile-avatar-dialog-remove-confirm').click();
      cy.wait('@deleteAvatar');
      cy.wait('@getAvatarAfterDelete');
      cy.dataCy('profile-avatar-dialog-remove').should('not.exist');
      cy.dataCy('profile-avatar-remove-button').should('not.exist');
    });

    it('does not delete if user cancels remove dialog', () => {
      cy.dataCy('profile-avatar-remove-button').click();
      cy.dataCy('profile-avatar-dialog-remove-cancel').click();
      cy.dataCy('profile-avatar-dialog-remove').should('not.exist');
    });
  });

  context('avatar is not set', () => {
    const defaultAvatarUrl =
      'https://www.gravatar.com/avatar/3aec98e9a73692849051404abcddc564/?s=80&d=mp';

    beforeEach(() => {
      cy.viewport('macbook-16');
      setActivePinia(createPinia());
      // stub new avatar image served after upload
      cy.intercept('GET', exampleDomainUrl, {
        fixture: 'route.jpg',
      });
      cy.mount(ProfileAvatar, { props: {} });
      // set fallback avatar state in store
      cy.setAvatarStoreState(useAvatarStore, null, defaultAvatarUrl);
    });

    it('shows fallback image and no remove button', () => {
      cy.dataCy('profile-avatar-img')
        .find('img')
        .invoke('attr', 'src')
        .should('eq', defaultAvatarUrl);
      cy.dataCy('profile-avatar-remove-button').should('not.exist');
    });

    it('sends uploaded file with POST', () => {
      cy.interceptAvatarApi({
        config: rideToWorkByBikeConfig,
        i18n: i18n,
        requestType: 'POST',
        interceptAlias: 'postAvatar',
        body: {
          message: 'Successfully uploaded a new avatar.',
          data: {
            id: 99,
            avatar_url: avatarDetailUrl,
            avatar: avatarUrl,
            primary: true,
          },
        },
        statusCode: httpCreatedSuccessfullStatus,
      });
      cy.fixture('apiGetAvatarList.json').then((avatarList) => {
        cy.interceptAvatarApi({
          config: rideToWorkByBikeConfig,
          i18n: i18n,
          requestType: 'GET',
          interceptAlias: 'getAvatarAfterUpload',
          body: avatarList,
        });
      });
      cy.interceptAvatarApi({
        config: rideToWorkByBikeConfig,
        i18n: i18n,
        requestType: 'GET',
        interceptUrlType: 'renderPrimary',
        interceptAlias: 'getAvatarRenderAfterUpload',
        body: { image_url: avatarUrl },
      });
      cy.dataCy('profile-avatar-edit-button').click();
      cy.dataCy('profile-avatar-input-file').selectFile(
        'test/cypress/fixtures/route.jpg',
        { force: true },
      );
      cy.dataCy('profile-avatar-dialog-save').click();
      cy.wait('@postAvatar');
      cy.wait('@getAvatarAfterUpload');
      cy.wait('@getAvatarRenderAfterUpload');
      cy.dataCy('profile-avatar-dialog').should('not.exist');
      cy.dataCy('profile-avatar-img')
        .find('img')
        .invoke('attr', 'src')
        .should('eq', avatarUrl);
    });
  });
});
