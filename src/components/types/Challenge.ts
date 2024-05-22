// types
import type { TransportType } from './Route';

export interface ChallengeDescription {
  dateStart: string;
  dateEnd: string;
  link: {
    title: string;
    url: string;
  };
  description: string;
  transportTypes: TransportType[];
}
