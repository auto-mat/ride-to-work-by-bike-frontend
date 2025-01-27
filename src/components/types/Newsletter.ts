export interface NewsletterItem {
  id: NewsletterType;
  icon: string;
  title: string;
  following: boolean;
}

export enum NewsletterType {
  challenge = 'challenge',
  event = 'events',
  mobility = 'mobility',
}
