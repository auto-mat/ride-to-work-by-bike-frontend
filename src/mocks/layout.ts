import { Link, User } from "src/components/types";

export const user: User = {
  label: 'User 1',
  value: '1',
  image: 'https://picsum.photos/id/40/300/300',
};

export const userMenuTop: Link[] = [
  {
    title: 'Vaše údaje',
    url: '#',
  },
  {
    title: 'Odebírat newsletter',
    url: '#',
  },
  {
    title: 'Propojit aplikace',
    url: '#',
  },
  {
    title: 'Historie notifikací',
    url: '#',
  },
];

export const userMenuBottom: Link[] = [
  {
    title: 'Stát se firemním koordinátorem',
    url: '#',
  },
  {
    title: 'Odhlásit se',
    url: '#',
  },
];
