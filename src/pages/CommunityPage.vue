<script lang="ts">
/**
 * CommunityPage Component
 *
 * The `CommunityPage` displays information about community events.
 *
 * @components
 * - `LoginRegisterHeader`: Header for login and registration pages.
 *
 * @layout
 * - `LoginRegisterLayout`: Layout for login and registration pages.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104327&t=ZZSrUuLgRLYixhUu-1)
 */
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CommunityPage',
  setup() {
    const city = ref<string | null>(null);

    return {
      city,
    };
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white">
      <!-- Section title -->
      <div class="col-12 flex flex-wrap items-center justify-between gap-4">
        <!-- Page title -->
        <h1
          class="text-h5 text-bold text-white q-my-none"
          data-cy="community-page-title"
        >
          {{ $t('community.titleCommunity') }}
        </h1>

        <!-- Select: City -->
        <FormFieldSelectCity v-model="city" data-cy="community-select-city" />
      </div>

      <!-- Section: Local events -->
      <div>
        <h2 class="text-body1 text-bold q-my-none" data-cy="info-title">
          {{ $t('community.titleLocalEvents') }}
        </h2>
        <ListEventsLocal />
      </div>

      <!-- TODO: Section Forum -->

      <!-- TODO: Section Locations -->

      <!-- TODO: Section Social networks -->

      <!-- TODO: Section News -->

      <!-- TODO: Section Instagram -->
    </div>
  </q-page>
</template>
