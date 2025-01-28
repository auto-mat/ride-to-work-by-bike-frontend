export interface Link {
  title?: string;
  name?: string;
  icon?: string;
  url?: string;
  disabled?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  href?: string;
}

export enum SocialLinkId {
  facebook = 'facebook',
  instagram = 'instagram',
  twitter = 'twitter',
  youtube = 'youtube',
}

export enum UsefulLinkId {
  autoMat = 'auto-mat',
  support = 'support',
  projectCode = 'project-code',
  mobileApp = 'mobile-app',
}

export interface SocialLink extends Link {
  id: SocialLinkId;
}

export interface UsefulLink extends Link {
  id: UsefulLinkId;
}
