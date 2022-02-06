const {
  getFormatedAmount,
  reverseString,
  digitableLineToBarCode,
} = require("./Commons");

/**
 *
 * @param {string} field
 * @param {*} verifiyingDigit
 * @param {1|2} initialMultiplier
 * @returns {boolean} true se o dígito verificador do campo for válido
 */
const isFieldVerifyingDigitValid = (
  field,
  verifiyingDigit,
  initialMultiplier = 2
) => {
  let multiplier = initialMultiplier;
  let fieldMultiplier = 0;

  for (let char of field) {
    let valueMultiplied = parseInt(char) * multiplier;

    /**
     * Quando a soma tiver mais de 1 algarismo(ou seja, maior que 9),
     * soma-se os algarismos antes de somar com somatorio
     */
    if (valueMultiplied > 9) {
      valueMultiplied = valueMultiplied
        .toString()
        .split("")
        .reduce(function (sum, current) {
          return parseInt(sum) + parseInt(current);
        });
    }

    fieldMultiplier += valueMultiplied;

    if (multiplier === 2) multiplier = 1;
    else multiplier = 2;
  }

  const restDivision = fieldMultiplier % 10;
  /**
   * (Math.ceil(somatorio / 10) * 10) pega a dezena imediatamente superior ao somatorio
   * (dezena superior de 25 é 30, a de 43 é 50...).
   */
  const roundedFieldMultiplier = Math.ceil(fieldMultiplier / 10) * 10;

  let validVerifyingDigit = roundedFieldMultiplier - restDivision;
  validVerifyingDigit =
    validVerifyingDigit.toString()[validVerifyingDigit.toString().length - 1];

  return validVerifyingDigit === verifiyingDigit;
};

/**
 *
 * @param {string} barCode
 * @returns {boolean} true se o dígito verificador do código de barras for válido
 */
const isVerifyingDigitValid = (barCode) => {
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
};

/**
 *
 * @param {string} digitableLine
 * @returns {string} Data de vencimento formatada
 */
const getExpirationDate = (digitableLine) => {
  let expirationDateFactor = digitableLine.slice(33, 37);
  expirationDateFactor = parseInt(expirationDateFactor);
  const baseDate = "1997-10-07";
  const expirationDate = new Date(baseDate);
  expirationDate.setDate(expirationDate.getDate() + expirationDateFactor);

  return expirationDate.toISOString().slice(0, 10);
};

/**
 *
 * @param {string} digitableLine
 * @param {*} res
 * @returns {*} response em json
 */
const validateBoletoTitulo = (digitableLine, res) => {
  //campo 1
  const field1 = digitableLine.slice(0, 9);
  const verifiyingDigitField1 = digitableLine.slice(9, 10);

  if (!isFieldVerifyingDigitValid(field1, verifiyingDigitField1)) {
    return res
      .status(400)
      .json({ message: "O digito verificador do campo 1 é inválido!" });
  }

  //campo 2
  const field2 = digitableLine.slice(10, 20);
  const verifiyingDigitField2 = digitableLine.slice(20, 21);

  if (!isFieldVerifyingDigitValid(field2, verifiyingDigitField2, 1)) {
    return res
      .status(400)
      .json({ message: "O digito verificador do campo 2 é inválido!" });
  }

  //campo 3
  const field3 = digitableLine.slice(21, 31);
  const verifiyingDigitField3 = digitableLine.slice(31, 32);

  if (!isFieldVerifyingDigitValid(field3, verifiyingDigitField3, 1)) {
    return res
      .status(400)
      .json({ message: "O digito verificador do campo 3 é inválido!" });
  }

  const amount = digitableLine.slice(37, digitableLine.length);

  const barCode = digitableLineToBarCode(digitableLine, "TITULO");

  if (!isVerifyingDigitValid(barCode)) {
    return res.status(400).json({
      message: "O dígito verificador do código de barras é inválido!",
    });
  }

  const expirationDate = getExpirationDate(digitableLine);

  return res.json({
    barCode,
    amount: getFormatedAmount(amount),
    expirationDate,
  });
};

module.exports = validateBoletoTitulo;
