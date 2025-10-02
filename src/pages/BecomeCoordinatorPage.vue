<script lang="ts">
/**
 * BecomeCoordinatorPage Component
 *
 * The `BecomeCoordinatorPage` displays info on becoming a coordinator.
 *
 * @layout
 * - `MainLayout`: Default layout with sidebar on desktop.
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105730&t=DGufCIdIJs2I0lEM-1)
 */

// libraries
import { defineComponent } from 'vue';

// components
import FormCoordinatorApplication from 'components/form/FormCoordinatorApplication.vue';
import PageHeading from 'components/global/PageHeading.vue';

export default defineComponent({
  name: 'BecomeCoordinatorPage',
  components: {
    FormCoordinatorApplication,
    PageHeading,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <q-page class="overflow-hidden" data-cy="q-main">
    <div class="q-px-lg bg-white q-pb-xl q-pt-lg">
      <!-- Section title -->
      <div class="col-12 flex flex-wrap items-center justify-between gap-16">
        <!-- Page title -->
        <page-heading data-cy="company-coordinator-title">
          {{ $t('companyCoordinator.titleBecomeCoordinator') }}
        </page-heading>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-lg-8">
          <!-- Section: description -->
          <div
            class="q-mt-lg"
            v-html="$t('companyCoordinator.textBecomeCoordinator')"
            data-cy="company-coordinator-text"
          />
          <div class="q-mt-lg">
            <form-coordinator-application />
          </div>
        </div>
        <div class="col-lg-4">
          <q-icon
            name="mdi-account-box-outline"
            size="180px"
            color="grey-5"
            class="q-mx-auto"
            data-cy="company-coordinator-icon"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>
