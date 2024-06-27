type RoutesConf = {
  [key: string]: {
    path: string;
    children: {
      name: string;
    };
  };
};

const routesConf: RoutesConf = {
  community: {
    path: '/community',
    children: {
      name: 'community',
    },
  },
  company_coordinator: {
    path: '/company-coordinator',
    children: {
      name: 'company-coordinator',
    },
  },
  home: {
    path: '/',
    children: {
      name: 'home',
    },
  },
  login: {
    path: '/login',
    children: {
      name: 'login',
    },
  },
  prizes: {
    path: '/prizes',
    children: {
      name: 'prizes',
    },
  },
  register: {
    path: '/register',
    children: {
      name: 'register',
    },
  },
  register_coordinator: {
    path: '/register-coordinator',
    children: {
      name: 'register-coordinator',
    },
  },
  register_challenge: {
    path: '/register-challenge',
    children: {
      name: 'register-challenge',
    },
  },
  results: {
    path: '/results',
    children: {
      name: 'results',
    },
  },
  results_detail: {
    path: 'detail',
    children: {
      name: 'results/detail',
    },
  },
  results_report: {
    path: 'report',
    children: {
      name: 'results/detail/report',
    },
  },
  results_regularity: {
    path: 'regularity',
    children: {
      name: 'results/detail/regularity',
    },
  },
  results_performance: {
    path: 'performance',
    children: {
      name: 'results/detail/performance',
    },
  },
  routes: {
    path: '/routes',
    children: {
      name: 'routes',
    },
  },
  routes_calendar: {
    path: 'calendar',
    children: {
      name: 'routes/calendar',
    },
  },
  routes_list: {
    path: 'list',
    children: {
      name: 'routes/list',
    },
  },
  routes_map: {
    path: 'map',
    children: {
      name: 'routes/map',
    },
  },
  routes_app: {
    path: 'app',
    children: {
      name: 'routes/app',
    },
  },
};

export { routesConf };
