/**
 * A composable function that provides utilities for managing URL parameters.
 */
export const useUrlParams = () => {
  /**
   * Retrieves the current URL parameters as an object.
   * @returns An object containing the URL parameters as key-value pairs.
   */
  const getUrlParams = (): Record<string, string> => {
    const urlParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlParams);
  };

  /**
   * Sets a specific URL parameter with the provided key and value.
   * @param key - The key of the URL parameter to be set.
   * @param value - The value to be set for the URL parameter.
   */
  const setUrlParam = (key: string, value: string): void => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value);
    window.history.pushState(
      null,
      '',
      `${window.location.origin}${
        window.location.pathname
      }?${urlParams.toString()}`,
    );
  };

  /**
   * Retrieves the value of a specific URL parameter.
   * @param key - The key of the URL parameter to be retrieved.
   * @param defaultValue - The default parameter value.
   * @returns The value of the URL parameter.
   */
  const getUrlParam = (
    key: string,
    defaultValue: string | null = null,
  ): string | null => {
    const urlParams = getUrlParams();
    return urlParams[key] || defaultValue;
  };

  return {
    getUrlParams,
    setUrlParam,
    getUrlParam,
  };
};
