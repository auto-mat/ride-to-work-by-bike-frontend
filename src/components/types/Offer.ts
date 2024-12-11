export interface Offer {
  id: number;
  title: string;
  url: string;
  published: string;
  start_date: string;
  excerpt: string;
  content: string; // html
  image: string;
}

export interface GetOffersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Offer[];
}

export interface GetOffersParams {
  orderby: string;
  feed: string;
  _post_type: string;
  _page_subtype: string;
  _number: string;
  [key: string]: string; // ensure compatibility with axios params
}
