function reverseString(string = "") {
  const splitString = string.split("");
  const reverseStringArray = splitString.reverse();
  return reverseStringArray.join("");
}

module.exports = {
  isFieldVerifyingDigitValid(field, verifiyingDigit, initialMultiplier = 2) {
    let multiplier = initialMultiplier;
    let fieldMultiplier = 0;

    for (let char of field) {
      let valueMultiplied = parseInt(char) * multiplier;

      if (valueMultiplied > 9) {
        valueMultiplied = valueMultiplied - 10 + 1;
      }

      fieldMultiplier += valueMultiplied;

      if (multiplier === 2) multiplier = 1;
      else multiplier = 2;
    }

    const restDivision = fieldMultiplier % 10;
    const roundedFieldMultiplier = Math.ceil(fieldMultiplier / 10) * 10;

    let validVerifyingDigit = roundedFieldMultiplier - restDivision;
    validVerifyingDigit =
      validVerifyingDigit.toString()[validVerifyingDigit.toString().length - 1];

    return validVerifyingDigit === verifiyingDigit;
  },

  isVerifyingDigitValid(barCode) {
    const verifyingDigit = parseInt(barCode.slice(4, 5));
    if (verifyingDigit === 0) return false;

    const barCodeWithoutVerifyingDigit =
      barCode.slice(0, 4) + barCode.slice(5, barCode.length);

    let multiplier = 2;
    let sum = 0;

    for (let char of reverseString(barCodeWithoutVerifyingDigit)) {
      let valueMultiplied = parseInt(char) * multiplier;
      sum += valueMultiplied;

      if (multiplier === 9) multiplier = 2;
      else multiplier++;
    }

    const rest = sum % 11;
    const validVerifyingDigit = 11 - rest;

    if (
      validVerifyingDigit === 0 ||
      validVerifyingDigit === 10 ||
      validVerifyingDigit === 11
    )
      return verifyingDigit === 1;

    return validVerifyingDigit === verifyingDigit;
  },

  getExpirationDate(expirationDateFactor) {
    expirationDateFactor = parseInt(expirationDateFactor);
    const baseDate = "1997-10-07";
    const expirationDate = new Date(baseDate);
    expirationDate.setDate(expirationDate.getDate() + expirationDateFactor);

    return expirationDate.toISOString().slice(0, 10);
  },

  getFormatedAmount(amount) {
    amount = parseFloat(amount);
    amount = amount / 100;

    return amount.toFixed(2);
  },
};
