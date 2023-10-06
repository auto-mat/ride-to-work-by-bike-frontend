import { i18n } from 'src/boot/i18n';

// types
import {
  BannerApp,
  BannerImage,
  CardChallenge,
  CardEvent,
  CardFollow,
  CardPost,
  CardProgress,
  CardStats,
  ItemBadge,
  ItemStatistics,
  NewsletterItem,
  CardOffer,
} from 'components/types';

export const releaseDate = '2023-10-01T12:00:00';

export const headingBgTitle =
  'Zapojte se do komunity Do práce na kole ve svém městě';

export const cardsChallenge: CardChallenge[] = [
  {
    title: 'Týmová pravidelnost',
    url: '#',
    image: {
      src: 'https://picsum.photos/id/70/500/540',
      alt: 'road lined with trees',
    },
    dates: '1. říj.–31. říj. 2022',
    company: false,
  },
  {
    title: 'Vaše pravidelnost',
    url: '#',
    image: {
      src: 'https://picsum.photos/id/70/500/530',
      alt: 'road lined with trees',
    },
    dates: '1. říj.–31. říj. 2022',
    company: false,
  },
  {
    title: 'Vaše zelené kilometry',
    url: '#',
    image: {
      src: 'https://picsum.photos/id/70/500/550',
      alt: 'road lined with trees',
    },
    dates: '1. říj.–31. říj. 2022',
    company: true,
  },
  {
    title: 'Zelené kilometry týmu',
    url: '#',
    image: {
      src: 'https://picsum.photos/id/70/500/520',
      alt: 'road lined with trees',
    },
    dates: '1. říj.–31. říj. 2022',
    company: true,
  },
  {
    title: 'Zelené kilometry pobočky',
    url: '#',
    image: {
      src: 'https://picsum.photos/id/70/500/550',
      alt: 'road lined with trees',
    },
    dates: '1. říj.–31. říj. 2022',
    company: false,
  },
];

export const cardsEvent: CardEvent[] = [
  {
    title: 'Opening Ceremony Bike to Work 2022',
    thumbnail: {
      src: 'https://picsum.photos/id/70/340/200',
      alt: '',
    },
    image: {
      src: 'https://picsum.photos/id/70/380/380',
      alt: '',
    },
    dates: new Date('2023-10-01T12:00:00'),
    location: 'Prague',
    content:
      'We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle! You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams. Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony. We will also announce the traditional Brno cycling employer of the year.<br />The main prize will be a City Bike HERKA from our partner Cyklospeciality.<br />We are looking forward to seeing you!',
    links: ['meet.google.com/anr-pvfs-opf', 'meet.google.com/anr-pvfs-opf'],
  },
];

export const cardsPost: CardPost[] = [
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/70/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/70/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/70/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/70/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/70/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/70/380/380',
    url: '/blog/1',
  },
];

export const bannerImage: BannerImage = {
  title: 'Vyplňte náš dotazník a vyhrajte jednu z našich skvělých cen!',
  perex:
    'Pomůžete nám rozhodnout, čemu příště věnovat více času a co by naopak mělo zůstat stejné.',
  image: {
    src: 'https://picsum.photos/id/70/600/200',
    alt: 'road lined with trees',
  },
};

export const bannerApp: BannerApp = {
  title: 'Zaznamenávejte cesty automaticky s aplikací Cyclers!',
  button: {
    title: 'Stáhnout aplikaci',
    url: '#',
  },
  image: {
    src: 'https://picsum.photos/id/70/600/200',
    alt: 'road lined with trees',
  },
};

