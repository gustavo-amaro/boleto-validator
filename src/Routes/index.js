const express = require("express");
const BoletoController = require("../Controllers/BoletoController");

class Routes {
  router = express.Router();

  constructor() {
    this.registerRoutes();
  }

  registerRoutes() {
    const boletoController = new BoletoController();
    this.router.get("/boleto/:barCode", boletoController.validateBoleto);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = Routes;
