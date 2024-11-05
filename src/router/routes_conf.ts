type RoutesConf = {
  [key: string]: {
    path: string;
    children: {
      fullPath?: string;
      name: string;
    };
  };
};

const routesConf: RoutesConf = {
  challenge_inactive: {
    path: '/challenge-inactive',
    children: {
      fullPath: '/challenge-inactive',
      name: 'challenge-inactive',
    },
  },
  community: {
    path: '/community',
    children: {
      fullPath: '/community',
      name: 'community',
    },
  },
  become_coordinator: {
    path: '/become-coordinator',
    children: {
      fullPath: '/become-coordinator',
      name: 'become-coordinator',
    },
  },
  verify_email: {
    path: '/verify-email',
    children: {
      fullPath: '/verify-email',
      name: 'verify-email',
    },
  },
  home: {
    path: '/',
    children: {
      fullPath: '/',
      name: 'home',
    },
  },
  login: {
    path: '/login',
    children: {
      fullPath: '/login',
      name: 'login',
    },
  },
  prizes: {
    path: '/prizes',
    children: {
      fullPath: '/prizes',
      name: 'prizes',
    },
  },
  register: {
    path: '/register',
    children: {
      fullPath: '/register',
      name: 'register',
    },
  },
  register_coordinator: {
    path: '/register-coordinator',
    children: {
      fullPath: '/register-coordinator',
      name: 'register-coordinator',
    },
  },
  register_challenge: {
    path: '/register-challenge',
    children: {
      fullPath: '/register-challenge',
      name: 'register-challenge',
    },
  },
  results: {
    path: '/results',
    children: {
      fullPath: '/results',
      name: 'results',
    },
  },
  results_detail: {
    path: 'detail',
    children: {
      fullPath: '/results/detail',
      name: 'results-detail',
    },
  },
  results_report: {
    path: 'report',
    children: {
      fullPath: '/results/detail/report',
      name: 'results-detail-report',
    },
  },
  results_regularity: {
    path: 'regularity',
    children: {
      fullPath: '/results/detail/regularity',
      name: 'results-detail-regularity',
    },
  },
  results_performance: {
    path: 'performance',
    children: {
      fullPath: '/results/detail/performance',
      name: 'results-detail-performance',
    },
  },
  routes: {
    path: '/routes',
    children: {
      fullPath: '/routes',
      name: 'routes',
    },
  },
  routes_calendar: {
    path: 'calendar',
    children: {
      fullPath: '/routes/calendar',
      name: 'routes-calendar',
    },
  },
  routes_list: {
    path: 'list',
    children: {
      fullPath: '/routes/list',
      name: 'routes-list',
    },
  },
  routes_map: {
    path: 'map',
    children: {
      fullPath: '/routes/map',
      name: 'routes-map',
    },
  },
  routes_app: {
    path: 'app',
    children: {
      fullPath: '/routes/app',
      name: 'routes-app',
    },
  },
  profile: {
    path: '/profile',
    children: {
      fullPath: '/profile',
      name: 'profile',
    },
  },
  profile_details: {
    path: 'details',
    children: {
      fullPath: '/profile/details',
      name: 'profile-details',
    },
  },
  profile_forms: {
    path: 'forms',
    children: {
      fullPath: '/profile/forms',
      name: 'profile-forms',
    },
  },
  profile_newsletter: {
    path: 'newsletter',
    children: {
      fullPath: '/profile/newsletter',
      name: 'profile-newsletter',
    },
  },
  profile_notifications: {
    path: 'notifications',
    children: {
      fullPath: '/profile/notifications',
      name: 'profile-notifications',
    },
  },
  coordinator: {
    path: '/coordinator',
    children: {
      fullPath: '/coordinator',
      name: 'coordinator',
    },
  },
  coordinator_tasks: {
    path: 'tasks',
    children: {
      fullPath: '/coordinator/tasks',
      name: 'coordinator-tasks',
    },
  },
  coordinator_fees: {
    path: 'fees',
    children: {
      fullPath: '/coordinator/fees',
      name: 'coordinator-fees',
    },
  },
  coordinator_invoices: {
    path: 'invoices',
    children: {
      fullPath: '/coordinator/invoices',
      name: 'coordinator-invoices',
    },
  },
  coordinator_packages: {
    path: 'packages',
    children: {
      fullPath: '/coordinator/packages',
      name: 'coordinator-packages',
    },
  },
  coordinator_attendance: {
    path: 'attendance',
    children: {
      fullPath: '/coordinator/attendance',
      name: 'coordinator-attendance',
    },
  },
  coordinator_challenges: {
    path: 'challenges',
    children: {
      fullPath: '/coordinator/challenges',
      name: 'coordinator-challenges',
    },
  },
  coordinator_results: {
    path: 'results',
    children: {
      fullPath: '/coordinator/results',
      name: 'coordinator-results',
    },
  },
};

export { routesConf };
