export const useFormatPrice = () => {
  /**
   * Formats a price in the specified currency.
   *
   * @param {number} price - The price to format.
   * @param {'CZK' | 'EUR'} currency - The currency to format the price in.
   * @return {string} The formatted price in the specified currency.
   */
  const formatPriceCurrency = (price: number, currency: 'CZK' | 'EUR') => {
    switch (currency) {
      case 'CZK':
        return new Intl.NumberFormat('cs-CZ', {
          style: 'currency',
          currency: 'CZK',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price);

      case 'EUR':
        return new Intl.NumberFormat('sk-SK', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(price);
    }
  };

  return {
    formatPriceCurrency,
  };
};
