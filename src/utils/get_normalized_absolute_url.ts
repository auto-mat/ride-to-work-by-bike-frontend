/**
 * Normalizes a URL by ensuring it has a proper HTTPS protocol prefix.
 * If URL doesn't start with 'http://' or 'https://', it prepends 'https://'.
 * The function also trims any whitespace from the input URL.
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL with proper HTTPS protocol
 *   or empty string if url is empty
 */
export const getNormalizedAbsoluteUrl = (url: string): string => {
  // trim whitespace
  url = url.trim();
  // empty url
  if (!url) {
    return '';
  }
  // check if url starts with http:// or https://
  if (!/^https?:\/\//i.test(url)) {
    // If not, prepend https://
    url = 'https://' + url;
  }

  return url;
};
