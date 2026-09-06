import { Image } from './Image';

export interface User {
  label: string;
  email: string;
  value: string;
  image: Image;
}

export interface UserLogin {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
