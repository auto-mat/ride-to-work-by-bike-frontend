<script lang="ts">
/**
 * DialogInviteFriends Component
 *
 * @description Use this component to display the invite friends form within a dialog.
 * The dialog state is managed by the inviteFriends store.
 *
 * @components
 * - `FormInviteFriends`: Component that handles the invite friends form functionality.
 * - `DialogDefault`: Base dialog component used for consistent dialog styling.
 *
 * @example
 * <dialog-invite-friends />
 */

// libraries
import { computed, defineComponent } from 'vue';

// components
import FormInviteFriends from '../form/FormInviteFriends.vue';
import DialogDefault from './DialogDefault.vue';

// stores
import { useInviteFriendsStore } from '../../stores/inviteFriends';

export default defineComponent({
  name: 'DialogInviteFriends',
  components: {
    FormInviteFriends,
    DialogDefault,
  },
  setup() {
    const inviteFriendsStore = useInviteFriendsStore();

    const isDialogOpen = computed({
      get: () => inviteFriendsStore.getIsDialogOpen,
      set: (value) =>
        value
          ? inviteFriendsStore.openDialog()
          : inviteFriendsStore.closeDialog(),
    });

    return {
      isDialogOpen,
    };
  },
});
</script>

<template>
  <dialog-default v-model="isDialogOpen" data-cy="dialog-invite-friends">
    <template #title>
      {{ $t('drawerMenu.inviteFriends') }}
    </template>
    <template #content>
      <form-invite-friends />
    </template>
  </dialog-default>
</template>
