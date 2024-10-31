import { i18n } from 'src/boot/i18n';

// types
import {
  BannerApp,
  BannerImage,
  CardChallenge,
  CardEvent,
  CardProgress,
  ItemBadge,
  NewsletterItem,
  CardOffer,
} from 'components/types';

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
    dates: '2023-10-01T12:00:00',
    location: 'Prague',
    content:
      'We want to reward you for your support and activity this year with a closing party with prizes and the promised raffle! You can look forward to the announcement of the results in the regularity category and green kilometres for individuals and teams. Other attractive prizes will be drawn by raffle only from the individuals and teams that will have at least one representative at the closing ceremony. We will also announce the traditional Brno cycling employer of the year.<br />The main prize will be a City Bike HERKA from our partner Cyklospeciality.<br />We are looking forward to seeing you!',
    links: ['meet.google.com/anr-pvfs-opf', 'meet.google.com/anr-pvfs-opf'],
  },
];

export const bannerImage: BannerImage = {
  title: i18n.global.t('index.bannerImage.title'),
  perex: i18n.global.t('index.bannerImage.perex'),
  buttons: [
    {
      title: i18n.global.t('index.bannerImage.buttonQuestionnaire'),
      url: '#',
    },
  ],
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

export const cardsProgress: CardProgress[] = [
  {
    title: 'Týmová pravidelnost',
    icon: 'people',
    url: '#',
    progress: 95,
    duration: {
      current: 24,
      total: 30,
    },
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
    duration: {
      current: 24,
      total: 30,
    },
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
    duration: {
      current: 24,
      total: 30,
    },
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
    icon: 'svguse:icons/newsletter_item/icons.svg#lucide-bike',
    url: 'https://ecomail.cz/',
    following: true,
  },
  {
    title: i18n.global.t('index.newsletterFeature.aboutEvents'),
    icon: 'svguse:icons/newsletter_item/icons.svg#tabler-calendar',
    url: 'https://ecomail.cz/',
    following: true,
  },
  {
    title: i18n.global.t('index.newsletterFeature.aboutMobility'),
    icon: 'svguse:icons/newsletter_item/icons.svg#tabler-leaf',
    url: 'https://ecomail.cz/',
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
