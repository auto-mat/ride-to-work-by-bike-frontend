<script lang="ts">
/**
 * ProfileAvatar Component
 *
 * @description Use this component to display and edit the user's profile photo
 * Note: This component is used on `ProfileDetails` component.
 *
 * @components
 * - `DialogDefault`: Component to render the edit/confirm dialogs.
 *
 * @example
 * <profile-avatar />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104402&t=X9v4MDfuhfVpvlZH-4)
 */

// libraries
import { Notify } from 'quasar';
import { computed, defineComponent, inject, ref, watch } from 'vue';

// components
import DialogDefault from '../global/DialogDefault.vue';

// composables
import { i18n } from '../../boot/i18n';
import { useApiDeletePhoto } from '../../composables/useApiDeletePhoto';
import { useApiPostPhoto } from '../../composables/useApiPostPhoto';

// stores
import { useRegisterChallengeStore } from '../../stores/registerChallenge';

// types
import type { Logger } from '../types/Logger';
import type { QRejectedEntry } from 'quasar';

export default defineComponent({
  name: 'ProfileAvatar',
  components: {
    DialogDefault,
  },
  setup() {
    const logger = inject('vuejs3-logger') as Logger | null;
    const registerChallengeStore = useRegisterChallengeStore();
    const maxFileSizeMegabytes = 5;
    const maxFileSizeBytes = maxFileSizeMegabytes * 1024 * 1024;
    const acceptedFileFormats = '.jpg, .jpeg, .png, .webp';

    const isDialogOpen = ref(false);
    const isDialogRemoveOpen = ref(false);
    const fileToUpload = ref<File | null>(null);
    const photo = computed(() => registerChallengeStore.getPhoto);

    const { isLoading: isLoadingUpload, postPhoto } = useApiPostPhoto(logger);
    const { isLoading: isLoadingDelete, deletePhoto } =
      useApiDeletePhoto(logger);
    const isLoading = computed(
      () => isLoadingUpload.value || isLoadingDelete.value,
    );

    // discard the staged file when dialog is closed
    watch(isDialogOpen, (isOpen) => {
      if (!isOpen) {
        fileToUpload.value = null;
      }
    });

    // show a notification if file too large or wrong format
    const onFileRejected = (rejectedEntries: QRejectedEntry[]): void => {
      if (!rejectedEntries.length) {
        return;
      }
      if (rejectedEntries[0].failedPropValidation === 'max-file-size') {
        Notify.create({
          type: 'negative',
          message: i18n.global.t('profile.messagePhotoTooLarge', {
            size: `${maxFileSizeMegabytes} MB`,
          }),
        });
      } else if (rejectedEntries[0].failedPropValidation === 'accept') {
        Notify.create({
          type: 'negative',
          message: i18n.global.t('profile.messagePhotoInvalidFormat', {
            formats: acceptedFileFormats,
          }),
        });
      }
    };

    const onSavePhoto = async (): Promise<void> => {
      if (!fileToUpload.value) {
        return;
      }
      const result = await postPhoto(fileToUpload.value);
      if (result) {
        fileToUpload.value = null;
        await registerChallengeStore.loadRegisterChallengeToStore();
        isDialogOpen.value = false;
      }
    };

    const onRemovePhoto = async (): Promise<void> => {
      if (!photo.value) {
        return;
      }
      const success = await deletePhoto(photo.value.id);
      if (success) {
        await registerChallengeStore.loadRegisterChallengeToStore();
        isDialogRemoveOpen.value = false;
      }
    };

    return {
      acceptedFileFormats,
      fileToUpload,
      isDialogOpen,
      isDialogRemoveOpen,
      isLoading,
      maxFileSizeBytes,
      onFileRejected,
      onRemovePhoto,
      onSavePhoto,
      photo,
    };
  },
});
</script>

