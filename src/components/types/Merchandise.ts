/**
 * Types for merchandise-related operations
 */

// enums
import { Gender } from './Profile';

export interface Merchandise {
  id: number;
  name: string;
  sex: Gender;
  size: string;
  author: string;
  material: string;
  description: string;
  t_shirt_preview: string;
}

export interface GetMerchandiseResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Merchandise[];
}
