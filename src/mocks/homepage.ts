// types
import {
  CardChallenge,
  CardEvent,
  CardPost,
  BannerImage,
  Offer,
  CardFollow,
  ItemStatistics,
  CardProgress,
} from 'components/types';

export const releaseDate = '2023-10-01T12:00:00';

export const headingBgTitle =
  'Zapojte se do komunity Do práce na kole ve svém městě';

export const cardsChallenge: CardChallenge[] = [
  {
    title: 'Týmová pravidelnost',
    url: '#',
    image: 'https://picsum.photos/500/540',
    dates: '1. říj.–31. říj. 2022',
    company: false,
  },
  {
    title: 'Vaše pravidelnost',
    url: '#',
    image: 'https://picsum.photos/500/530',
    dates: '1. říj.–31. říj. 2022',
    company: false,
  },
  {
    title: 'Vaše zelené kilometry',
    url: '#',
    image: 'https://picsum.photos/500/550',
    dates: '1. říj.–31. říj. 2022',
    company: true,
  },
  {
    title: 'Zelené kilometry týmu',
    url: '#',
    image: 'https://picsum.photos/500/520',
    dates: '1. říj.–31. říj. 2022',
    company: true,
  },
  {
    title: 'Zelené kilometry pobočky',
    url: '#',
    image: 'https://picsum.photos/500/550',
    dates: '1. říj.–31. říj. 2022',
    company: false,
  },
];

export const cardsEvent: CardEvent[] = [
  {
    title: 'Opening Ceremony Bike to Work 2022',
    thumbnail: 'https://picsum.photos/340/200',
    image: 'https://picsum.photos/380/380',
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
    image: 'https://picsum.photos/id/100/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/100/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/100/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/100/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/100/380/380',
    url: '/blog/1',
  },
  {
    title: 'Jak na cyklistiku v zimě? Co všechno se můžeme učit od Finů?',
    date: new Date(2023, 8, 1),
    image: 'https://picsum.photos/id/100/380/380',
    url: '/blog/1',
  },
];

export const bannerImage: BannerImage = {
  title: 'Vyplňte náš dotazník a vyhrajte jednu z našich skvělých cen!',
  perex:
    'Pomůžete nám rozhodnout, čemu příště věnovat více času a co by naopak mělo zůstat stejné.',
  image: 'https://picsum.photos/600/200',
};

export const cardsOffer: Offer[] = [
  {
    title: '100 CZK voucher do e-shopu Automatu',
    expirationDate: 'Some time later on',
    issuer: 'Automat',
    image: 'https://picsum.photos/380/380',
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
    image: 'https://picsum.photos/380/380',
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
    image: 'https://picsum.photos/380/380',
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
    image: 'https://picsum.photos/380/380',
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
    image: 'https://picsum.photos/380/380',
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
    image: 'https://picsum.photos/380/380',
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
    image: 'https://picsum.photos/id/76/300/300',
    url: '#',
  },
  {
    title: 'Do práce na kole – Brno',
    handle: '@DPNKBrno',
    image: 'https://picsum.photos/id/76/300/300',
    url: '#',
  },
];

export const cardsProgress: CardProgress[] = [
  {
    title: 'Týmová pravidelnost',
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
    icon: 'distance',
    label: '312,25 km',
    value: '',
  },
  {
    icon: 'leaf',
    label: 'ušetřeno',
    value: '420 g CO2',
  },
];
