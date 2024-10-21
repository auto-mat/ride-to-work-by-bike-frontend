<script lang="ts">
/**
 * SocialBar Component
 *
 * @description * Use this component to ... .
 * You can adjust its appearance by ... .
 *
 * @props
 * - `NAME` (TYPE, required): The object representing ... .
 *   It should be of type `TYPE`.
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @slots
 * - `content`: For ... .
 *   exposed props and methods:
 *     - `state`
 *
 * @example
 * <social-bar />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=6385-26491&t=Kg5tEX1Skno3i6DW-1)
 */

// libraries
import { defineComponent } from 'vue';

// composables
import { useSocialLinks } from '../../composables/useSocialLinks';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

export default defineComponent({
  name: 'SocialBar',
  setup() {
    const { socialLinks } = useSocialLinks();

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    return {
      borderRadius,
      socialLinks,
    };
  },
});
</script>

<template>
  <div
    class="bg-white q-pa-lg flex flex-wrap items-center justify-between gap-16 text-grey-10"
    :style="{ borderRadius }"
    data-cy="social-bar"
  >
    <div>
      <h2 class="text-h5 text-weight-bold q-my-none" data-cy="social-bar-title">
        {{ $t('socialBar.title') }}
      </h2>
    </div>
    <div>
      <ul
        class="flex items-center gap-16 q-my-none q-px-none"
        data-cy="social-bar-menu"
        style="list-style: none"
      >
        <li
          v-for="link in socialLinks"
          :key="link.icon"
          :data-cy="`item-${link.id}`"
        >
          <q-btn
            outline
            round
            color="grey-10"
            :href="link.url"
            target="_blank"
            :title="link.title"
            data-cy="social-bar-button"
          >
            <q-icon
              :name="link.icon"
              size="18px"
              color="grey-10"
              data-cy="social-bar-icon"
            />
          </q-btn>
        </li>
      </ul>
    </div>
  </div>
</template>
