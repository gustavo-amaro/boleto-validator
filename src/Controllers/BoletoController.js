const validateBoletoConvenio = require("../Utils/validateBoletoConvenio");
const validateBoletoTitulo = require("../Utils/validateBoletoTitulo");

class BoletoController {
  validateBoleto(req, res) {
    const { digitableLine } = req.params;

    const onlyNumbers = /^\d+$/.test(digitableLine);
    if (!onlyNumbers) {
      return res
        .status(400)
        .json({ message: "A linha digitável só pode conter números." });
    }

    if (digitableLine.length === 47) {
      return validateBoletoTitulo(digitableLine, res);
    } else if (digitableLine.length === 48) {
      return validateBoletoConvenio(digitableLine, res);
    }

    return res
      .status(400)
      .json({ message: "A linha digitável deve 47 ou 48 números." });
  }
}

module.exports = BoletoController;
