import { createPinia, setActivePinia } from 'pinia';
import ProfileAvatar from 'components/profile/ProfileAvatar.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import {
  getPhotoApiUrl,
  getRegisterChallengeApiUrl,
} from '../../../test/cypress/utils';

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

  context('photo already exists', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      setActivePinia(createPinia());
      // stub photo
      cy.intercept('GET', 'https://example.com/*', {
        fixture: 'route.jpg',
      });
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          cy.interceptRegisterChallengeGetApi(
            rideToWorkByBikeConfig,
            i18n,
            responseRegisterChallenge,
          );
        },
      );
      cy.mount(ProfileAvatar, { props: {} });
      // set photo in store
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          cy.setPhotoStoreState(
            useRegisterChallengeStore,
            responseRegisterChallenge.results[0].personal_details.photo,
          );
        },
      );
    });

    it('renders the photo image', () => {
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          const photo =
            responseRegisterChallenge.results[0].personal_details.photo;
          cy.dataCy('profile-avatar-img')
            .find('img')
            .invoke('attr', 'src')
            .should('eq', photo.url);
        },
      );
    });

    it('shows edit and remove buttons on the avatar', () => {
      cy.dataCy('profile-avatar-edit-button').should('be.visible');
      cy.dataCy('profile-avatar-remove-button').should('be.visible');
    });

    it('opens edit dialog with a disabled save button until a file is staged', () => {
      cy.dataCy('profile-avatar-edit-button').click();
      cy.dataCy('profile-avatar-dialog').should('be.visible');
      cy.dataCy('profile-avatar-dialog-save').should('be.disabled');
    });

    it('uploads staged file only after confirming with save', () => {
      // intercept photo upload
      cy.intercept('POST', getPhotoApiUrl(rideToWorkByBikeConfig, i18n), {
        statusCode: 201,
        body: { id: 99, url: 'https://example.com/new-photo.jpg' },
      }).as('postPhoto');
      // intercept GET register challenge after upload
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          const responseWithNewPhoto = JSON.parse(
            JSON.stringify(responseRegisterChallenge),
          );
          responseWithNewPhoto.results[0].personal_details.photo = {
            id: 99,
            url: 'https://example.com/new-photo.jpg',
          };
          // create unique alias for reliable comparison
          cy.intercept(
            'GET',
            getRegisterChallengeApiUrl(rideToWorkByBikeConfig, i18n),
            {
              statusCode: 200,
              body: responseWithNewPhoto,
            },
          ).as('getRegisterChallengeAfterUpload');
        },
      );
      cy.dataCy('profile-avatar-edit-button').click();
      cy.dataCy('profile-avatar-input-file').selectFile(
        'test/cypress/fixtures/route.jpg',
        { force: true },
      );
      // file is not uploaded yet
      cy.get('@postPhoto.all').should('have.length', 0);
      cy.dataCy('profile-avatar-dialog-save').should('not.be.disabled');
      cy.dataCy('profile-avatar-dialog-save').click();
      cy.wait('@postPhoto');
      cy.wait('@getRegisterChallengeAfterUpload');
      cy.dataCy('profile-avatar-dialog').should('not.exist');
      cy.dataCy('profile-avatar-img')
        .find('img')
        .invoke('attr', 'src')
        .should('eq', 'https://example.com/new-photo.jpg');
    });

    it('discards the staged file when the dialog is closed via cancel', () => {
      // intercept photo upload
      cy.intercept('POST', getPhotoApiUrl(rideToWorkByBikeConfig, i18n), {
        statusCode: 201,
        body: { id: 99, url: 'https://example.com/new-photo.jpg' },
      }).as('postPhoto');
      // upload file
      cy.dataCy('profile-avatar-edit-button').click();
      cy.dataCy('profile-avatar-input-file').selectFile(
        'test/cypress/fixtures/route.jpg',
        { force: true },
      );
      cy.dataCy('profile-avatar-dialog-cancel').click();
      cy.dataCy('profile-avatar-dialog').should('not.exist');
      cy.get('@postPhoto.all').should('have.length', 0);
      // on dialog reopen, file picker should be empty
      cy.dataCy('profile-avatar-edit-button').click();
      cy.dataCy('profile-avatar-dialog-save').should('be.disabled');
    });

    it('shows confirm dialog and removes photo on confirm', () => {
      // intercept photo delete
      cy.intercept(
        'DELETE',
        `${getPhotoApiUrl(rideToWorkByBikeConfig, i18n)}42`,
        {
          statusCode: 204,
          body: {},
        },
      ).as('deletePhoto');
      // intercept GET register challenge after delete
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          const noPhotoResponse = JSON.parse(
            JSON.stringify(responseRegisterChallenge),
          );
          noPhotoResponse.results[0].personal_details.photo = null;
          // create unique alias for reliable comparison
          cy.intercept(
            'GET',
            getRegisterChallengeApiUrl(rideToWorkByBikeConfig, i18n),
            {
              statusCode: 200,
              body: noPhotoResponse,
            },
          ).as('getRegisterChallengeAfterDelete');
        },
      );
      // click remove button and confirm
      cy.dataCy('profile-avatar-remove-button').click();
      cy.dataCy('profile-avatar-dialog-remove').should('be.visible');
      cy.dataCy('profile-avatar-dialog-remove-confirm').click();
      cy.wait('@deletePhoto');
      cy.wait('@getRegisterChallengeAfterDelete');
      cy.dataCy('profile-avatar-dialog-remove').should('not.exist');
      cy.dataCy('profile-avatar-remove-button').should('not.exist');
    });

    it('closes remove confirm dialog on cancel without deleting', () => {
      cy.dataCy('profile-avatar-remove-button').click();
      cy.dataCy('profile-avatar-dialog-remove-cancel').click();
      cy.dataCy('profile-avatar-dialog-remove').should('not.exist');
    });
  });

  context('photo is not set', () => {
    beforeEach(() => {
      cy.viewport('macbook-16');
      setActivePinia(createPinia());
      cy.fixture('apiGetRegisterChallengeProfile.json').then(
        (responseRegisterChallenge) => {
          responseRegisterChallenge.results[0].personal_details.photo = null;
          cy.interceptRegisterChallengeGetApi(
            rideToWorkByBikeConfig,
            i18n,
            responseRegisterChallenge,
          );
        },
      );
      cy.mount(ProfileAvatar, { props: {} });
      // set photo in store
      cy.setPhotoStoreState(useRegisterChallengeStore, null);
    });

    it('shows placeholder image and no remove button', () => {
      cy.dataCy('profile-avatar-img')
        .find('img')
        .invoke('attr', 'src')
        .should('contain', 'profile-placeholder');
      cy.dataCy('profile-avatar-remove-button').should('not.exist');
    });
  });
});
