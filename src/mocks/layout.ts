import { Link } from 'src/components/types';

// config
import { routesConf } from 'src/router/routes_conf';

export const menuTop: Link[] = [
  {
    url: routesConf['home']['children']['fullPath'],
    icon: 'svguse:icons/drawer_menu/icons.svg#lucide-home',
    name: 'home',
    title: 'home',
  },
  {
    url: routesConf['routes']['children']['fullPath'],
    icon: 'svguse:icons/drawer_menu/icons.svg#lucide-route',
    name: 'routes',
    title: 'routes',
    disabled: true,
  },
  {
    url: routesConf['results']['children']['fullPath'],
    icon: 'svguse:icons/drawer_menu/icons.svg#chart-graph',
    name: 'results',
    title: 'results',
    disabled: true,
  },
  // {
  //   url: '',
  //   icon: 'svguse:icons/drawer_menu/icons.svg#three-circles',
  //   name: 'community',
  //   title: 'community',
  // },
  // {
  //   url: '',
  //   icon: 'svguse:icons/drawer_menu/icons.svg#lucide-badge-percent',
  //   name: 'prizes',
  //   title: 'discounts',
  // },
  {
    url: routesConf['coordinator']['children']['fullPath'],
    icon: 'svguse:icons/drawer_menu/icons.svg#lucide-building',
    name: 'coordinator',
    title: 'coordinator',
  },
  {
    url: routesConf['profile']['children']['fullPath'],
    icon: 'svguse:icons/drawer_menu/icons.svg#ion-person-outline',
    name: 'profile',
    title: 'profile',
  },
];

export const getMenuBottom = (url: string): Link[] => {
  const menuBottom: Link[] = [
    // {
    //   url: '',
    //   icon: 'svguse:icons/drawer_menu/icons.svg#email',
    //   name: 'invite',
    //   title: 'inviteFriends',
    // },
    {
      url: '',
      icon: 'svguse:icons/drawer_menu/icons.svg#lucide-gift',
      name: 'donate',
      title: 'donate',
      href: url,
    },
  ];
  return menuBottom;
};

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
