import { Link, User } from 'src/components/types';

export const user: User = {
  label: 'User 1',
  value: '1',
  image: {
    src: 'https://picsum.photos/id/40/300/300',
    alt: 'User Name',
  },
};

export const menuTop: Link[] = [
  {
    url: '/',
    icon: 'home',
    name: 'home',
  },
  {
    url: '/cesty',
    icon: 'route',
    name: 'routes',
  },
  {
    url: '/vysledky',
    icon: 'emoji_events',
    name: 'results',
  },
  {
    url: '/komunita',
    icon: 'people',
    name: 'community',
  },
  {
    url: '/slevy',
    icon: 'verified',
    name: 'discounts',
  },
  {
    url: '/firemni-koordinator',
    icon: 'business',
    name: 'coordinator',
  },
  {
    url: '/profil',
    icon: 'account_circle',
    name: 'profile',
  },
];

export const menuBottom: Link[] = [
  {
    url: '/invite',
    icon: 'email',
    name: 'inviteFriends',
  },
  {
    url: '/cesty',
    icon: 'volunteer_activism',
    name: 'donate',
  },
];

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
