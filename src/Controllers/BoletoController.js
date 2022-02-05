class BoletoController {
  validateBoleto(req, res) {
    const { barCode } = req.params;

    return res.json({ barCode });
  }
}

module.exports = BoletoController;