<template>
  <div data-cy="profile-avatar">
    <div class="relative-position inline-block">
      <!-- Avatar -->
      <q-avatar size="96px" color="white" data-cy="profile-avatar-image">
        <q-img
          :src="photo?.url"
          :ratio="1"
          placeholder-src="~assets/svg/profile-placeholder.svg"
          data-cy="profile-avatar-img"
        />
        <!-- Loading spinner -->
        <q-inner-loading :showing="isLoading" data-cy="profile-avatar-loading">
          <q-spinner color="primary" size="32px" />
        </q-inner-loading>
      </q-avatar>
      <!-- Button: Edit -->
      <q-btn
        round
        unelevated
        color="primary"
        icon="mdi-pencil"
        size="sm"
        class="absolute-bottom-right"
        @click="isDialogOpen = true"
        data-cy="profile-avatar-edit-button"
      />
      <!-- Button: Remove -->
      <q-btn
        v-if="photo"
        round
        unelevated
        color="negative"
        icon="mdi-delete"
        size="sm"
        class="absolute-top-right"
        :disable="isLoading"
        :aria-label="$t('profile.buttonRemovePhoto')"
        @click="isDialogRemoveOpen = true"
        data-cy="profile-avatar-remove-button"
      />
    </div>

    <!-- Dialog: Edit photo -->
    <dialog-default v-model="isDialogOpen" data-cy="profile-avatar-dialog">
      <template #title>
        <div data-cy="profile-avatar-dialog-title">
          {{ $t('profile.titleUpdatePhoto') }}
        </div>
      </template>
      <template #content>
        <!-- File picker -->
        <q-file
          dense
          outlined
          v-model="fileToUpload"
          :label="$t('profile.buttonUploadPhoto')"
          :accept="acceptedFileFormats"
          :max-file-size="maxFileSizeBytes"
          :disable="isLoading"
          @rejected="onFileRejected"
          data-cy="profile-avatar-input-file"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-camera" />
          </template>
        </q-file>
        <div class="flex justify-end gap-8 q-mt-md">
          <!-- Button: Cancel -->
          <q-btn
            unelevated
            rounded
            outline
            color="primary"
            :disable="isLoading"
            @click="isDialogOpen = false"
            data-cy="profile-avatar-dialog-cancel"
          >
            {{ $t('global.cancel') }}
          </q-btn>
          <!-- Button: Save -->
          <q-btn
            unelevated
            rounded
            color="primary"
            :disable="!fileToUpload"
            :loading="isLoading"
            @click="onSavePhoto"
            data-cy="profile-avatar-dialog-save"
          >
            {{ $t('navigation.save') }}
          </q-btn>
        </div>
      </template>
    </dialog-default>

    <!-- Dialog: Confirm remove -->
    <dialog-default
      v-model="isDialogRemoveOpen"
      data-cy="profile-avatar-dialog-remove"
    >
      <template #title>
        <div data-cy="profile-avatar-dialog-remove-title">
          {{ $t('profile.titleDialogRemovePhoto') }}
        </div>
      </template>
      <template #content>
        <div data-cy="profile-avatar-dialog-remove-description">
          {{ $t('profile.labelRemovePhotoDescription') }}
        </div>
        <div class="flex justify-end gap-8 q-mt-md">
          <!-- Button: Cancel -->
          <q-btn
            unelevated
            rounded
            outline
            color="primary"
            :disable="isLoading"
            @click="isDialogRemoveOpen = false"
            data-cy="profile-avatar-dialog-remove-cancel"
          >
            {{ $t('global.cancel') }}
          </q-btn>
          <!-- Button: Confirm remove -->
          <q-btn
            unelevated
            rounded
            color="negative"
            :loading="isLoading"
            @click="onRemovePhoto"
            data-cy="profile-avatar-dialog-remove-confirm"
          >
            {{ $t('global.delete') }}
          </q-btn>
        </div>
      </template>
    </dialog-default>
  </div>
</template>
