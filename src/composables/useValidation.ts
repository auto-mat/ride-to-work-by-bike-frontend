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

  const isIdentical = (confirm: string, password: string): boolean => {
    return confirm === password;
  };

  const isFilled = (val: string): boolean => val?.length > 0;

  const isStrongPassword = (value: string): boolean => {
    const isLong = value.length > 5;
    const hasLetter = /[a-zA-Z]/.test(value);
    return isLong && hasLetter;
  };

  return {
    isEmail,
    isFilled,
    isIdentical,
    isStrongPassword,
  };
};
