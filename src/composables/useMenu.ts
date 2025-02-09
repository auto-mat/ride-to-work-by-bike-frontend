// libraries
import { unref } from 'vue';

// config
import { routesConf } from 'src/router/routes_conf';

// types
import type { ComputedRef } from 'vue';
import type { Link } from 'src/components/types';

export const useMenu = () => {
  /**
   * Get the top menu items
   * @param {boolean} isUserOrganizationAdmin - Whether the user is an organization admin
   * @returns {Link[]} Array of top menu items
   */
  const getMenuTop = ({
    isUserOrganizationAdmin,
  }: {
    isUserOrganizationAdmin: ComputedRef<boolean | null> | boolean | null;
  }): Link[] => {
    let menuTop: Link[] = [
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
    ];

    if (unref(isUserOrganizationAdmin)) {
      menuTop = [
        ...menuTop,
        {
          url: routesConf['coordinator']['children']['fullPath'],
          icon: 'svguse:icons/drawer_menu/icons.svg#lucide-building',
          name: 'coordinator',
          title: 'coordinator',
        },
      ];
    }

    menuTop = [
      ...menuTop,
      {
        url: routesConf['profile']['children']['fullPath'],
        icon: 'svguse:icons/drawer_menu/icons.svg#ion-person-outline',
        name: 'profile',
        title: 'profile',
      },
    ];

    return menuTop;
  };

  /**
   * Get the bottom menu items
   * @param {string} urlDonate - The URL of the donate page
   * @returns {Link[]} Array of bottom menu items
   */
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

  return { getMenuTop, getMenuBottom };
};
