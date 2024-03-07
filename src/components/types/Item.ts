export interface ItemStatistics {
  icon: string;
  label: string;
  value: string;
}

export interface ItemPrize {
  icon: string;
  label: string;
  placement: number;
}

export interface ItemBadge {
  image: string;
  title: string;
  description: string;
  variant: 'dark' | 'light';
}

export interface ItemCalendarType {
  id: string;
  icon: string;
  url: string;
  label: string;
}
