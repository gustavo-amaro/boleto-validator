const {
  isFieldVerifyingDigitValid,
  isVerifyingDigitValid,
  getDueDate,
  getExpirationDate,
  getFormatedAmount,
} = require("../Utils/Boleto");

class BoletoController {
  validateBoleto(req, res) {
    const { digitableLine } = req.params;

    if (digitableLine.length !== 47)
      return res
        .status(400)
        .send({ message: "O linha digitável deve conter 47 dígitos." });

    const onlyNumbers = /^\d+$/.test(digitableLine);
    if (!onlyNumbers) {
      return res
        .status(400)
        .json({ message: "A linha digitável só pode conter números." });
    }

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
  }
}

module.exports = BoletoController;
