export interface ConfigGlobal {
  colorPrimary: string;
  colorPrimaryDark: string;
  colorPrimaryOpacity: number;
  colorSecondary: string;
  colorGray: string;
  colorGrayLight: string;
  colorGrayMiddle: string;
  colorWhite: string;
  colorBlack: string;
  colorRed: string;
  colorCustomFormFieldValidationErr: string;
  colorSecondaryBackgroundOpacity: number;
  colorWhiteBackgroundOpacity: number;
  colorWhiteBorderOpacity: number;
  image: string;
  width: string;
  title: string;
  subtitle: string;
  dataReportIframeHeight: string;
  borderRadiusCard: string;
  borderRadiusCardSmall: string;
  borderRadiusButtonSmall: string;
  maxWidthBanner: string;
  contactEmail: string;
  urlAutoMat: string;
  urlAppStore: string;
  urlBlog: string;
  urlContact: string;
  urlDonate: string;
  urlFacebook: string;
  urlFacebookRideToWorkByBike: string;
  urlFaq: string;
  urlGooglePlay: string;
  urlHelpdesk: string;
  urlInstagram: string;
  urlProjectSourceCode: string;
  urlRideToWorkByBike: string;
  urlRideToWorkByBikeOldFrontendDjangoApp: string;
  urlRideToWorkByBikeOldFrontendDjangoAppAdmin: string;
  urlTwitter: string;
  urlVideoLoggingRoutes: string;
  urlVideoOnboarding: string;
  urlFreeSoftwareDefinition: string;
  urlYoutube: string;
  urlSizeConversionChart: string;
  urlStravaPrivacyZones: string;
  challengeMonth: 'may' | 'october' | 'september';
  containerFormWidth: string;
  containerContentWidth: string;
  challengeStartDate: string;
  challengeLoggingWindowDays: number;
  defaultDistanceZero: string;
  entryFeePaymentMax: string;
  entryFeePaymentOptions: string;
  rtwbbChallengeEntryFeeOrderedProductName: string;
  rtwbbDonationOrderedProductName: string;
  checkRegisterChallengeStatusIntervalSeconds: number;
  checkRegisterChallengeStatusMaxRepetitions: number;
  tripMaxFileUploadSizeMegabytes: number;
  feedRefreshCachedPostsIntervalHours: number;
  apiFeedMaxOffersNumber: number;
  apiFeedMaxPrizesNumber: number;
  apiTripsSourceApplicationId: string;
  iDontWantMerchandiseItemCode: string;
  notifyMessagePosition: string;
  mobileBottomPanelVisibleItems: number;
  indexPageVisibleOfferCount: number;
  apiBase: string;
  apiBaseRtwbbFeed: string;
  apiBaseIpAddress: string;
  apiDefaultVersion: string;
  apiVersion2: string;
  apiDefaultLang: string;
  urlApiCommuteMode: string;
  urlApiDiscountCoupon: string;
  urlApiHasOrganizationAdmin: string;
  urlApiHasUserVerifiedEmail: string;
  urlApiConfirmEmail: string;
  urlApiIsUserOrganizationAdmin: string;
  urlApiLogin: string;
  urlApiLoginGoogle: string;
  urlApiOrganizations: string;
  urlApiLoginFacebook: string;
  urlApiMerchandise: string;
  urlApiMyTeam: string;
  urlApiMyOrganizationAdmin: string;
  urlApiPayuCreateOrder: string;
  urlAppDataPrivacyPolicy: string;
  urlAppDataTermsOfService: string;
  urlApiRefresh: string;
  urlApiRegister: string;
  urlApiRegisterChallenge: string;
  urlApiRegisterCoordinator: string;
  urlApiResetPassword: string;
  urlApiResetPasswordConfirm: string;
  urlApiResultsByChallenge: string;
  urlApiResults: string;
  urlApiChallengeRegistrationUser: string;
  urlApiCities: string;
  urlApiOpenAppWithRestToken: string;
  urlApiSendRegistrationConfirmationEmail: string;
  urlApiSendTeamMembershipInvitationEmail: string;
  urlApiStravaAuthAccount: string;
  urlApiStravaConnectAccount: string;
  urlApiStravaDisconnectAccount: string;
  urlApiStravaGetAccount: string;
  urlApiStravaGetAccountSync: string;
  urlApiSubsidiaries: string;
  urlApiThisCampaign: string;
  urlApiTeams: string;
  urlApiTrips: string;
  urlLoginRegisterBackgroundImage: string;
  urlRTWBBLogo: string;
  urlBaseBackend: string;
  apiTripsThirdPartyAppIdNaKolePrahou: string;
  apiTripsThirdPartyAppIdCyclers: string;
  checkIsEmailVerifiedInterval: number;
  checkIsThisCampaignCompetitionPhaseTypeInterval: string;
  googleLoginAppId: string;
  facebookLoginAppId: string;
  apiBaseRtwbbFeedBearerToken: string;
  secretString: string;
  facebookLoginSdkVersion: string;
  facebookLoginSdkOptions: string;
  mapProjection: string;
  mapCenterLon: string;
  mapCenterLat: string;
  mapZoom: string;
  mapGeocodingApiUrl: string;
  mapSourceRtwbb: string;
  mapSourceOsm: string;
}

export interface ConfigAppVersion {
  version: string;
}
