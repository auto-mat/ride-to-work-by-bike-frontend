<script lang="ts">
/**
 * ProfileAvatar Component
 *
 * @description Use this component to display and edit the user's profile avatar
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
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useApiDeleteAvatar } from '../../composables/useApiDeleteAvatar';
import { useApiPostAvatar } from '../../composables/useApiPostAvatar';
import { useApiPutAvatar } from '../../composables/useApiPutAvatar';

// stores
import { useAvatarStore } from '../../stores/avatar';

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
    const avatarStore = useAvatarStore();
    const maxFileSizeMegabytes =
      rideToWorkByBikeConfig.profileAvatarMaxFileSizeMegabytes;
    const maxFileSizeBytes = maxFileSizeMegabytes * 1024 * 1024;
    const { profileAvatarImageAcceptedFileFormats } = rideToWorkByBikeConfig;

    const isDialogOpen = ref(false);
    const isDialogRemoveOpen = ref(false);
    const fileToUpload = ref<File | null>(null);
    const avatarId = computed(() => avatarStore.getId);
    const avatarUrl = computed(() => avatarStore.getUrl);
    const avatarImgClass = computed(() =>
      avatarId.value ? 'avatar-cover' : 'avatar-contain',
    );

    const { isLoading: isLoadingPost, postAvatar } = useApiPostAvatar(logger);
    const { isLoading: isLoadingPut, putAvatar } = useApiPutAvatar(logger);
    const { isLoading: isLoadingDelete, deleteAvatar } =
      useApiDeleteAvatar(logger);
    const isLoading = computed(
      () =>
        isLoadingPost.value ||
        isLoadingPut.value ||
        isLoadingDelete.value ||
        avatarStore.getIsLoading,
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
            formats: profileAvatarImageAcceptedFileFormats,
          }),
        });
      }
    };

    const onSavePhoto = async (): Promise<void> => {
      if (!fileToUpload.value) {
        return;
      }
      const result = avatarId.value
        ? await putAvatar(avatarId.value, fileToUpload.value)
        : await postAvatar(fileToUpload.value);
      if (result) {
        fileToUpload.value = null;
        await avatarStore.loadAvatar();
        isDialogOpen.value = false;
      }
    };

    const onRemovePhoto = async (): Promise<void> => {
      if (!avatarId.value) {
        return;
      }
      const success = await deleteAvatar(avatarId.value);
      if (success) {
        await avatarStore.loadAvatar();
        isDialogRemoveOpen.value = false;
      }
    };

    return {
      profileAvatarImageAcceptedFileFormats,
      avatarId,
      avatarImgClass,
      avatarUrl,
      fileToUpload,
      isDialogOpen,
      isDialogRemoveOpen,
      isLoading,
      maxFileSizeBytes,
      onFileRejected,
      onRemovePhoto,
      onSavePhoto,
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
          :src="avatarUrl"
          :ratio="1"
          :img-class="avatarImgClass"
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
        v-if="avatarId"
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
          :accept="profileAvatarImageAcceptedFileFormats"
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

<style scoped lang="scss">
:deep(.avatar-cover) {
  object-fit: cover;
}
:deep(.avatar-contain) {
  object-fit: contain;
}
</style>
