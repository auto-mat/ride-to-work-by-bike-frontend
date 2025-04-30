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
   * @param {ComputedRef<boolean | null> | boolean | null}
   *   isUserOrganizationAdmin - Whether the user is an organization admin
   * @param {ComputedRef<boolean | null> | boolean | null}
   *   isUserStaff - Whether the user is staff member
   * @param {ComputedRef<string> | string } urlAdmin - RTWBB old Django frontend
   *                                                   app admin URL
   * @param {ComputedRef<boolean | null> | boolean | null}
   *   isEntryEnabled - Whether the entry is enabled
   * @param {ComputedRef<boolean | null> | boolean | null}
   *   isResultsEnabled - Whether the results are enabled
   * @returns {Link[]} - Array of top menu items
   */
  const getMenuTop = ({
    isUserOrganizationAdmin,
    isUserStaff,
    urlAdmin,
    isEntryEnabled,
    isResultsEnabled,
  }: {
    isUserOrganizationAdmin: ComputedRef<boolean | null> | boolean | null;
    isUserStaff: ComputedRef<boolean | null> | boolean | null;
    urlAdmin: ComputedRef<string> | string;
    isEntryEnabled: ComputedRef<boolean | null> | boolean | null;
    isResultsEnabled: ComputedRef<boolean | null> | boolean | null;
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
        disabled: !unref(isEntryEnabled),
      },
      {
        url: routesConf['results']['children']['fullPath'],
        icon: 'svguse:icons/drawer_menu/icons.svg#chart-graph',
        name: 'results',
        title: 'results',
        disabled: !unref(isResultsEnabled),
      },
      {
        url: routesConf['prizes']['children']['fullPath'],
        icon: 'svguse:icons/drawer_menu/icons.svg#lucide-badge-percent',
        name: 'discounts',
        title: 'discounts',
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

    if (unref(isUserStaff)) {
      menuTop = [
        ...menuTop,
        {
          url: '',
          icon: 'svguse:icons/drawer_menu/icons.svg#lucide:settings-2',
          name: 'admin',
          title: 'admin',
          href: unref(urlAdmin),
        },
      ];
    }

    return menuTop;
  };

  /**
   * Get the bottom menu items
   * @param {string} urlDonate - The URL of the donate page
   * @param {string} urlContact - The URL of the contact page
   * @returns {Link[]} - Array of bottom menu items
   */
  const getMenuBottom = (urlDonate: string, urlContact: string): Link[] => {
    const menuBottom: Link[] = [
      {
        url: '',
        icon: 'svguse:icons/drawer_menu/icons.svg#lucide-gift',
        name: 'donate',
        title: 'donate',
        href: urlDonate,
      },
      {
        url: '',
        icon: 'svguse:icons/drawer_menu/icons.svg#lucide-mail-question',
        name: 'contact',
        title: 'contact',
        href: urlContact,
      },
    ];

    return menuBottom;
  };

  return { getMenuTop, getMenuBottom };
};
