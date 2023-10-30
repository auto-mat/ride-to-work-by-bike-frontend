import { setCssVar } from 'quasar';
import { boot } from 'quasar/wrappers';

// config
const rideToWorkByBikeConfig = JSON.parse(
  process.env.RIDE_TO_WORK_BY_BIKE_CONFIG,
);

const initVars = () => {
  setCssVar('white', rideToWorkByBikeConfig.colorWhite);
  setCssVar('black', rideToWorkByBikeConfig.colorBlack);
  setCssVar('primary', rideToWorkByBikeConfig.colorPrimary);
  setCssVar('secondary', rideToWorkByBikeConfig.colorSecondary);
  setCssVar('info', rideToWorkByBikeConfig.colorGrayLight);
};

export { rideToWorkByBikeConfig, initVars };

export default boot(() => {
  initVars();
});
