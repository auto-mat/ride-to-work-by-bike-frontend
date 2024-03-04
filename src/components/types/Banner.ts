import { Image } from './Image';
import { Link } from './Link';

export interface BannerImage {
  buttons: Link[];
  image: Image;
  perex: string;
  title: string;
}

export interface BannerApp {
  title: string;
  button: Link;
  image: Image;
}
