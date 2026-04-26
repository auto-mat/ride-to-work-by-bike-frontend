import { EventBus } from 'quasar';
import { boot } from 'quasar/wrappers';

export const bus = new EventBus();

export default boot(({ app }) => {
  app.provide('bus', bus);
});