export const cardsOffer: CardOffer[] = [
  {
    title: '100 CZK voucher do e-shopu Automatu',
    expirationDate: 'Some time later on',
    issuer: 'Automat',
    image: {
      src: 'https://picsum.photos/id/70/380/380',
      alt: 'road lined with trees',
    },
    code: '65972834',
    link: {
      title: 'Navštívit e-shop',
      url: '#',
      target: '_blank',
    },
    icon: 'pedal_bike',
    content:
      'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu,,včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.',
  },
  {
    title: '100 CZK voucher do e-shopu Automatu',
    expirationDate: 'Some time later on',
    issuer: 'Automat',
    image: {
      src: 'https://picsum.photos/id/70/380/380',
      alt: 'road lined with trees',
    },
    code: '65972834',
    link: {
      title: 'Navštívit e-shop',
      url: '#',
      target: '_blank',
    },
    icon: 'pedal_bike',
    content:
      'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu,,včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.',
  },
  {
    title: '100 CZK voucher do e-shopu Automatu',
    expirationDate: 'Some time later on',
    issuer: 'Automat',
    image: {
      src: 'https://picsum.photos/id/70/380/380',
      alt: 'road lined with trees',
    },
    code: '65972834',
    link: {
      title: 'Navštívit e-shop',
      url: '#',
      target: '_blank',
    },
    icon: 'pedal_bike',
    content:
      'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu,,včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.',
  },
  {
    title: '100 CZK voucher do e-shopu Automatu',
    expirationDate: 'Some time later on',
    issuer: 'Automat',
    image: {
      src: 'https://picsum.photos/id/70/380/380',
      alt: 'road lined with trees',
    },
    code: '65972834',
    link: {
      title: 'Navštívit e-shop',
      url: '#',
      target: '_blank',
    },
    icon: 'pedal_bike',
    content:
      'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu,,včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.',
  },
  {
    title: '100 CZK voucher do e-shopu Automatu',
    expirationDate: 'Some time later on',
    issuer: 'Automat',
    image: {
      src: 'https://picsum.photos/id/70/380/380',
      alt: 'road lined with trees',
    },
    code: '65972834',
    link: {
      title: 'Navštívit e-shop',
      url: '#',
      target: '_blank',
    },
    icon: 'pedal_bike',
    content:
      'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu,,včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.',
  },
  {
    title: '100 CZK voucher do e-shopu Automatu',
    expirationDate: 'Some time later on',
    issuer: 'Automat',
    image: {
      src: 'https://picsum.photos/id/70/380/380',
      alt: 'road lined with trees',
    },
    code: '65972834',
    link: {
      title: 'Navštívit e-shop',
      url: '#',
      target: '_blank',
    },
    icon: 'pedal_bike',
    content:
      'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu,,včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.',
  },
  {
    title: '100 CZK voucher do e-shopu Automatu',
    expirationDate: 'Some time later on',
    issuer: 'Automat',
    image: {
      src: 'https://picsum.photos/id/70/380/380',
      alt: 'road lined with trees',
    },
    code: '65972834',
    link: {
      title: 'Navštívit e-shop',
      url: '#',
      target: '_blank',
    },
    icon: 'pedal_bike',
    content:
      'Výtěžek z prodeje benefičního e-shopu slouží k financování charitativní činnosti v rámci projektů Automatu,,včetně projektů jako Do práce na kole, Zažít město jinak a Generace U.',
  },
];

export const cardsFollow: CardFollow[] = [
  {
    title: 'Do práce na kole – Brno',
    handle: '@DPNKBrno',
    image: {
      src: 'https://picsum.photos/id/70/300/300',
      alt: 'road lined with trees',
    },
    url: '#',
  },
  {
    title: 'Do práce na kole – Brno',
    handle: '@DPNKBrno',
    image: {
      src: 'https://picsum.photos/id/70/300/300',
      alt: 'road lined with trees',
    },
    url: '#',
  },
];

