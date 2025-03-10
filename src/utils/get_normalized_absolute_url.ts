export const getNormalizedAbsoluteUrl = (url: string): string => {
  // trim whitespace
  url = url.trim();
  // check if url starts with http:// or https://
  if (!/^https?:\/\//i.test(url)) {
    // If not, prepend https://
    url = 'https://' + url;
  }

  return url;
};
