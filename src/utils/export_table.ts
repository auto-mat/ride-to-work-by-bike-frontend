/**
 * Wraps CSV value with escaping
 * @param {string | number | boolean | null} val - Value to wrap
 * @returns {string} - Wrapped and escaped value
 */
const wrapCsvValue = (val: string | number | boolean | null): string =>
  `"${val ? String(val) : ''}"`;

export { wrapCsvValue };
