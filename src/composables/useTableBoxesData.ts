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
  addressee: string;
}

/**
 * Calculate recipients display text
 * If one recipient, show their name, otherwise show count
 * @param {Box} box - Box from API
 * @returns {Object} - Recipients info
 */
function getRecipientsInfo(box: Box): {
  recipients: string;
  recipientCount: number;
} {
  const allTransactions: PackageTransaction[] = [];
  // get array of all team packages
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
    // pluralized label
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
 * Transform Box to TableBoxRow
 * @param {Box} box - Box from API
 * @param {string} address - Subsidiary address
 * @param {string} addressee - Box addressee name
 * @returns {TableBoxRow} - Table row data
 */
function transformBoxToRow(
  box: Box,
  address: string,
  addressee: string,
): TableBoxRow {
  const { recipients, recipientCount } = getRecipientsInfo(box);
  return {
    trackingNumber: box.carrier_identification,
    trackingLink: box.tracking_link,
    packageStatus: box.dispatched,
    recipients,
    recipientCount,
    lastModified: box.modified,
    address,
    addressee,
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
    // loop through subsidiaries to extract boxes
    organisation.subsidiaries.forEach((subsidiary) => {
      if (subsidiary.boxes && subsidiary.boxes.length > 0) {
        // construct subsidiary address with fallback
        let address = '';
        if (subsidiary.street && subsidiary.street_number && subsidiary.city) {
          address = `${subsidiary.street} ${subsidiary.street_number}, ${subsidiary.city}`;
        } else {
          address = `${i18n.global.t('table.labelAddress')}: ${i18n.global.t('table.labelCellEmpty')}`;
        }
        // get addressee name with fallback
        const addressee = subsidiary.box_addressee_name || '';
        // transfrom boxes to table rows
        subsidiary.boxes.forEach((box: Box) => {
          allBoxes.push(transformBoxToRow(box, address, addressee));
        });
      }
    });

    return allBoxes;
  });

  return {
    boxesData,
  };
};
