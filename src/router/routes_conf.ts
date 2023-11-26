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
