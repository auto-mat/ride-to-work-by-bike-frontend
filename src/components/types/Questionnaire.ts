import type { Image } from './Image';

export interface QuestionnaireLink {
  id: string;
  title: string;
  image: Image;
  link: {
    url: string;
    target?: '_blank' | '_self';
  };
}
