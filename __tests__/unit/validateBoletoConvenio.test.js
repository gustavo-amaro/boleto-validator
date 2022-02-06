const BoletoController = require("../../src/Controllers/BoletoController");

const boletoController = new BoletoController();

test("validação de boleto de convênio com linha digitável válida", () => {
  const digitableLine = "836000000015314101380009489879609118000538985086";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.barCode).toBe("83600000001314101380004898796091100053898508");
  expect(response.amount).toBe("131.41");
});

test("validação de boleto de convênio com linha digitável inválida", () => {
  const digitableLine = "836000000015314101380009489879609118000538985087";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
});

test("validação de boleto com código verificador do bloco 1 inválido", () => {
  const digitableLine = "836000000014314101380009489879609118000538985086";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
  expect(response.message).toBe("O digito verificador do bloco 1 é inválido!");
});

test("validação de boleto com código verificador do bloco 2 inválido", () => {
  const digitableLine = "836000000015314101380008489879609118000538985086";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
  expect(response.message).toBe("O digito verificador do bloco 2 é inválido!");
});

test("validação de boleto com código verificador do bloco 3 inválido", () => {
  const digitableLine = "836000000015314101380009489879609117000538985086";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
  expect(response.message).toBe("O digito verificador do bloco 3 é inválido!");
});

test("validação de boleto com código verificador do bloco 4 inválido", () => {
  const digitableLine = "836000000015314101380009489879609118000538985085";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
  expect(response.message).toBe("O digito verificador do bloco 4 é inválido!");
});

test("validação de boleto de convênio sem valor e sem vencimento", () => {
  const digitableLine = "817700000000010936599702411310797039001433708318";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.amount).toBe("0.00");
  expect(response.barCode).toBe("81770000000010936599704113107970300143370831");
  expect(response.expirationDate).toBe("");
});

test("validação de boleto de convênio modulo 11 inválido", () => {
  const digitableLine = "818700000000010936599702411310797039001433708318";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);
  expect(response.status).toBe(400);
});

test("validação de boleto com caracteres além de números", () => {
  const digitableLine = "836000000015a3a14101380009489879609118000538985086";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
  expect(response.message).toBe("A linha digitável só pode conter números.");
});
