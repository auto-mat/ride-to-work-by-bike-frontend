// libraries
import { Notify } from 'quasar';

// composables
import { i18n } from '../boot/i18n';

type UseCopyToClipboardReturn = {
  copyToClipboard: (text: string) => Promise<boolean>;
};

/**
 * Provide functionality to copy text to clipboard and show notifications.
 * @returns {UseCopyToClipboardReturn} - Object with copyToClipboard function
 */
export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  /**
   * Copy text to clipboard and show notification
   * @param {string} text - Text to copy to clipboard
   * @returns {Promise<boolean>} - Success status
   */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      // check API availability
      if (!navigator.clipboard) {
        throw new Error(i18n.global.t('notify.clipboardApiNotAvailable'));
      }
      // copy to clipboard
      await navigator.clipboard.writeText(text);
      // show success notification
      Notify.create({
        type: 'positive',
        message: i18n.global.t('notify.copiedToClipboard'),
      });
      return true;
    } catch (err) {
      // show error notification
      Notify.create({
        type: 'negative',
        message:
          err instanceof Error
            ? err.message
            : i18n.global.t('notify.copyFailed'),
      });
      return false;
    }
  };

  return {
    copyToClipboard,
  };
};
