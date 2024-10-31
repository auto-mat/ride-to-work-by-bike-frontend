export enum StatisticsId {
  co2 = 'co2',
  distance = 'distance',
  routes = 'eco_trip_count',
  frequency = 'frequency',
}

export enum StatisticsCategoryId {
  personal = 'personal',
  team = 'team',
  organization = 'organization',
  city = 'city',
}

export interface ItemStatistics {
  id: StatisticsId;
  icon?: string;
  value: string;
}

export interface CardStatistics {
  id: number;
  category: StatisticsCategoryId;
  stats: ItemStatistics[];
}
