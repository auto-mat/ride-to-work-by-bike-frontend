/**
 * Helper function to calculate member count for a subsidiary
 * @param {object} subsidiary
 * @returns {number} - member count
 */
export function calculateSubsidiaryMemberCount(subsidiary) {
  let count = 0;
  subsidiary.teams.forEach((team) => {
    count += team.members_without_paid_entry_fee_by_org_coord.length;
    count += team.members_with_paid_entry_fee_by_org_coord.length;
    count += team.other_members.length;
  });
  return count;
}
