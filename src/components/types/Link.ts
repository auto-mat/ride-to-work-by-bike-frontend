export interface Link {
  title?: string;
  name?: string;
  icon?: string;
  url: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}
