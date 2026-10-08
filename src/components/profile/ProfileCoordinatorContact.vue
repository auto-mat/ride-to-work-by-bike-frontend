<script lang="ts">
/**
 * ProfileCoordinatorContact Component
 *
 * @description * Use this component to display a card with contact
 * instructions.
 *
 * Used in `ProfileDetails` component.
 *
 * @example
 * <profile-coordinator-contact />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104393&t=WcrxMvLONggUrjGt-1)
 */

// libraries
import { defineComponent } from 'vue';
import { ProfileCoordinator } from '../types/Profile';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// fixtures
import companyCoordinator from '../../../test/cypress/fixtures/companyCoordinator.json';

export default defineComponent({
  name: 'ProfileCoordinatorContact',
  setup() {
    const coordinator: ProfileCoordinator = companyCoordinator;

    const avatarSize = '56px';
    const iconSize = '18px';

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;
    const borderColor = rideToWorkByBikeConfig.colorGray;

    return {
      avatarSize,
      coordinator,
      borderColor,
      borderRadius,
      iconSize,
    };
  },
});
</script>

<template>
  <div
    v-if="coordinator"
    class="text-grey-10 q-pa-lg"
    data-cy="profile-coordinator-contact"
    :style="{ border: `1px solid ${borderColor}`, borderRadius }"
  >
    <div>
      <div
        data-cy="contact-message"
        v-html="$t('profile.textCoordinatorContact')"
      />
    </div>
    <div class="flex items-center gap-12 q-mt-md">
      <q-avatar :size="avatarSize" data-cy="coordinator-avatar">
        <q-img
          ratio="1"
          :src="coordinator.image.src"
          placeholder-src="~@/assets/svg/profile-placeholder.svg"
          :alt="coordinator.name"
        />
      </q-avatar>
      <div>
        <div data-cy="coordinator-name" class="text-weight-bold q-mt-sm">
          {{ coordinator.name }}
        </div>
        <div
          class="flex items-center gap-8 gap-x-24 q-mt-sm"
          data-cy="coordinator-contact"
        >
          <a
            :href="`tel:${coordinator.phone}`"
            class="text-grey-10"
            data-cy="coordinator-phone"
          >
            <q-icon
              name="svguse:icons/profile_coordinator_contact/icons.svg#phone"
              color="primary"
              :size="iconSize"
            />
            {{ coordinator.phone }}
          </a>
          <a
            :href="`mailto:${coordinator.email}`"
            class="text-grey-10"
            data-cy="coordinator-email"
          >
            <q-icon
              name="svguse:icons/profile_coordinator_contact/icons.svg#email"
              color="primary"
              :size="iconSize"
            />
            {{ coordinator.email }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
