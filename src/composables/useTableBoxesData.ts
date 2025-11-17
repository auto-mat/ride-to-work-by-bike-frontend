// libraries
import { computed } from 'vue';

// composables
import { i18n } from 'src/boot/i18n';

// stores
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

// types
import type { Ref } from 'vue';
import type {
  Box,
  PackageTransaction,
} from 'src/components/types/AdminOrganisation';

export interface TableBoxRow {
  trackingNumber: string;
  trackingLink: string;
  packageStatus: boolean;
  recipients: string;
  recipientCount: number;
  lastModified: string;
  address: string;
}

/**
 * Calculate recipients display text
 * If only one recipient, show their name; otherwise show count
 * @param {Box} box - Box from API
 * @returns {Object} - Recipients info
 */
function getRecipientsInfo(box: Box): {
  recipients: string;
  recipientCount: number;
} {
  const allTransactions: PackageTransaction[] = [];

  // Flatten all package_transactions from all team_packages
  box.team_packages.forEach((teamPackage) => {
    allTransactions.push(...teamPackage.package_transactions);
  });

  const recipientCount = allTransactions.length;

  if (recipientCount === 1) {
    return {
      recipients: allTransactions[0].name,
      recipientCount,
    };
  } else {
    // Use i18n pluralization for Czech: 0|1|2-4|5+
    const recipientsWord = i18n.global.t(
      'table.textRecipients',
      recipientCount,
    );
    return {
      recipients: `${recipientCount} ${recipientsWord}`,
      recipientCount,
    };
  }
}

/**
 * Transforms Box to TableBoxRow
 * @param {Box} box - Box from API
 * @param {string} address - Address of subsidiary
 * @returns {TableBoxRow} - Flattened row for table
 */
function transformBoxToRow(box: Box, address: string): TableBoxRow {
  const { recipients, recipientCount } = getRecipientsInfo(box);

  return {
    trackingNumber: box.carrier_identification,
    trackingLink: box.tracking_link,
    packageStatus: box.dispatched,
    recipients,
    recipientCount,
    lastModified: box.modified,
    address,
  };
}

/**
 * Build data object for boxes table
 * Transforms AdminOrganisation from store to flat array of table rows
 * @returns {Ref<TableBoxRow[]>} - Array of table rows
 */
export const useTableBoxesData = (): {
  boxesData: Ref<TableBoxRow[]>;
} => {
  const adminOrganisationStore = useAdminOrganisationStore();

  const boxesData = computed<TableBoxRow[]>(() => {
    const organisation = adminOrganisationStore.getCurrentAdminOrganisation;

    if (!organisation) {
      return [];
    }

    const allBoxes: TableBoxRow[] = [];

    // Loop through subsidiaries to extract boxes
    organisation.subsidiaries.forEach((subsidiary) => {
      if (subsidiary.boxes && subsidiary.boxes.length > 0) {
        const address = `${subsidiary.street} ${subsidiary.street_number}, ${subsidiary.city}`;

        subsidiary.boxes.forEach((box: Box) => {
          allBoxes.push(transformBoxToRow(box, address));
        });
      }
    });

    return allBoxes;
  });

  return {
    boxesData,
  };
};
