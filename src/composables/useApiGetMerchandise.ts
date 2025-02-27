// libraries
import { computed, ref } from 'vue';

// composables
import { useApi } from './useApi';
import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Logger } from '../components/types/Logger';
import type {
  Merchandise,
  GetMerchandiseResponse,
  MerchandiseCard,
  MerchandiseItem,
  UseApiGetMerchandiseReturn,
} from '../components/types/Merchandise';
import type { FormOption } from '../components/types/Form';
import type { Image } from '../components/types/Image';

// enums
import { Gender } from '../components/types/Profile';

// utils
import {
  getAbsoluteUrlpath,
  requestDefaultHeader,
  requestTokenHeader,
} from '../utils';

/**
 * Get merchandise composable
 * Used to getting API merchandise data
 * @param logger - Logger
 * @returns {UseApiGetMerchandiseReturn}
 */
export const useApiGetMerchandise = (
  logger: Logger | null,
): UseApiGetMerchandiseReturn => {
  const merchandise = ref<Merchandise[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const merchandiseItems = ref<MerchandiseItem[]>([]);
  const merchandiseCards = ref<Record<Gender, MerchandiseCard[]>>(
    {} as Record<Gender, MerchandiseCard[]>,
  );
  const { apiFetch } = useApi();

  /**
   * Load merchandise
   * Fetches merchandise data
   */
  const loadMerchandise = async (): Promise<void> => {
    // reset data
    logger?.debug(
      `Reseting merchandise data <${JSON.stringify(merchandise.value, null, 2)}>.`,
    );
    merchandise.value = [];
    logger?.debug(
      `Merchandise data reset to <${JSON.stringify(merchandise.value, null, 2)}>.`,
    );

    // get merchandise
    logger?.info('Get merchandise from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch merchandise
    const { data } = await apiFetch<GetMerchandiseResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiMerchandise}`,
      method: 'get',
      translationKey: 'getMerchandise',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      data.results.forEach((merch, index, array) => {
        array[index]['t_shirt_preview'] = getAbsoluteUrlpath(
          array[index]['t_shirt_preview'],
        );
      });
      merchandise.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    merchandiseItems.value = computeMerchandiseItems();
    merchandiseCards.value = computeMerchandiseCards();

    isLoading.value = false;
  };

  /**
   * Fetch next page of merchandise
   * @param {string} url - Get merchandise next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of merchandise from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization +=
      await loginStore.getAccessTokenWithRefresh();

    // fetch next page
    const { data } = await apiFetch<GetMerchandiseResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getMerchandise',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      data.results.forEach((merch, index, array) => {
        array[index]['t_shirt_preview'] = getAbsoluteUrlpath(
          array[index]['t_shirt_preview'],
        );
      });
      merchandise.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  const merchandiseGroupedByName = computed(() => {
    return groupMerchandiseByKey(merchandise.value, 'name');
  });

  /**
   * Transform merchandise data into MerchandiseItem format
   * individually for each product ID.
   * This is used to render merchandise options in form fields
   * where each product (ID) holds information about its available variants.
   */
  const computeMerchandiseItems = (): MerchandiseItem[] => {
    logger?.info('Computing merchandise items.');
    logger?.debug(
      `Transform merchandise API data <${merchandise.value.length}> items.`,
    );

    // transform items grouped by name into MerchandiseItem
    const items = merchandise.value.map((item): MerchandiseItem => {
      // get all items with the same name (variants)
      const variants = merchandiseGroupedByName.value[item.name];
      logger?.debug(
        `Merchandise item <${item.name}> has <${variants.length}> variants.`,
      );

      /**
       * Get all unique genders available for this item name and size.
       * These will determine the option values for the gender select.
       */
      const genderOptions: FormOption[] = [
        ...new Set(
          variants
            .filter((variant) => variant.size === item.size)
            .map((variant) => variant.sex),
        ),
      ].map((sex) => ({
        label: getGenderLabel(sex),
        value: sex,
      }));
      logger?.debug(
        `Merchandise gender options <${JSON.stringify(genderOptions, null, 2)}>.`,
      );

      /**
       * Get all sizes available for this item name and gender.
       * These will determine the option values for the size select.
       */
      const sizeOptions: FormOption[] = variants
        .filter((variant) => variant.sex === item.sex)
        .map((variant) => ({
          label: variant.size,
          value: variant.id,
        }));
      logger?.debug(
        `Merchandise size options <${JSON.stringify(sizeOptions, null, 2)}>.`,
      );

      // create image array from t_shirt_preview
      const images: Image[] = [
        {
          src: item.t_shirt_preview,
          alt: item.name,
        },
      ];

      // return MerchandiseItem
      const merchandiseItem = {
        id: item.id,
        label: item.name,
        gender: item.sex,
        genderOptions,
        size: item.size,
        sizeOptions,
        description: item.description,
        images,
      };
      logger?.debug(
        `Merchandise item data format <${JSON.stringify(merchandiseItem, null, 2)}>.`,
      );
      return merchandiseItem;
    });

    logger?.info(`Computed <${items.length}> merchandise items.`);
    return items;
  };

  /**
   * Transform merchandise data into MerchandiseCard format
   * grouped by gender and then by name of the product.
   * This is used to display merchandise cards with composite data
   * showing information about all variants of the product of that name.
   */
  const computeMerchandiseCards = (): Record<Gender, MerchandiseCard[]> => {
    logger?.info('Computing merchandise cards by gender.');
    logger?.debug(
      `Transform merchandise API data <${merchandise.value.length}> items to cards.`,
    );

    // group merchandise by gender
    const merchandiseGroupedByGender = groupMerchandiseByKey(
      merchandise.value,
      'sex',
    );

    logger?.debug(
      'Merchandise API data items grouped by gender' +
        ` <${JSON.stringify(merchandiseGroupedByGender, null, 2)}>.`,
    );

    // for each gender, group by name and transform to MerchandiseCard
    const cards = Object.entries(merchandiseGroupedByGender).reduce(
      (genderGroupsContainingNameGroups, [gender, genderItems]) => {
        logger?.debug(
          'Transform merchandise data grouped by gender' +
            ` <${genderItems.length}> items for <${gender}>.`,
        );

        /**
         * Group merchandise by name within given gender
         * This is done to distinguish between size options for each gender.
         */
        const merchandiseWithCurrentGenderGroupedByName = groupMerchandiseByKey(
          genderItems,
          'name',
        );

        logger?.debug(
          'Merchandise gender items grouped by name' +
            ` <${JSON.stringify(merchandiseWithCurrentGenderGroupedByName, null, 2)}>.`,
        );

        // transform each name group into MerchandiseCard
        genderGroupsContainingNameGroups[gender as Gender] = Object.entries(
          merchandiseWithCurrentGenderGroupedByName,
        ).map(([name, items]): MerchandiseCard => {
          // get first item as a reference for common properties
          const firstItem = items[0];

          // get all sizes available for this item name and gender
          const sizeOptions: FormOption[] = items.map((item) => ({
            label: item.size,
            value: item.id,
          }));

          // return MerchandiseCard
          const card = {
            label: name,
            image: firstItem.t_shirt_preview,
            description: firstItem.description,
            author: firstItem.author,
            gender: firstItem.sex,
            material: firstItem.material,
            itemIds: items.map((item) => item.id),
            sizeOptions,
          };
          logger?.debug(`Card data format <${JSON.stringify(card, null, 2)}>.`);
          return card;
        });

        return genderGroupsContainingNameGroups;
      },
      {} as Record<Gender, MerchandiseCard[]>,
    );
    return cards;
  };

  /**
   * Groups merchandise items by a given key
   * @param {Merchandise[]} items - Array of merchandise items to group
   * @param {keyof Merchandise} key - Key to group by (e.g. 'name' or 'sex')
   * @returns {Record<string, Merchandise[]>} - Record with key as string and array of merchandise as value
   */
  const groupMerchandiseByKey = (
    items: Merchandise[],
    key: keyof Merchandise,
  ): Record<string, Merchandise[]> => {
    return items.reduce(
      (groups, item) => {
        const groupKey = item[key] as string;
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
      },
      {} as Record<string, Merchandise[]>,
    );
  };

  /**
   * Get gender label
   * @param {Gender} gender - Gender string
   * @returns {string} - Gender label
   */
  const getGenderLabel = (gender: Gender) => {
    switch (gender) {
      case Gender.female:
        return i18n.global.t('global.female');
      case Gender.male:
        return i18n.global.t('global.male');
      default:
        return i18n.global.t('global.unisex');
    }
  };

  return {
    merchandise,
    merchandiseCards,
    merchandiseItems,
    isLoading,
    loadMerchandise,
  };
};
