<script lang="ts">
/**
 * DeleteAccount Component
 *
 * @description Use this component to render delete account section with
 * confirmation dialog.
 * Note: This component is used in `ProfileDetails` component.
 *
 * @components
 * - `DialogDefault`: Component to render confirmation dialog.
 * - `SectionHeading`: Component to render section heading.
 *
 * @example
 * <delete-account />
 *
 * Figma design is not available for this component.
 */

// libraries
import { defineComponent, ref } from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';
import SectionHeading from '../global/SectionHeading.vue';

export default defineComponent({
  name: 'DeleteAccount',
  components: {
    DialogDefault,
    SectionHeading,
  },
  setup() {
    const iconSize = '18px';
    const dialogDeleteAccount = ref(false);

    const onDeleteAccount = () => {
      // TODO: Call API to delete account
    };

    return {
      dialogDeleteAccount,
      iconSize,
      onDeleteAccount,
    };
  },
});
</script>

<template>
  <div data-cy="delete-account">
    <!-- Section heading -->
    <section-heading class="q-mt-xl" data-cy="delete-account-title">
      {{ $t('profile.titleDeleteAccount') }}
    </section-heading>

    <div class="q-mt-lg" data-cy="delete-account-content">
      <!-- Text: Delete account -->
      <div>
        {{ $t('profile.labelDeleteAccount') }}
      </div>
      <!-- Button: Delete account -->
      <q-btn
        unelevated
        rounded
        color="negative"
        class="q-mt-md"
        @click.prevent="dialogDeleteAccount = true"
        data-cy="delete-account-button"
      >
        <!-- Icon -->
        <q-icon
          name="mdi-delete"
          :size="iconSize"
          class="q-mr-sm"
          data-cy="delete-account-icon"
        />
        <!-- Text -->
        {{ $t('profile.buttonDeleteAccount') }}
      </q-btn>
      <!-- Dialog: Delete account -->
      <dialog-default
        v-model="dialogDeleteAccount"
        data-cy="delete-account-dialog"
      >
        <!-- Title -->
        <template #title>
          <div data-cy="delete-account-dialog-title">
            {{ $t('profile.titleDialogDeleteAccount') }}
          </div>
        </template>
        <!-- Content -->
        <template #content>
          <div data-cy="delete-account-dialog-description">
            {{ $t('profile.labelDeleteAccountDescription') }}
          </div>
          <!-- Buttons -->
          <div class="flex justify-end gap-8 q-mt-md">
            <!-- Button: Cancel -->
            <q-btn
              unelevated
              rounded
              outline
              color="primary"
              @click="dialogDeleteAccount = false"
              data-cy="delete-account-dialog-cancel"
            >
              {{ $t('global.cancel') }}
            </q-btn>
            <!-- Button: Delete -->
            <q-btn
              unelevated
              rounded
              color="negative"
              @click="onDeleteAccount"
              data-cy="delete-account-dialog-delete"
            >
              {{ $t('global.delete') }}
            </q-btn>
          </div>
        </template>
      </dialog-default>
    </div>
  </div>
</template>
