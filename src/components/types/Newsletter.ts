export interface NewsletterItem {
  title: string;
  icon: string;
  url: string;
  following: boolean;
}

export interface NewsletterOption {
  id: string
  label: string
  active: boolean
}
