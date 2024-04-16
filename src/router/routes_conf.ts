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
};

export { routesConf };
