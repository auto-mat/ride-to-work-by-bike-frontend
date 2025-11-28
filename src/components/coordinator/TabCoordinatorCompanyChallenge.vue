<script lang="ts">
/**
 * TabCoordinatorCompanyChallenge Component
 *
 * @description * Use this component to display a tab with company challenges.
 *
 * @components
 * - `DialogDefault`: Component to display a dialog.
 * - `FormCompanyChallenge`: Component to display a form for creating a company challenge.
 * - `TableCompanyChallenge`: Component to display a table with company challenges.
 *
 * @example
 * <tab-coordinator-company-challenge />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-105355&t=S3zaCcFdhkmkXEey-1)
 */

// libraries
import { QForm } from 'quasar';
import { defineComponent, ref } from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';
import FormCompanyChallenge from '../form/FormCompanyChallenge.vue';
import TableCompanyChallenge from './TableCompanyChallenge.vue';

// stores
import { useAdminCompetitionStore } from 'src/stores/adminCompetition';

export default defineComponent({
  name: 'TabCoordinatorCompanyChallenge',
  components: {
    DialogDefault,
    FormCompanyChallenge,
    TableCompanyChallenge,
  },
  setup() {
    const isDialogOpen = ref(false);
    const formCompanyChallengeRef = ref<typeof QForm | null>(null);

    // Stores
    const adminCompetitionStore = useAdminCompetitionStore();

    const closeDialog = (): void => {
      isDialogOpen.value = false;
    };
    const openDialog = async (): Promise<void> => {
      // Reset form when opening dialog
      await adminCompetitionStore.resetCompanyChallengeForm();
      isDialogOpen.value = true;
    };

    const onSubmit = async (): Promise<void> => {
      const success = await adminCompetitionStore.createCompanyChallenge();
      if (success) {
        adminCompetitionStore.resetCompanyChallengeForm();
        closeDialog();
      }
    };
    const onReset = (): void => {
      adminCompetitionStore.resetCompanyChallengeForm();
      closeDialog();
    };

    return {
      formCompanyChallengeRef,
      isDialogOpen,
      onReset,
      onSubmit,
      openDialog,
    };
  },
});
</script>

<template>
  <div data-cy="tab-coordinator-company-challenge">
    <div class="row justify-between items-center gap-8 q-mt-lg">
      <!-- Title -->
      <h3
        class="col-auto text-h6 text-black q-my-none"
        data-cy="table-company-challenge-title"
      >
        {{ $t('table.titleCompanyChallenge') }}
      </h3>
      <!-- Button: Create company challenge -->
      <q-btn
        class="col-auto"
        color="primary"
        unelevated
        rounded
        @click.prevent="openDialog"
        data-cy="button-create-company-challenge"
      >
        <q-icon name="add" size="18px" color="white" class="q-mr-xs" />
        {{ $t('coordinator.buttonCreateCompanyChallenge') }}
      </q-btn>
    </div>
    <!-- Table: Company challenges -->
    <table-company-challenge
      class="q-mt-lg"
      data-cy="table-company-challenge"
    />

    <!-- Dialog: Create company challenge -->
    <dialog-default
      v-model="isDialogOpen"
      data-cy="dialog-create-company-challenge"
    >
      <template #title>
        {{ $t('coordinator.titleCreateCompanyChallenge') }}
      </template>
      <template #content>
        <q-form
          ref="formCompanyChallengeRef"
          @submit="onSubmit"
          @reset="onReset"
        >
          <form-company-challenge />
          <!-- Action buttons -->
          <div class="flex justify-end q-mt-lg">
            <div class="flex gap-8">
              <q-btn
                type="reset"
                rounded
                unelevated
                outline
                color="primary"
                data-cy="dialog-button-cancel"
              >
                {{ $t('navigation.discard') }}
              </q-btn>
              <q-btn
                type="submit"
                rounded
                unelevated
                color="primary"
                data-cy="dialog-button-submit"
              >
                {{ $t('coordinator.buttonDialogCreateCompanyChallenge') }}
              </q-btn>
            </div>
          </div>
        </q-form>
      </template>
    </dialog-default>
  </div>
</template>
