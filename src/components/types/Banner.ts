import { Image } from './Image';
import { Link } from './Link';

export interface BannerImage {
  title: string;
  perex: string;
  image: Image;
}

export interface BannerApp {
  title: string;
  button: Link;
  image: Image;
}
