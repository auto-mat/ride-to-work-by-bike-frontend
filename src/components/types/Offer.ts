// enums
import { OfferCategorySlug } from '../enums/Offers';

export interface Offer {
  id: number;
  title: string;
  url: string;
  published: string;
  start_date: string;
  excerpt: string;
  content: string; // html
  image: string;
  categories: OfferCategory[];
}

export interface OfferCategory {
  name: string;
  slug: OfferCategorySlug;
  url: string;
}

export interface GetOffersParams {
  order: string;
  orderby: string;
  feed: string;
  _post_type: string;
  _number: string;
  _from: string;
  [key: string]: string; // ensure compatibility with axios params
}
