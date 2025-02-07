// libraries
import { computed } from 'vue';

// config
import { routesConf } from 'src/router/routes_conf';

// types
import type { Link } from 'src/components/types';

export const useMenu = () => {
  const menuTop = computed<Link[]>(() => {
    const menu: Link[] = [
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

    return menu;
  });

  const getMenuBottom = (urlDonate: string): Link[] => {
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
        href: urlDonate,
      },
    ];

    return menuBottom;
  };

  return { menuTop, getMenuBottom };
};
