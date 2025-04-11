import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// enums
import { TransportDirection } from '../components/types/Route';
import { TripDirection } from '../components/types/Trip';

// types
import type { Trip, TripPostPayload } from '../components/types/Trip';
import type {
  RouteItem,
  TransportType,
  RouteFeature,
} from '../components/types/Route';

// utils
import { hasTransportDistance } from '../utils/has_transport_distance';

/**
 * Adapter for converting between API and component trip data formats
 */
export const tripsAdapter = {
  /**
   * Convert Trip to RouteItem format
   * @param {Trip} trip - Trip to convert
   * @returns {RouteItem} - Route item
   */
  toRouteItem(trip: Trip): RouteItem {
    const direction =
      trip.direction === TripDirection.to
        ? TransportDirection.toWork
        : TransportDirection.fromWork;
    const distance = (trip: Trip) =>
      i18n.global.n(
        trip.distanceMeters ? trip.distanceMeters / 1000.0 : 0,
        'routeDistanceDecimalNumber',
        'en',
      );
    const transport = trip.commuteMode as TransportType;

    return {
      id: trip.id.toString(),
      date: trip.trip_date,
      direction: direction,
      distance: distance(trip),
      transport,
      // !currently we do not load trip file (used only for logging)
      file: null,
      routeFeature: null as RouteFeature | null,
    };
  },

  /**
   * Convert RouteItem to TripPostPayload format
   * @param {RouteItem} routeItem - Route item to convert
   * @returns {TripPostPayload} - Trip post payload
   */
  async toTripPostPayload(routeItem: RouteItem): Promise<TripPostPayload> {
    const direction =
      routeItem.direction === TransportDirection.toWork
        ? TripDirection.to
        : TripDirection.from;

    /**
     * `routeItem.distance` value is in km unit as localized number string
     * (with ',' or '.' decimal point)
     */
    const distanceMeters =
      parseFloat(routeItem.distance.replace(',', '.')) * 1000;

    // create payload with required fields
    const payload: TripPostPayload = {
      trip_date: routeItem.date,
      direction,
      commuteMode: routeItem.transport,
      distanceMeters: hasTransportDistance(routeItem.transport)
        ? distanceMeters
        : 0,
      sourceApplication: rideToWorkByBikeConfig.apiTripsSourceApplicationId,
    };

    // only add file if it exists
    if (routeItem.file) {
      payload.file_encoded_string = await this.toBase64(routeItem.file);
    }

    return payload;
  },

  toBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  },
};
