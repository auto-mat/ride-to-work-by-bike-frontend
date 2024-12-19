/**
 * Types for merchandise-related operations
 */

// enums
import { Gender } from './Profile';

// types
import type { Ref } from 'vue';
import type { FormOption } from './Form';
import type { Image } from './Image';

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

export type UseApiGetMerchandiseReturn = {
  merchandise: Ref<Merchandise[]>;
  merchandiseCards: Ref<Record<Gender, MerchandiseCard[]>>;
  merchandiseItems: Ref<MerchandiseItem[]>;
  isLoading: Ref<boolean>;
  loadMerchandise: () => Promise<void>;
};

/**
 * Represents a merchandise card for display purposes
 * Used in grid/list views to show merchandise options
 */
export interface MerchandiseCard {
  label: string;
  image: string;
  description: string;
  author: string;
  gender: Gender;
  sizeOptions: FormOption[];
  material: string;
  itemIds: number[];
}

/**
 * Represents a merchandise item for selection and state management
 * Used in forms and dialogs for merchandise selection
 */
export interface MerchandiseItem {
  id: number;
  label: string;
  gender: Gender;
  genderOptions: FormOption[];
  size: string;
  sizeOptions: FormOption[];
  description: string;
  images: Image[];
}
