export const useValidation = () => {
  const isEmail = (value: string): boolean => {
    /**
     * Match 99% of valid email addresses and will not pass validation
     * for email addresses that have, for instance
     * - Dots in the beginning
     * - Multiple dots at the end
     * But at the same time it will allow part after @ to be IP address.
     *
     * https://uibakery.io/regex-library/email
     */
    const regex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return regex.test(value);
  };

  const isEmailList = (value: string): boolean => {
    /**
     * Match a list of emails separated by comma
     * Uses the isEmail function for each email
     */
    const emails = value.split(',');
    // remove whitespace
    const trimmedEmails = emails.map((email) => email.trim());
    return trimmedEmails.every((email) => isEmail(email));
  };

  const isPhone = (value: string): boolean => {
    // 6-18 characters (extreme length with delimiters)
    if (value.length < 6 || value.length > 18) {
      return false;
    }
    /**
     * Matches Czech phone number entered with delimiters
     * (spaces, dots, brackets, etc.)
     */
    // const regex = /^(\+420\s?)?((5\d{2}|60[1-8]|70[2-5]|72\d|73[0-9]|77[0-9])\s?\d{3}\s?\d{3})$/;

    /**
     * Matches a generic format of a phone number with allowed delimiters.
     * https://stackoverflow.com/a/20349730
     */
    const regex = /^(\+|00)?[1-9][0-9 \-\(\)\.]{7,32}$/;
    return regex.test(value);
  };

  const isIdentical = (confirm: string, password: string): boolean => {
    return confirm === password;
  };

  const isFilled = (val: string | number | object): boolean => {
    // null is object so check first
    if (val === null) {
      return false;
    } else if (typeof val === 'object') {
      // array
      if (Array.isArray(val)) {
        return val.length > 0;
      }
      // object
      return Object.keys(val).length > 0;
    } else if (typeof val === 'number') {
      // number
      return val !== 0;
    } else if (typeof val === 'string') {
      // string
      return val.trim().length > 0;
    }
    return false;
  };

  const isAboveZero = (val: string | number): boolean => {
    if (typeof val === 'number') {
      return val > 0;
    } else {
      const numberVal: number = parseFloat(val);
      if (isNaN(numberVal)) {
        return val?.length > 0;
      } else {
        return numberVal > 0;
      }
    }
  };

  const isStrongPassword = (value: string): boolean => {
    const isLong = value.length > 5;
    const hasLetter = /[a-zA-Z]/.test(value);
    return isLong && hasLetter;
  };

  const isBusinessId = (value: string): boolean => {
    const isLong = value.length === 8;
    const allNumbers = /^[0-9]+$/.test(value);
    return isLong && allNumbers;
  };

  /**
   * Check if the value is a valid ZIP code
   * @param {string} value - The value to check
   * @returns {boolean} - True if the value is a valid ZIP code, false otherwise
   */
  const isZip = (value: string): boolean => {
    const zipNumber = Number(value);
    // check if value is number and in range
    return !isNaN(zipNumber) && zipNumber >= 10000 && zipNumber <= 99999;
  };

  return {
    isEmail,
    isEmailList,
    isFilled,
    isIdentical,
    isAboveZero,
    isPhone,
    isStrongPassword,
    isBusinessId,
    isZip,
  };
};
