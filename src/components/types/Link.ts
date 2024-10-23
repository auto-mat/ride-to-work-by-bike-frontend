export interface Link {
  title?: string;
  name?: string;
  icon?: string;
  url?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export enum SocialLinkId {
  facebook = 'facebook',
  instagram = 'instagram',
  twitter = 'twitter',
  youtube = 'youtube',
}

export interface SocialLink extends Link {
  id: SocialLinkId;
}
