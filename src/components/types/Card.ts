import { Image } from './Image';
import { ItemPrize } from './Item';
import { Link } from './Link';

export interface CardMetadata {
  id: string;
  icon: string;
  text: string;
}

export interface CardChallenge {
  title: string;
  image: Image;
  url: string;
  dates: string;
  company: boolean;
}

export interface CardEvent {
  title: string;
  thumbnail: Image;
  image: Image;
  dates: string;
  location: string;
  content: string;
  links: string[];
}
export interface CardFollow {
  title: string;
  handle: string;
  image: Image;
  url: string;
}
export interface CardOffer {
  title: string;
  metadata: CardMetadata[];
  image: Image;
  code: string;
  link: Link;
  icon: string;
  content: string;
}
export interface CardPrizeType {
  content: string;
  id: string;
  image: Image;
  link?: Link;
  metadata: CardMetadata[];
  title: string;
}
export interface CardLocationType {
  content: string;
  id: string;
  image: Image;
  link?: Link;
  metadata: CardMetadata[];
  title: string;
}
export interface CardPost {
  title: string;
  perex?: string;
  image: string;
  date: string;
  url: string;
}
export interface CardProgress {
  title: string;
  icon: string;
  url: string;
  image?: string;
  progress: number;
  prizes?: ItemPrize[];
  stats?: [
    {
      title: string;
      items: [
        {
          id: string;
          text: string;
        },
      ];
    },
    {
      title: string;
      items: { id: string; text: string }[];
    },
  ];
  duration?: {
    current: number;
    total: number;
  };
}

export interface CardStats {
  title: string;
  icon: string;
  stats: CardMetadata[];
}
