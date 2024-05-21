type RoutesConf = {
  [key: string]: {
    path: string;
    children: {
      name: string;
    };
  };
};

const routesConf: RoutesConf = {
  home: {
    path: '/',
    children: {
      name: 'home',
    },
  },
  routes: {
    path: '/routes',
    children: {
      name: 'routes',
    },
  },
  routes_calendar: {
    path: '/routes/calendar',
    children: {
      name: 'routes/calendar',
    },
  },
  routes_list: {
    path: '/routes/list',
    children: {
      name: 'routes/list',
    },
  },
  routes_map: {
    path: '/routes/map',
    children: {
      name: 'routes/map',
    },
  },
  routes_app: {
    path: '/routes/app',
    children: {
      name: 'routes/app',
    },
  },
  login: {
    path: '/login',
    children: {
      name: 'login',
    },
  },
  register: {
    path: '/register',
    children: {
      name: 'register',
    },
  },
  'register-coordinator': {
    path: '/register-coordinator',
    children: {
      name: 'register-coordinator',
    },
  },
  'register-challenge': {
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
    path: '/results/detail',
    children: {
      name: 'results/detail',
    },
  },
  results_report: {
    path: '/results/detail/report',
    children: {
      name: 'results/detail/report',
    },
  },
  results_regularity: {
    path: '/results/detail/regularity',
    children: {
      name: 'results/detail/regularity',
    },
  },
  results_performance: {
    path: '/results/detail/performance',
    children: {
      name: 'results/detail/performance',
    },
  },
};

export { routesConf };
