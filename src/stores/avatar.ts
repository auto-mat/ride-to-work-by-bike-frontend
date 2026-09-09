// libraries
import { defineStore } from 'pinia';

// composables
import { useApiGetAvatar } from '../composables/useApiGetAvatar';
import { useApiGetAvatarRenderPrimary } from '../composables/useApiGetAvatarRenderPrimary';

// types
import type { Logger } from '../components/types/Logger';

export const useAvatarStore = defineStore('avatar', {
  state: () => ({
    $log: null as Logger | null,
    // we only use primary avatar id
    id: null as number | null,
    // `render_primary` image or `default_avatar.src`
    url: null as string | null,
    isLoading: false,
  }),

  getters: {
    getId(): number | null {
      return this.id;
    },
    getUrl(): string {
      // provide empty url fallback to fix type error on <q-img> widget
      return this.url || '';
    },
    getIsLoading(): boolean {
      return this.isLoading;
    },
  },

  actions: {
    setAvatar(id: number | null, url: string | null): void {
      this.id = id;
      this.url = url;
    },
    resetPersistentProperties(): void {
      this.id = null;
      this.url = null;
    },
    /**
     * Load the avatar store from the API
     * Used after login and avatar update
     * @returns {Promise<void>}
     */
    async loadAvatar(): Promise<void> {
      this.isLoading = true;
      const { getAvatar } = useApiGetAvatar(this.$log);
      const response = await getAvatar();

      if (response && 'results' in response) {
        const primaryAvatar = response.results.find((avatar) => avatar.primary);
        if (primaryAvatar) {
          const { getAvatarRender } = useApiGetAvatarRenderPrimary(this.$log);
          const renderUrl = await getAvatarRender();
          this.setAvatar(primaryAvatar.id, renderUrl);
        } else {
          this.setAvatar(null, null);
        }
      } else if (response && 'default_avatar' in response) {
        this.setAvatar(null, response.default_avatar.src);
      } else {
        this.setAvatar(null, null);
      }

      this.isLoading = false;
    },
  },

  persist: {
    omit: ['isLoading'],
  },
});
