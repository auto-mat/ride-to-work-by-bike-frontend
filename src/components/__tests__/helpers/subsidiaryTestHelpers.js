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

/**
 * Helper function to get the index of a subsidiary in a sorted array
 * @param {array} subsidiaries
 * @param {object} targetSubsidiary
 * @returns {number} index
 */
export function getSortedSubsidiaryIndex(subsidiaries, targetSubsidiary) {
  // map subsidiaries to member count
  const withCounts = subsidiaries.map((subsidiary) => ({
    subsidiary,
    memberCount: calculateSubsidiaryMemberCount(subsidiary),
  }));
  // sort by member count
  const sorted = [...withCounts].sort(
    (itemA, itemB) => itemB.memberCount - itemA.memberCount,
  );
  // find index in sorted array
  return sorted.findIndex((item) => item.subsidiary.id === targetSubsidiary.id);
}
