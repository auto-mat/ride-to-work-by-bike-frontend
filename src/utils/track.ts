import { logger } from '../boot/logger';
import { matomo } from '../boot/matomo';
import { rideToWorkByBikeConfig } from '../boot/global_vars';
import { timestampToDatetimeString } from './index';

type EventTrack = {
  detail: {
    targetName: string;
    timestamp: number;
    value?: string;
  };
};

const onTrack = (evt: EventTrack): void => {
  const dateTime = timestampToDatetimeString(evt.detail.timestamp / 1000.0);
  logger.debug(
    `Tracking event detail <${dateTime}>,` +
      ` <${evt.detail.targetName}>, <${evt.detail.value}>`,
  );
  if (rideToWorkByBikeConfig.urlMatomoAnalytics !== 'disable') {
    let value;
    if (evt.detail.value) {
      value = `${dateTime}, <${evt.detail.value}>`;
    } else {
      value = `${dateTime}`;
    }
    matomo.trackEvent(evt.detail.targetName, 'click', value);
  }
};
export { onTrack };
