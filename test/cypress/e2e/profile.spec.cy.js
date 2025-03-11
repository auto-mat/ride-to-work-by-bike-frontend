import { routesConf } from '../../../src/router/routes_conf';
import { testDesktopSidebar } from '../support/commonTests';
import { defLocale } from '../../../src/i18n/def_locale';
import { getGenderLabel } from '../../../src/utils/get_gender_label';

// selectors
const classSelectorToggleInner = '.q-toggle__inner';
const classSelectorToggleInnerFalsy = 'q-toggle__inner--falsy';
const classSelectorToggleInnerTruthy = 'q-toggle__inner--truthy';
const selectorProfilePage = 'profile-page';
const selectorProfilePageTitle = 'profile-page-title';
const selectorNickname = 'profile-details-nickname';
const selectorEmail = 'profile-details-email';
const selectorGender = 'profile-details-gender';
const selectorFormNickname = 'profile-details-form-nickname';
const selectorFormEmail = 'profile-details-form-email';
const selectorFormGender = 'profile-details-form-gender';
const selectorTelephone = 'profile-details-phone';
const selectorTelephoneOptIn = 'profile-details-telephone-opt-in';
const dataSelectorEdit = '[data-cy="details-item-edit"]';
const dataSelectorInput = '[data-cy="form-input"]';
const dataSelectorInputEmail = '[data-cy="form-email-input"]';
const dataSelectorInputPassword = '[data-cy="form-password"]';
const dataSelectorButtonSave = '[data-cy="form-button-save"]';
const dataSelectorValue = '[data-cy="details-item-value"]';

const selectorQDrawer = 'q-drawer';
const selectorButtonNotifications = 'profile-tabs-button-notifications';
const selectorPanelNotifications = 'profile-tabs-panel-notifications';
const selectorDrawerButtonNotifications = 'button-notifications';
const selectorNotificationsDialog = 'notifications-dialog';
const selectorNotificationItem = 'notification-item-';
const selectorNotificationIcon = 'notification-icon-';
const selectorNotificationRow = 'notification-row-';
const selectorNotificationState = 'notification-state';
const selectorNotificationsCountBadge = 'notifications-count-badge';
const selectorDialogCloseButton = 'dialog-close';
const selectorButtonMarkAllAsRead = 'button-mark-all-as-read';
const selectorTeam = 'profile-details-team';

// variables
const password = '123456a';
const genderFemaleKey = 'global.woman';

