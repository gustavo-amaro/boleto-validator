const {
  getExpirationDate,
  getFormatedAmount,
  reverseString,
} = require("./Commons");

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
  const roundedFieldMultiplier = Math.ceil(fieldMultiplier / 10) * 10;

  let validVerifyingDigit = roundedFieldMultiplier - restDivision;
  validVerifyingDigit =
    validVerifyingDigit.toString()[validVerifyingDigit.toString().length - 1];

  return validVerifyingDigit === verifiyingDigit;
};

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

const validateBoletoTitulo = (digitableLine, res) => {
  //campo 1
  const codeBank = digitableLine.slice(0, 3);
  const codeCurrency = digitableLine.slice(3, 4);
  const vintea24BarCode = digitableLine.slice(4, 9);
  const field1 = codeBank + codeCurrency + vintea24BarCode;
  const verifiyingDigitField1 = digitableLine.slice(9, 10);

  if (!isFieldVerifyingDigitValid(field1, verifiyingDigitField1)) {
    return res
      .status(400)
      .json({ message: "O digito verificador do campo 1 é inválido!" });
  }

  //campo 2
  const vinte5a34BarCode = digitableLine.slice(10, 20);
  const field2 = vinte5a34BarCode;
  const verifiyingDigitField2 = digitableLine.slice(20, 21);

  if (!isFieldVerifyingDigitValid(field2, verifiyingDigitField2, 1)) {
    return res
      .status(400)
      .json({ message: "O digito verificador do campo 2 é inválido!" });
  }

  //campo 3
  const trintae5a44BarCode = digitableLine.slice(21, 31);
  const field3 = trintae5a44BarCode;
  const verifiyingDigitField3 = digitableLine.slice(31, 32);

  if (!isFieldVerifyingDigitValid(field3, verifiyingDigitField3, 1)) {
    return res
      .status(400)
      .json({ message: "O digito verificador do campo 3 é inválido!" });
  }

  //campo 4
  const verifyingDigitBarCode = digitableLine.slice(32, 33);

  //campo 5
  const expirationDateFactor = digitableLine.slice(33, 37);
  const amount = digitableLine.slice(37, digitableLine.length);

  const barCode =
    codeBank +
    codeCurrency +
    verifyingDigitBarCode +
    expirationDateFactor +
    amount +
    vintea24BarCode +
    vinte5a34BarCode +
    trintae5a44BarCode;

  if (!isVerifyingDigitValid(barCode)) {
    return res.status(400).json({
      message: "O digito verificador do código de barras é inválido!",
    });
  }

  const expirationDate = getExpirationDate(expirationDateFactor);

  return res.json({
    barCode,
    amount: getFormatedAmount(amount),
    expirationDate,
  });
};

module.exports = validateBoletoTitulo;
