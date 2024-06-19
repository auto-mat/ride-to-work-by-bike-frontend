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
     * Match international phone number entered with delimiters
     * (spaces, dots, brackets, etc.)
     *
     * Note: does not account for specific mistakes such as:
     * Leading Zero in Area Code: +420 012 345 678
     * Too Many Digits: +420 123 456 7890
     * Starts with an Invalid Country Code: +999 123 456 789
     *
     * https://uibakery.io/regex-library/email
     */
    const regex =
      /^(\+420\s?)?((5\d{2}|60[1-8]|70[2-5]|72\d|73[0-9]|77[0-9])\s?\d{3}\s?\d{3})$/;
    return regex.test(value);
  };

  const isIdentical = (confirm: string, password: string): boolean => {
    return confirm === password;
  };

  const isFilled = (val: string): boolean => val?.length > 0;

  const isStrongPassword = (value: string): boolean => {
    const isLong = value.length > 5;
    const hasLetter = /[a-zA-Z]/.test(value);
    return isLong && hasLetter;
  };

  const isCompanyId = (value: string): boolean => {
    const isLong = value.length === 8;
    const allNumbers = /^[0-9]+$/.test(value);
    return isLong && allNumbers;
  };

  return {
    isEmail,
    isEmailList,
    isFilled,
    isIdentical,
    isPhone,
    isStrongPassword,
    isCompanyId,
  };
};
