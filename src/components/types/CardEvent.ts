import { Image } from "./Image";

export interface CardEvent {
  title: string;
  thumbnail: Image;
  image: Image;
  dates: Date;
  location: string;
  content: string;
  links: string[];
}