describe('Profile page', () => {
  beforeEach(() => {
    cy.task('getAppConfig', process).then((config) => {
      cy.wrap(config).as('config');
      // intercept register challenge API
      cy.fixture('refreshTokensResponseChallengeActive').then(
        (refreshTokensResponseChallengeActive) => {
          cy.fixture('loginRegisterResponseChallengeActive').then(
            (loginRegisterResponseChallengeActive) => {
              cy.interceptLoginRefreshAuthTokenVerifyEmailVerifyCampaignPhaseApi(
                config,
                defLocale,
                loginRegisterResponseChallengeActive,
                null,
                refreshTokensResponseChallengeActive,
                null,
                { has_user_verified_email_address: true },
              );
            },
          );
        },
      );
      // intercept register challenge API
      cy.fixture('apiGetRegisterChallengeProfile').then(
        (responseRegisterChallenge) => {
          cy.interceptRegisterChallengeGetApi(
            config,
            defLocale,
            responseRegisterChallenge,
          );

          // intercept has organization admin API
          cy.fixture('apiGetHasOrganizationAdminResponseFalse').then(
            (responseHasOrganizationAdmin) => {
              cy.interceptHasOrganizationAdminGetApi(
                config,
                defLocale,
                responseRegisterChallenge.results[0].organization_id,
                responseHasOrganizationAdmin,
              );
            },
          );
          // intercept subsidiaries API
          cy.interceptSubsidiariesGetApi(
            config,
            defLocale,
            responseRegisterChallenge.results[0].organization_id,
          );
          // intercept teams API
          cy.fixture('apiGetTeamsResponse').then((teamsResponse) => {
            cy.fixture('apiGetTeamsResponseNextFullTeam').then(
              (teamsResponseNextFullTeam) => {
                cy.interceptTeamsGetApi(
                  config,
                  defLocale,
                  responseRegisterChallenge.results[0].subsidiary_id,
                  teamsResponse,
                  teamsResponseNextFullTeam,
                );
              },
            );
          });
          cy.interceptMyTeamGetApi(config, defLocale);
          // intercept my team PUT API
          cy.interceptMyTeamPutApi(
            config,
            defLocale,
            responseRegisterChallenge.results[0].team_id,
          );
        },
      );
    });
  });

  context('desktop', () => {
    beforeEach(() => {
      // visit profile page
      cy.visit('#' + routesConf['profile']['children']['fullPath']);
      cy.viewport('macbook-16');
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
    });

    coreTests();
    testDesktopSidebar();
  });

  context('change email', () => {
    beforeEach(() => {
      // go to login page
      cy.visit('#' + routesConf['login']['children']['fullPath']);
      // login
      cy.fillAndSubmitLoginForm();
      // wait for homepage to load
      cy.dataCy('index-title').should('be.visible');
      // go to profile page
      cy.visit('#' + routesConf['profile']['children']['fullPath']);
      cy.viewport('macbook-16');
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
    });

    it('allows user to change email', () => {
      cy.fixture('loginRegisterResponseChallengeActive.json').then(
        (loginRegisterResponseChallengeActive) => {
          cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
            cy.fixture('apiGetRegisterChallengeProfileUpdatedEmail.json').then(
              (responseEmail) => {
                cy.get('@config').then((config) => {
                  cy.get('@i18n').then((i18n) => {
                    // wait for GET request
                    cy.waitForRegisterChallengeGetApi(response);
                    const personalDetails =
                      response.results[0].personal_details;
                    const newEmail =
                      responseEmail.results[0].personal_details.email;
                    // email value
                    cy.dataCy(selectorEmail)
                      .find(dataSelectorValue)
                      .should('have.text', personalDetails.email);
                    // email edit button
                    cy.dataCy(selectorEmail).find(dataSelectorEdit).click();
                    // email edit form
                    cy.dataCy(selectorFormEmail).should('be.visible');
                    // change email
                    cy.dataCy(selectorFormEmail)
                      .find(dataSelectorInputEmail)
                      .clear();
                    cy.dataCy(selectorFormEmail)
                      .find(dataSelectorInputEmail)
                      .type(newEmail);
                    // password
                    cy.dataCy(selectorFormEmail)
                      .find(dataSelectorInputPassword)
                      .type(password);
                    // intercept login API for checking the password
                    cy.interceptLoginApi(
                      config,
                      i18n,
                      loginRegisterResponseChallengeActive,
                    );
                    // intercept POST request
                    cy.interceptRegisterChallengePutApi(
                      config,
                      i18n,
                      personalDetails.id,
                      responseEmail,
                    );
                    // override intercept GET request
                    cy.interceptRegisterChallengeGetApi(
                      config,
                      i18n,
                      responseEmail,
                    );
                    // save
                    cy.dataCy('profile-details-form-email')
                      .find(dataSelectorButtonSave)
                      .click();
                    // confirm password
                    cy.wait('@loginRequest');
                    // update register-challenge
                    cy.wait('@putRegisterChallenge');
                    // re-authenticate
                    cy.wait('@loginRequest');
                    // email is different
                    cy.dataCy(selectorEmail)
                      .find(dataSelectorValue)
                      .should('have.text', newEmail);
                  });
                });
              },
            );
          });
        },
      );
    });
  });

  context('desktop - user team state is "undecided"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        // intercept my team API
        cy.fixture('apiGetMyTeamResponseUndecided.json').then(
          (responseMyTeam) => {
            cy.interceptMyTeamGetApi(config, defLocale, responseMyTeam);
          },
        );
      });
      cy.visit('#' + routesConf['profile']['children']['fullPath']);
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
      cy.viewport('macbook-16');
    });

    it('shows banner team member "undecided" state', () => {
      cy.testBannerTeamMemberUndecidedState();
    });
  });

  context('desktop - user team state is "approved"', () => {
    beforeEach(() => {
      cy.task('getAppConfig', process).then((config) => {
        cy.wrap(config).as('config');
        // intercept my team GET API
        cy.fixture('apiGetMyTeamResponseApproved.json').then(
          (responseMyTeam) => {
            cy.interceptMyTeamGetApi(config, defLocale, responseMyTeam);
          },
        );
      });
      cy.visit('#' + routesConf['profile']['children']['fullPath']);
      // alias i18n
      cy.window().should('have.property', 'i18n');
      cy.window().then((win) => {
        cy.wrap(win.i18n).as('i18n');
      });
      cy.viewport('macbook-16');
    });

    it('shows banner team member "approved" state', () => {
      cy.testBannerTeamMemberApprovedState();
    });

    it('allows user to approve a single member', () => {
      cy.testApproveSingleTeamMember();
    });

    it('allows user to approve max number of members and reject the rest', () => {
      cy.testApproveMaxTeamMembers();
    });
  });
});

