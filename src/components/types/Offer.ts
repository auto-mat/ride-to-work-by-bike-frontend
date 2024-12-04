export interface Offer {
  id: number;
  title: string;
  content: string;
  start_date: string;
  end_date: string;
  url: string;
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
  _number: number;
}
