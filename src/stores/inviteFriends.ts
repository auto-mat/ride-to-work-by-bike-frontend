import { defineStore } from 'pinia';

export const useInviteFriendsStore = defineStore('inviteFriends', {
  state: () => ({
    isDialogOpen: false,
  }),

  getters: {
    getIsDialogOpen(): boolean {
      return this.isDialogOpen;
    },
  },

  actions: {
    openDialog(): void {
      this.isDialogOpen = true;
    },
    closeDialog(): void {
      this.isDialogOpen = false;
    },
  },
});
