# Card Offer System

The card offer system handles displaying special offers and prizes across the application.

## API Layer

- `useApiGetPosts` composable in `src/composables/useApiGetPosts.ts`
- Gets bearer token from `rideToWorkByBikeConfig.apiBaseRtwbbFeedBearerToken`
- Returns `posts: Ref<Offer[]>`

## Data Transformation

- `feedAdapter` in `src/adapters/feedAdapter.ts` transforms API data
- Input: `Offer[]`, Output: `CardOffer[]`
- Uses utils:
  - `get_offer_valid.ts` for date validation
  - `get_normalized_absolute_url.ts` for URL normalization
- Formats dates using `i18n.global.d()`

## Page Usage

- Homepage: Uses `ListCardOffer` component to display limited number of items
- Number of items limited by `rideToWorkByBikeConfig.indexPageVisibleOfferCount`
- Prizes page: Shows all offers for given city with city filter via `FormFieldSelectCity`

## Offer Visibility Rules

- Specified in `isOfferValidMoreThanOneDay` function in `src/utils/get_offer_valid.ts`
- No `start_date`: Offer is hidden (regardless of `end_date`)
- Has `start_date`, no `end_date`: Always visible, never grayed out
- Same `start_date` and `end_date`: Hidden (considered an Event)
- Different `start_date` and `end_date` (where `end_date` follows after `start_date`):
  - Visible and active if current date is before or on `end_date`
  - Visible but grayed out if current date is after `end_date`
