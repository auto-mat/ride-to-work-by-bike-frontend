import { Link } from './Link';

export interface Offer {
  title: string;
  expirationDate: Date;
  issuer: string;
  image: string;
  code: string;
  link: Link;
  icon: string;
  content: string;
}
