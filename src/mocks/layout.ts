import { Link, User } from 'src/components/types';
import { i18n } from 'src/boot/i18n';

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
    url: '',
    icon: 'svguse:icons/drawer_menu/icons.svg#lucide-home',
    name: 'home',
    title: 'home',
  },
  {
    url: '',
    icon: 'svguse:icons/drawer_menu/icons.svg#lucide-route',
    name: 'routes',
    title: 'routes',
  },
  {
    url: '',
    icon: 'svguse:icons/drawer_menu/icons.svg#chart-graph',
    name: 'results',
    title: 'results',
  },
  {
    url: '',
    icon: 'svguse:icons/drawer_menu/icons.svg#three-circles',
    name: 'community',
    title: 'community',
  },
  {
    url: '',
    icon: 'svguse:icons/drawer_menu/icons.svg#lucide-badge-percent',
    name: 'prizes',
    title: 'discounts',
  },
  {
    url: '',
    icon: 'svguse:icons/drawer_menu/icons.svg#lucide-building',
    name: 'company-coordinator',
    title: 'coordinator',
  },
  {
    url: '',
    icon: 'svguse:icons/drawer_menu/icons.svg#ion-person-outline',
    name: 'profile',
    title: 'profile',
  },
];

export const menuBottom: Link[] = [
  {
    url: '',
    icon: 'svguse:icons/drawer_menu/icons.svg#email',
    name: 'invite',
    title: 'inviteFriends',
  },
  {
    url: '',
    icon: 'svguse:icons/drawer_menu/icons.svg#lucide-gift',
    name: 'donate',
    title: 'donate',
  },
];

const dummyText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export const faqParticipant = [
  {
    title: 'Chci z toho vycouvat. Vrátite mi startovné?',
    text: dummyText,
  },
  {
    title: 'Nechcete přijmout moji platbu startovného.',
    text: dummyText,
  },
  {
    title:
      'Do práce mi to na kole deska nějak nevyšlo. Můžu si místo toho zapsat víkendový vylet?',
    text: dummyText,
  },
  {
    title: 'Jak se propojím se svojí mobilní aplikací?',
    text: dummyText,
  },
  {
    title: 'Jak si zapíšu cestu na noční směnu?',
    text: dummyText,
  },
  {
    title: 'Můžu na cestě do práce kombinovat dopravní prostředky?',
    text: dummyText,
  },
  {
    title: 'Chci změnit adresu, na kterou mi pošlete startovní balíček.',
    text: dummyText,
  },
  {
    title: 'Ještě nemám startovní balíček, safra.',
    text: dummyText,
  },
  {
    title: 'Nechci to moc rozebírat, ale velikost trička mi nesedí.',
    text: dummyText,
  },
];

export const faqCoordinator = [
  {
    title: 'Jsem hodný šéf a chci zaplatit za své zaměstnance.',
    text: dummyText,
  },
  {
    title: 'Chci predat břímě firemniho koordinátora někomu jinému.',
    text: dummyText,
  },
  {
    title: 'Chci vidět výsledky výzev.',
    text: dummyText,
  },
  {
    title: 'Jak se stanu hrdým firemním koordinátorem?',
    text: dummyText,
  },
  {
    title:
      'Jak se stát firemním koordinátorem a zároveň se účastnit výzvy Do práce na kole?',
    text: dummyText,
  },
  {
    title:
      'Nechcete se účastnit výzvy, ale chcete se stát firemním koordinátorem?',
    text: dummyText,
  },
  {
    title: 'Jak uhradit startovné za kolegy?',
    text: dummyText,
  },
  {
    title: 'Jak se hlásí kolegové?',
    text: dummyText,
  },
  {
    title: 'Kde najdu fakturu?',
    text: dummyText,
  },
];

export const socialLinks = [
  {
    title: i18n.global.t('index.menuLinks.instagram'),
    icon: 'mdi-instagram',
    url: 'https://www.instagram.com/spolekautomat',
  },
  {
    title: i18n.global.t('index.menuLinks.facebook'),
    icon: 'mdi-facebook',
    url: 'https://www.facebook.com/spolekautomat',
  },
  {
    title: i18n.global.t('index.menuLinks.twitter'),
    icon: 'mdi-twitter',
    url: 'https://twitter.com/spolekautomat',
  },
  {
    title: i18n.global.t('index.menuLinks.youtube'),
    icon: 'mdi-youtube',
    url: 'https://www.youtube.com/@spolekautomat',
  },
];

export const usefulLinks = [
  {
    title: 'Auto-Mat.cz',
    icon: 'link',
    url: 'https://auto-mat.cz/',
  },
  {
    title: 'Podpořte nás',
    icon: 'volunteer_activism',
    url: '#',
  },
  {
    title: 'Kód projektu',
    icon: 'mdi-github',
    url: 'https://github.com/auto-mat/ride-to-work-by-bike-frontend',
  },
  {
    title: 'Mobilní aplikace',
    icon: 'smartphone',
    url: '#',
  },
];
