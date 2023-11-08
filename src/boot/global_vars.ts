import { setCssVar } from 'quasar';
import { boot } from 'quasar/wrappers';

// types
import { ConfigGlobal } from '../components/types';

// config
const rideToWorkByBikeConfig: ConfigGlobal = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);

const initVars = (): void => {
  setCssVar('white', rideToWorkByBikeConfig.colorWhite);
  setCssVar('black', rideToWorkByBikeConfig.colorBlack);
  setCssVar('primary', rideToWorkByBikeConfig.colorPrimary);
  setCssVar('secondary', rideToWorkByBikeConfig.colorSecondary);
  setCssVar('info', rideToWorkByBikeConfig.colorGrayLight);
};

export { rideToWorkByBikeConfig, initVars };

export default boot((): void => {
  initVars();
});
