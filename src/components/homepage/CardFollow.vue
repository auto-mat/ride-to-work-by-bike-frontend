<script lang="ts">
/**
 * CardFollow Component
 *
 * The `CardFollow` component displays a card with social media details.
 *
 * @description
 * This component presents links to organization's social media accounts.
 * Border radius can be controlled by `config` parameter.
 *
 * Note: This component is commonly used within the `ListCardFollow`
 * component.
 *
 * @props
 * - `card` (Object, required): The card object containing details related to
 *   the follow action. It should be of type `CardFollow`.
 *
 * @example
 * <card-follow
 *   :card="followDetails"
 * />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105629&mode=dev)
 */

// libraires
import { defineComponent } from 'vue';

// types
import { CardFollow } from '../types';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'CardFollow',
  props: {
    card: {
      type: Object as () => CardFollow,
      required: true,
    },
  },
  setup() {
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const borderColor = rideToWorkByBikeConfig.colorGrayMiddle;

    const onClickCard = (url: string) => {
      window.open(url, '_blank');
    };

    return {
      borderRadius,
      borderColor,
      onClickCard,
    };
  },
});
</script>

<template>
  <div data-cy="card-follow-wrapper">
    <q-card
      v-ripple
      data-cy="card-follow"
      class="cursor-pointer q-hoverable q-px-md q-py-md bg-white"
      bordered
      flat
      :style="{
        'border-radius': borderRadius,
        border: `1px solid ${borderColor}`,
      }"
      @click="onClickCard(card.url)"
    >
      <q-card-section horizontal>
        <!-- Card avatar -->
        <q-item-section
          avatar
          class="items-center"
          data-cy="card-follow-avatar"
        >
          <!-- Image -->
          <q-avatar size="56px">
            <q-img
              :src="card.image.src"
              :alt="card.image.alt"
              ratio="1"
              data-cy="card-follow-image"
            />
          </q-avatar>
        </q-item-section>
        <!-- Card content -->
        <q-item-section class="col q-pl-sm">
          <div class="row no-wrap items-center">
            <div class="col">
              <!-- Link follow on social media -->
              <q-item-label
                class="text-body1 text-weight-bold text-grey-10"
                data-cy="card-follow-title"
                >{{ card.title }}</q-item-label
              >
              <!-- Label: Social media handle -->
              <q-item-label
                class="q-mt-xs text-subtitle2 text-weight-regular text-grey-8"
                data-cy="card-follow-handle"
                >{{ card.handle }}</q-item-label
              >
            </div>
            <q-icon
              name="svguse:/icons/lucide.svg#arrow-up-right"
              size="18px"
              color="primary"
              class="col-auto"
              data-cy="card-follow-link-icon"
            />
          </div>
        </q-item-section>
      </q-card-section>
    </q-card>
  </div>
</template>
