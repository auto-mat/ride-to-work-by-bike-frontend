import { Link } from './Link';

export interface DialogCard {
  title: string;
  image?: string;
  meta: object[];
  content: string;
  calendar?: boolean;
  voucher?: {
    code: string;
    link: Link;
  };
}

export type DialogStates = 'default' | 'form' | 'sent';