export const cardsProgressSlider: CardProgress[] = [
  {
    title: 'Týmová pravidelnost',
    icon: 'person',
    url: '#',
    image: '',
    progress: 60,
    stats: [
      {
        title: 'Váš podíl na výsledku',
        items: [{ id: '1', text: '80% pravidelnost' }],
      },
      {
        title: 'Postavení v žebříčku',
        items: [
          { id: '1', text: '2. Automati a 1 další (80 %)' },
          { id: '2', text: '3. Váš tým a 2 další (60 %)' },
          { id: '3', text: '4. Tygři a 2 další (40 %)' },
        ],
      },
    ],
    duration: {
      current: 14,
      total: 30,
    },
  },
  {
    title: 'Žebříčky',
    icon: 'person',
    url: '#',
    image: '',
    progress: 60,
    stats: [
      {
        title: '',
        items: [{ id: '1', text: '' }],
      },
      {
        title: '',
        items: [{ id: '1', text: '' }],
      },
    ],
    duration: {
      current: 14,
      total: 30,
    },
  },
];

export const progressStats: ItemStatistics[] = [
  {
    icon: 'route',
    label: 'udržitelných cest',
    value: '18',
  },
  {
    icon: 'open_in_full',
    label: '312,25 km',
    value: '',
  },
  {
    icon: 'eco',
    label: 'ušetřeno',
    value: '420 g CO2',
  },
];

export const cardsProgress: CardProgress[] = [
  {
    title: 'Týmová pravidelnost',
    icon: 'people',
    url: '#',
    progress: 95,
    prizes: [
      {
        icon: 'emoji_events',
        placement: 1,
        label: 'místo',
      },
    ],
  },
  {
    title: 'Vaše pravidelnost',
    icon: 'person',
    url: '#',
    progress: 80,
    prizes: [
      {
        icon: '',
        placement: 4,
        label: 'místo',
      },
    ],
  },
  {
    title: 'Vaše zelené kilometry',
    icon: 'person',
    url: '#',
    progress: 48,
    prizes: [
      {
        icon: '',
        placement: 5,
        label: 'místo',
      },
    ],
  },
];

export const newsletterItems: NewsletterItem[] = [
  {
    title: i18n.global.t('index.newsletterFeature.aboutChallenges'),
    icon: 'ion-bicycle',
    url: '#',
    following: true,
  },
  {
    title: i18n.global.t('index.newsletterFeature.aboutEvents'),
    icon: 'people',
    url: '#',
    following: true,
  },
  {
    title: i18n.global.t('index.newsletterFeature.aboutMobility'),
    icon: 'mdi-leaf',
    url: '#',
    following: false,
  },
];

export const badgeList: ItemBadge[] = [
  {
    image: 'https://picsum.photos/id/70/100/100',
    title: 'Jarní jezdec',
    description: 'Alespoň 1 jízda na kole na jaře',
    variant: 'light',
  },
  {
    image: 'https://picsum.photos/id/70/100/100',
    title: 'Podzimní jezdec',
    description: 'Alespoň 1 jízda na kole na podzim',
    variant: 'dark',
  },
  {
    image: 'https://picsum.photos/id/70/100/100',
    title: 'Zimní jezdec',
    description: 'Alespoň 1 jízda na kole v zimě',
    variant: 'light',
  },
  {
    image: 'https://picsum.photos/id/70/100/100',
    title: 'Omezovač emisí',
    description: 'Žádné ježdění autem po dobu alespoň 1 měsíce',
    variant: 'light',
  },
  {
    image: 'https://picsum.photos/id/70/100/100',
    title: 'Společenský tvor',
    description: 'Alespoň 1 komunitní událost přidána do kalendáře',
    variant: 'light',
  },
];

export const cardsStats: CardStats[] = [
  {
    title: 'Vy',
    icon: 'person',
    stats: [
      {
        id: 'regularity',
        icon: 'lens',
        text: '80% pravidelnost',
      },
      {
        id: 'routes',
        icon: 'route',
        text: '18 cest',
      },
      {
        id: 'distance',
        icon: 'sync_alt',
        text: '312,25 km',
      },
      {
        id: 'emissions',
        icon: 'eco',
        text: '420 g CO2 ušetřeno',
      },
    ],
  },
];
