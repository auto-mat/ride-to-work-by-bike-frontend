<script lang="ts">
/**
 * DiplomasList Component
 *
 * @description * Use this component to display the list of diplomas
 * the current user earned across all challenge participations.
 *
 * @components
 * - `SectionColumns`: Component to layout content in columns.
 *
 * @example
 * <diplomas-list />
 */

// libraries
import { computed, defineComponent, onMounted } from 'vue';

// components
import SectionColumns from '../homepage/SectionColumns.vue';

// config
import { rideToWorkByBikeConfig } from '../../boot/global_vars';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { Diploma } from '../types/ApiRegistration';

export default defineComponent({
  name: 'DiplomasList',
  components: {
    SectionColumns,
  },
  setup() {
    const registerChallengeStore = useRegisterChallengeStore();

    const diplomas = computed<Diploma[]>(
      () => registerChallengeStore.getDiplomas,
    );

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    const isDiplomaDownloadable = (diploma: Diploma): boolean => {
      return !!diploma.url;
    };

    const onDownloadDiploma = (diploma: Diploma): void => {
      if (isDiplomaDownloadable(diploma)) {
        window.open(diploma.url, '_blank');
      }
    };

    onMounted(async () => {
      if (!registerChallengeStore.getDiplomas.length) {
        await registerChallengeStore.loadRegisterChallengeToStore();
      }
    });

    return {
      borderRadius,
      diplomas,
      isDiplomaDownloadable,
      onDownloadDiploma,
    };
  },
});
</script>

<template>
  <div>
    <!-- Empty state -->
    <div
      v-if="diplomas.length === 0"
      class="q-mt-lg q-mb-xl text-grey-7"
      data-cy="diplomas-list-empty-state"
    >
      {{ $t('diplomas.textEmptyState') }}
    </div>
    <!-- Cards -->
    <section-columns
      v-else
      :columns="3"
      class="q-col-gutter-lg q-mt-md"
      data-cy="diplomas-list-cards"
    >
      <q-card
        v-for="diploma in diplomas"
        :key="diploma.id"
        class="full-height"
        :style="{ 'border-radius': borderRadius }"
        flat
        bordered
        data-cy="diplomas-list-card"
      >
        <q-card-section>
          <!-- Name -->
          <div class="text-subtitle1" data-cy="diplomas-list-card-name">
            {{ diploma.name }}
          </div>
          <!-- Year -->
          <div
            class="text-caption text-grey-7"
            data-cy="diplomas-list-card-year"
          >
            {{ diploma.year }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <!-- Button: Download -->
          <q-btn
            unelevated
            rounded
            outline
            no-caps
            color="primary"
            :disable="!isDiplomaDownloadable(diploma)"
            @click="onDownloadDiploma(diploma)"
            data-cy="diplomas-list-card-button-download"
          >
            <q-icon name="mdi-download" size="18px" class="q-mr-sm" />
            {{ $t('diplomas.buttonDownload') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </section-columns>
  </div>
</template>