function coreTests() {
  it('has translation for all strings', () => {
    cy.get('@i18n').then((i18n) => {
      cy.testLanguageStringsInContext(['titleProfile'], 'profile', i18n);
    });
  });

  it('renders page', () => {
    cy.get('@i18n').then((i18n) => {
      cy.dataCy(selectorProfilePage).should('be.visible');
      // title
      cy.dataCy(selectorProfilePageTitle)
        .should('be.visible')
        .and('contain', i18n.global.t('profile.titleProfile'));
    });
  });

  it('allows user to change nickname, gender and telephone opt-in', () => {
    cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
      cy.fixture('apiGetRegisterChallengeProfileUpdatedNickname.json').then(
        (responseNickname) => {
          cy.fixture('apiGetRegisterChallengeProfileUpdatedGender.json').then(
            (responseGender) => {
              cy.fixture(
                'apiGetRegisterChallengeProfileUpdatedTelephoneOptIn.json',
              ).then((responseTelephoneOptIn) => {
                cy.get('@config').then((config) => {
                  cy.get('@i18n').then((i18n) => {
                    // wait for GET request
                    cy.waitForRegisterChallengeGetApi(response);
                    const personalDetails =
                      response.results[0].personal_details;
                    const newNickname =
                      responseNickname.results[0].personal_details.nickname;
                    // change nickname
                    cy.dataCy(selectorNickname).find(dataSelectorEdit).click();
                    cy.dataCy(selectorFormNickname)
                      .find(dataSelectorInput)
                      .clear();
                    cy.dataCy(selectorFormNickname)
                      .find(dataSelectorInput)
                      .type(newNickname);
                    // intercept POST request
                    cy.interceptRegisterChallengePutApi(
                      config,
                      i18n,
                      personalDetails.id,
                      responseNickname,
                    );
                    // override intercept GET request
                    cy.interceptRegisterChallengeGetApi(
                      config,
                      i18n,
                      responseNickname,
                    );
                    // submit form
                    cy.dataCy(selectorFormNickname)
                      .find(dataSelectorButtonSave)
                      .click();
                    // wait for GET request
                    cy.waitForRegisterChallengeGetApi(responseNickname);
                    cy.dataCy(selectorNickname)
                      .find(dataSelectorValue)
                      .should('have.text', newNickname);
                    // change gender
                    cy.dataCy(selectorGender).find(dataSelectorEdit).click();
                    cy.dataCy(selectorFormGender)
                      .find('.q-radio__label')
                      .contains(i18n.global.t(genderFemaleKey))
                      .click();
                    // intercept POST request
                    cy.interceptRegisterChallengePutApi(
                      config,
                      i18n,
                      personalDetails.id,
                      responseGender,
                    );
                    // override intercept GET request
                    cy.interceptRegisterChallengeGetApi(
                      config,
                      i18n,
                      responseGender,
                    );
                    cy.dataCy(selectorFormGender)
                      .find(dataSelectorButtonSave)
                      .click();
                    cy.dataCy(selectorGender)
                      .find(dataSelectorValue)
                      .should(
                        'have.text',
                        getGenderLabel(
                          responseGender.results[0].personal_details.sex,
                          i18n,
                        ),
                      );
                    // telephone opt-in value
                    cy.dataCy(selectorTelephoneOptIn)
                      .find(classSelectorToggleInner)
                      .should('have.class', classSelectorToggleInnerFalsy);
                    // intercept POST request
                    cy.interceptRegisterChallengePutApi(
                      config,
                      i18n,
                      personalDetails.id,
                      responseTelephoneOptIn,
                    );
                    // override intercept GET request
                    cy.interceptRegisterChallengeGetApi(
                      config,
                      i18n,
                      responseTelephoneOptIn,
                    );
                    // change telephone opt-in
                    cy.dataCy(selectorTelephoneOptIn).click();
                    // should be checked
                    cy.dataCy(selectorTelephoneOptIn)
                      .find(classSelectorToggleInner)
                      .should('have.class', classSelectorToggleInnerTruthy);
                  });
                });
              });
            },
          );
        },
      );
    });
  });

  it('allows user to change telephone', () => {
    cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
      cy.fixture('apiGetRegisterChallengeProfileUpdatedTelephone.json').then(
        (responseTelephone) => {
          cy.get('@config').then((config) => {
            cy.get('@i18n').then((i18n) => {
              // wait for GET request
              cy.waitForRegisterChallengeGetApi(response);
              const personalDetails = response.results[0].personal_details;
              const newTelephone =
                responseTelephone.results[0].personal_details.telephone;
              // telephone value
              cy.dataCy(selectorTelephone)
                .find(dataSelectorValue)
                .should('have.text', personalDetails.telephone);
              // telephone edit button
              cy.dataCy(selectorTelephone).find(dataSelectorEdit).click();
              // telephone edit form
              cy.dataCy('profile-details-form-phone').should('be.visible');
              // intercept POST request
              cy.interceptRegisterChallengePutApi(
                config,
                i18n,
                personalDetails.id,
                responseTelephone,
              );
              // override intercept GET request
              cy.interceptRegisterChallengeGetApi(
                config,
                i18n,
                responseTelephone,
              );
              // change telephone
              cy.dataCy('profile-details-form-phone').find('input').clear();
              cy.dataCy('profile-details-form-phone')
                .find('input')
                .type(newTelephone);
              // save
              cy.dataCy('profile-details-form-phone')
                .find(dataSelectorButtonSave)
                .click();
              // wait for GET request
              cy.waitForRegisterChallengeGetApi(responseTelephone);
              // telephone value
              cy.dataCy(selectorTelephone)
                .find(dataSelectorValue)
                .should('have.text', newTelephone);
            });
          });
        },
      );
    });
  });

  it('allows user to change team', () => {
    cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
      cy.fixture('apiGetRegisterChallengeProfileUpdatedTeam.json').then(
        (responseNew) => {
          cy.get('@config').then((config) => {
            cy.get('@i18n').then((i18n) => {
              // wait for GET request
              cy.waitForRegisterChallengeGetApi(response);
              cy.waitForMyTeamGetApi();
              cy.fixture('apiGetTeamsResponse').then((teamsResponse) => {
                cy.fixture('apiGetTeamsResponseNextFullTeam').then(
                  (teamsResponseNextFullTeam) => {
                    cy.waitForTeamsGetApi(
                      teamsResponse,
                      teamsResponseNextFullTeam,
                    );
                  },
                );
              });
              // team value is read from teams array
              cy.fixture('apiGetTeamsResponse.json').then(
                (apiGetTeamsResponse) => {
                  cy.dataCy(selectorTeam)
                    .find(dataSelectorValue)
                    .should('contain', apiGetTeamsResponse.results[0].name);
                  // click edit team button
                  cy.dataCy(selectorTeam)
                    .find(dataSelectorEdit)
                    .should('be.visible')
                    .click();
                  // verify change team dialog title
                  cy.contains(i18n.global.t('profile.titleUpdateTeam')).should(
                    'be.visible',
                  );
                  // verify team edit form
                  cy.dataCy('profile-details-form-team').should('be.visible');
                  // intercept POST request
                  cy.interceptRegisterChallengePutApi(
                    config,
                    i18n,
                    response.results[0].personal_details.id,
                    responseNew,
                  );
                  // override intercept GET request
                  cy.interceptRegisterChallengeGetApi(
                    config,
                    i18n,
                    responseNew,
                  );
                  // change team to new value
                  cy.dataCy('profile-details-form-team')
                    .find('.q-field__append')
                    .should('be.visible')
                    .click();
                  // select new team
                  cy.contains(apiGetTeamsResponse.results[1].name)
                    .should('be.visible')
                    .click();
                  // save
                  cy.dataCy('profile-details-form-team')
                    .find(dataSelectorButtonSave)
                    .click();
                  // refetch data about teams to validate change
                  cy.waitForMyTeamGetApi();
                  cy.fixture('apiGetTeamsResponse').then((teamsResponse) => {
                    cy.fixture('apiGetTeamsResponseNextFullTeam').then(
                      (teamsResponseNextFullTeam) => {
                        cy.waitForTeamsGetApi(
                          teamsResponse,
                          teamsResponseNextFullTeam,
                        );
                      },
                    );
                  });
                  cy.waitForRegisterChallengeGetApi(responseNew);
                  // team is different
                  cy.dataCy(selectorTeam)
                    .find(dataSelectorValue)
                    .should('contain', apiGetTeamsResponse.results[1].name);
                },
              );
            });
          });
        },
      );
    });
  });

  it("does not allow to change team if new team's max team members is reached", () => {
    cy.fixture('apiGetRegisterChallengeProfile.json').then((response) => {
      cy.fixture('apiGetRegisterChallengeProfileUpdatedTeam.json').then(
        (responseNew) => {
          cy.get('@config').then((config) => {
            cy.get('@i18n').then((i18n) => {
              // wait for GET request
              cy.waitForRegisterChallengeGetApi(response);
              cy.waitForMyTeamGetApi();
              cy.fixture('apiGetTeamsResponse').then((teamsResponse) => {
                cy.fixture('apiGetTeamsResponseNextFullTeam').then(
                  (teamsResponseNextFullTeam) => {
                    cy.waitForTeamsGetApi(
                      teamsResponse,
                      teamsResponseNextFullTeam,
                    );
                    const teamsResults = [
                      ...teamsResponse.results,
                      ...teamsResponseNextFullTeam.results,
                    ];
                    // team value is read from teams array
                    cy.fixture('apiGetTeamsResponse.json').then(() => {
                      // initial team name
                      cy.dataCy(selectorTeam)
                        .find(dataSelectorValue)
                        .should('contain', teamsResults[0].name);
                      // click edit team button
                      cy.dataCy(selectorTeam)
                        .find(dataSelectorEdit)
                        .should('be.visible')
                        .click();
                      // verify change team dialog title
                      cy.contains(
                        i18n.global.t('profile.titleUpdateTeam'),
                      ).should('be.visible');
                      // verify team edit form
                      cy.dataCy('profile-details-form-team').should(
                        'be.visible',
                      );
                      // intercept POST request
                      cy.interceptRegisterChallengePutApi(
                        config,
                        i18n,
                        response.results[0].personal_details.id,
                        responseNew,
                      );
                      // override intercept GET request
                      cy.interceptRegisterChallengeGetApi(
                        config,
                        i18n,
                        responseNew,
                      );
                      // change team to new value
                      cy.dataCy('profile-details-form-team')
                        .find('.q-field__append')
                        .should('be.visible')
                        .click();
                      // select new FULL team
                      cy.contains(teamsResults[2].name)
                        .should('be.visible')
                        .click();
                      // save
                      cy.dataCy('profile-details-form-team')
                        .find(dataSelectorButtonSave)
                        .click();
                      // refetch data about teams to validate change
                      cy.waitForMyTeamGetApi();
                      cy.fixture('apiGetTeamsResponse').then(
                        (teamsResponse) => {
                          cy.fixture('apiGetTeamsResponseNextFullTeam').then(
                            (teamsResponseNextFullTeam) => {
                              cy.waitForTeamsGetApi(
                                teamsResponse,
                                teamsResponseNextFullTeam,
                              );
                            },
                          );
                        },
                      );
                      // show error message - full team
                      cy.contains(
                        i18n.global.t(
                          'postRegisterChallenge.messageTeamMaxMembersReached',
                        ),
                      ).should('be.visible');
                      // team is the same (despite previously overriding GET request)
                      cy.dataCy(selectorTeam)
                        .find(dataSelectorValue)
                        .should('contain', teamsResults[0].name);
                    });
                  },
                );
              });
            });
          });
        },
      );
    });
  });

  it.skip('navigates to notifications tab and marks a notification as read', () => {
    cy.fixture('notifications').then((notifications) => {
      cy.get('@i18n').then((i18n) => {
        // open notifications tab
        cy.dataCy(selectorButtonNotifications).click();
        cy.dataCy(selectorPanelNotifications).should('be.visible');
        // open dialog (button selector is scoped in sidebar - repeats on mobile)
        cy.dataCy(selectorQDrawer).within(() => {
          cy.dataCy(selectorDrawerButtonNotifications).click();
        });
        cy.dataCy(selectorNotificationsDialog).should('be.visible');
        // mark first dialog item as read
        const firstUnreadNotificationId = notifications.filter(
          (notification) => notification.unread === true,
        )[0].id;
        // same item has state "unread" in table
        cy.dataCy(
          `${selectorNotificationRow}${firstUnreadNotificationId}`,
        ).within(() => {
          cy.dataCy(selectorNotificationState).should(
            'contain',
            i18n.global.t('notifications.labelUnread'),
          );
        });
        // click the notification icon
        cy.dataCy(
          `${selectorNotificationItem}${firstUnreadNotificationId}`,
        ).within(() => {
          cy.dataCy(
            `${selectorNotificationIcon}${firstUnreadNotificationId}`,
          ).click();
        });
        // item disappears from dialog
        cy.dataCy(
          `${selectorNotificationItem}${firstUnreadNotificationId}`,
        ).should('not.exist');
        // same item has state "read" in table
        cy.dataCy(
          `${selectorNotificationRow}${firstUnreadNotificationId}`,
        ).within(() => {
          cy.dataCy(selectorNotificationState).should(
            'contain',
            i18n.global.t('notifications.labelRead'),
          );
        });
        cy.dataCy(selectorDialogCloseButton).click();
        // mark all notifications as read
        cy.dataCy(selectorButtonMarkAllAsRead).click();
        // badge disappears
        cy.dataCy(selectorQDrawer).within(() => {
          cy.dataCy(selectorNotificationsCountBadge).should('not.exist');
        });
      });
    });
  });
}
